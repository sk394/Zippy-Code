package com.zippycode.ZippyCode.service;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.ExecCreateCmdResponse;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientConfig;
import com.github.dockerjava.core.DockerClientImpl;
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient;
import com.github.dockerjava.api.async.ResultCallback;
import com.github.dockerjava.api.model.Frame;
import com.zippycode.ZippyCode.model.ExecutionResult;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.concurrent.TimeUnit;
import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveOutputStream;

@Service
public class CodeExecutionService {
    private DockerClient dockerClient;

    @Value("${code.execution.temp.directory:/tmp/zippycode}")
    private String tempDirectory;

    public CodeExecutionService() {
        DockerClientConfig config = DefaultDockerClientConfig.createDefaultConfigBuilder().build();
        this.dockerClient = DockerClientImpl.getInstance(config, new ApacheDockerHttpClient.Builder()
                .dockerHost(config.getDockerHost())
                .sslConfig(config.getSSLConfig())
                .connectionTimeout(Duration.ofSeconds(30))
                .responseTimeout(Duration.ofSeconds(45))
                .build());
    }

    public ExecutionResult execute(String code, String testInput, String expectOutput) {
        Path tempFile = null;
        Path tarFile = null;
        String containerId = null;

        try {
            // Create temp file with user's code
            tempFile = Files.createTempFile("script", ".py");
            Files.write(tempFile, code.getBytes(StandardCharsets.UTF_8));
            System.out.println("Temp file created: " + tempFile.toAbsolutePath());

            // Create a .tar file
            tarFile = Paths.get(tempFile.toString() + ".tar");
            try (TarArchiveOutputStream tarOut = new TarArchiveOutputStream(new FileOutputStream(tarFile.toFile()))) {
                TarArchiveEntry entry = new TarArchiveEntry("script.py");
                entry.setSize(Files.size(tempFile));
                tarOut.putArchiveEntry(entry);
                Files.copy(tempFile, tarOut);
                tarOut.closeArchiveEntry();
            }
            System.out.println("Created tar file: " + tarFile.toAbsolutePath());

            // Create and start container
            CreateContainerResponse container = dockerClient.createContainerCmd("python:alpine")
                    .withCmd("tail", "-f", "/dev/null")
                    .exec();
            containerId = container.getId();
            dockerClient.startContainerCmd(containerId).exec();
            System.out.println("Container started: " + containerId);

            // Create /app directory
            ExecCreateCmdResponse mkdirCmd = dockerClient.execCreateCmd(containerId)
                    .withCmd("mkdir", "-p", "/app")
                    .exec();
            dockerClient.execStartCmd(mkdirCmd.getId())
                    .exec(new ResultCallback.Adapter<Frame>())
                    .awaitCompletion(5, TimeUnit.SECONDS);
            System.out.println("Created /app directory");

            // Copy using docker CLI
            Process process = Runtime.getRuntime().exec("docker cp " + tarFile.toAbsolutePath().toString() + " " + containerId + ":/app/");
            process.waitFor(5, TimeUnit.SECONDS);
            System.out.println("Copy command executed via CLI");

            // Extract the tar file in the container with correct filename
            String tarFileName = tarFile.getFileName().toString();
            ExecCreateCmdResponse extractCmd = dockerClient.execCreateCmd(containerId)
                    .withCmd("sh", "-c", "tar -xvf /app/" + tarFileName + " -C /app/")
                    .withAttachStdout(true)
                    .withAttachStderr(true)
                    .exec();
            ByteArrayOutputStream extractOut = new ByteArrayOutputStream();
            dockerClient.execStartCmd(extractCmd.getId())
                    .exec(new ResultCallback.Adapter<Frame>() {
                        @Override
                        public void onNext(Frame frame) {
                            extractOut.write(frame.getPayload(), 0, frame.getPayload().length);
                        }
                    }).awaitCompletion(5, TimeUnit.SECONDS);
            System.out.println("Tar extraction output: " + extractOut.toString(StandardCharsets.UTF_8));

            // Check contents
            ExecCreateCmdResponse checkCmd = dockerClient.execCreateCmd(containerId)
                    .withCmd("sh", "-c", "ls -l /app/")
                    .exec();
            dockerClient.execStartCmd(checkCmd.getId())
                    .exec(new ResultCallback.Adapter<Frame>() {
                        @Override
                        public void onNext(Frame frame) {
                            System.out.println("POST-COPY /app contents: " + new String(frame.getPayload(), StandardCharsets.UTF_8));
                        }
                        @Override
                        public void onError(Throwable throwable) {
                            System.err.println("POST-COPY Check error: " + throwable.getMessage());
                        }
                    }).awaitCompletion(5, TimeUnit.SECONDS);

            // Prepare to capture output
            ByteArrayOutputStream stdout = new ByteArrayOutputStream();
            ByteArrayOutputStream stderr = new ByteArrayOutputStream();

            // Execute the script with test input
            ExecCreateCmdResponse execCreateCmdResponse = dockerClient.execCreateCmd(containerId)
                    .withAttachStdin(true)
                    .withAttachStdout(true)
                    .withAttachStderr(true)
                    .withCmd("python", "/app/script.py")
                    .exec();

            dockerClient.execStartCmd(execCreateCmdResponse.getId())
                    .withStdIn(new ByteArrayInputStream(testInput.getBytes(StandardCharsets.UTF_8)))
                    .exec(new ResultCallback.Adapter<Frame>() {
                        @Override
                        public void onNext(Frame frame) {
                            String payload = new String(frame.getPayload(), StandardCharsets.UTF_8);
                            System.out.println("RAW OUTPUT: " + payload);
                            switch (frame.getStreamType()) {
                                case STDOUT:
                                    stdout.write(frame.getPayload(), 0, frame.getPayload().length);
                                    break;
                                case STDERR:
                                    stderr.write(frame.getPayload(), 0, frame.getPayload().length);
                                    break;
                                default:
                                    break;
                            }
                        }
                        @Override
                        public void onError(Throwable throwable) {
                            System.err.println("DEBUG Exec error: " + throwable.getMessage());
                        }
                    }).awaitCompletion(10, TimeUnit.SECONDS);

            // Get execution results
            String actualOutput = stdout.toString(StandardCharsets.UTF_8.name()).trim();
            String errorMessage = stderr.toString(StandardCharsets.UTF_8.name()).trim();

            boolean success = actualOutput.equals(expectOutput) && errorMessage.isEmpty();

            return new ExecutionResult(success, actualOutput, errorMessage);
        } catch (Exception e) {
            return new ExecutionResult(false, "", "Execution error: " + e.getMessage());
        } finally {
            // Cleanup
            try {
                if (containerId != null) {
                    dockerClient.stopContainerCmd(containerId).withTimeout(2).exec();
                    dockerClient.removeContainerCmd(containerId).exec();
                }
                if (tempFile != null) {
                    Files.deleteIfExists(tempFile);
                }
                if (tarFile != null) {
                    Files.deleteIfExists(tarFile);
                }
            } catch (Exception e) {
                System.err.println("Error during cleanup: " + e.getMessage());
            }
        }
    }

//    public ExecutionResult executeCode(Solution solution, TestCases testcase) {
//        String executionId = UUID.randomUUID().toString();
//        String executionDir = tempDirectory + "/" + executionId;
//
//        try {
//            // create directory if it doesn't exist
//            Files.createDirectories(Paths.get(executionDir));
//
//            // route to appropriate language
//            switch (solution.getLang().toLowerCase()) {
//                case "java":
//                    return handleJavaCode(solution.getCode(), testcase, executionDir, executionId);
//                case "cpp":
//                    return handleCppCode(solution.getCode(), testcase, executionDir, executionId);
//                case "python":
//                    return handlePythonCode(solution.getCode(), testcase, executionDir, executionId);
//                default:
//                    return new ExecutionResult(false, true,
//                            "Unsupported Language: " + solution.getLang(),
//                            "", testcase.getInput(), testcase.getExpectedOutput());
//            }
//        } catch (Exception e) {
//            return new ExecutionResult(false, true,
//                    "Execution error: " + e.getMessage(),
//                    "", testcase.getInput(), testcase.getExpectedOutput());
//        } finally {
//            try {
//                deleteDirectory(Paths.get(executionDir).toFile());
//            } catch (Exception e) {
//                System.err.println("Error cleaning up directory");
//            }
//        }
//    }
//
//    private ExecutionResult handleJavaCode(String code, TestCases testcase, String executionDir, String executionId) throws IOException, InterruptedException {
//        // write java code to file
//        String fileName = "Main.java";
//        Path filePath = Paths.get(executionDir, fileName);
//        Files.write(filePath, code.getBytes());
//
//        // write input to file
//        Path inputFilePath = Paths.get(executionDir, "input.txt");
//        Files.write(inputFilePath, testcase.getInput().getBytes());
//
//        // compile the code
//        ProcessBuilder compiler = new ProcessBuilder(
//                "docker", "run","--rm","-v",executionDir + ":/code",
//                "coderunner_java", "javac","/code/" + fileName
//        );
//
//        Process compileProcess = compiler.start();
//        List<String> compilerErrors = readProcessError(compileProcess);
//
//        if(!compileProcess.waitFor(30, TimeUnit.SECONDS)) {
//            compileProcess.destroyForcibly();
//            return new ExecutionResult(false, true,
//                    "Compilation timed out",
//                    "", testcase.getInput(), testcase.getExpectedOutput());
//        }
//
//        if (compileProcess.exitValue() != 0) {
//            return new ExecutionResult(false, true,
//                    "Compilation Error: " + String.join("\n", compilerErrors),
//                    "", testcase.getInput(), testcase.getExpectedOutput());
//        }
//
//        // execute the code
//        ProcessBuilder runProcessBuilder = new ProcessBuilder(
//                "docker","run","--rm","-i","-v", executionDir + ":/code",
//                "coderunner_java","java","-cp", "/code","Main"
//        );
//
//        Process runProcess = runProcessBuilder.start();
//
//        // feed input to the process
//        if (!testcase.getInput().isEmpty()) {
//            try{
//                runProcess.getOutputStream().write(testcase.getInput().getBytes());
//                runProcess.getOutputStream().flush();
//                runProcess.getOutputStream().close();
//            } catch(IOException e) {
//                System.err.println("Error " + e.getMessage());
//            }
//        }
//        // Collect output
//        List<String> output = readProcessOutput(runProcess);
//        List<String> errors = readProcessError(runProcess);
//
//        if (!runProcess.waitFor(30, TimeUnit.SECONDS)) {
//            runProcess.destroyForcibly();
//            return new ExecutionResult(false, true,
//                    "Execution timed out",
//                    "", testcase.getInput(), testcase.getExpectedOutput());
//        }
//
//        if (runProcess.exitValue() != 0) {
//            return new ExecutionResult(false, true,
//                    "Runtime Error: " + String.join("\n", errors),
//                    String.join("\n", output), testcase.getInput(), testcase.getExpectedOutput());
//        }
//
//        String outputValue = String.join("\n", output);
//        boolean success = outputValue.trim().equals(testcase.getExpectedOutput().trim());
//
//        return new ExecutionResult(
//                success,
//                false,
//                success ? "All Test Cases Passed" : "Test Cases Failed",
//                outputValue,
//                testcase.getInput(),
//                testcase.getExpectedOutput()
//        );
//    }
//
//    private ExecutionResult handleCppCode(String code, TestCases testcase, String executionDir, String executionId) throws IOException, InterruptedException {
//        // write C++ code
//        String fileName = "main.cpp";
//        Path filePath = Paths.get(executionDir, fileName);
//        Files.write(filePath, code.getBytes());
//
//        // write input to file
//        Path inputFilePath = Paths.get(executionDir, "input.txt");
//        Files.write(inputFilePath, testcase.getInput().getBytes());
//
//        // compile the code
//        ProcessBuilder compileProcessBuilder = new ProcessBuilder(
//                "docker", "run", "--rm", "-v", executionDir + ":/code",
//                "coderunner_cpp", "g++", "/code/" + fileName, "-o", "/code/main"
//        );
//
//        Process compileProcess = compileProcessBuilder.start();
//        List<String> compileErrors = readProcessError(compileProcess);
//
//        if (!compileProcess.waitFor(30, TimeUnit.SECONDS)) {
//            compileProcess.destroyForcibly();
//            return new ExecutionResult(false, true,
//                    "Compilation timed out",
//                    "", testcase.getInput(), testcase.getExpectedOutput());
//        }
//
//        if (compileProcess.exitValue() != 0) {
//            return new ExecutionResult(false, true,
//                    "Compilation Error: " + String.join("\n", compileErrors),
//                    "", testcase.getInput(), testcase.getExpectedOutput());
//        }
//
//        // Execute the code
//        ProcessBuilder runProcessBuilder = new ProcessBuilder(
//                "docker", "run", "--rm", "-i", "-v", executionDir + ":/code",
//                "coderunner_cpp", "/code/main"
//        );
//
//        Process runProcess = runProcessBuilder.start();
//
//        // Feed input to the process
//        if (!testcase.getInput().isEmpty()) {
//            try {
//                runProcess.getOutputStream().write(testcase.getInput().getBytes());
//                runProcess.getOutputStream().flush();
//                runProcess.getOutputStream().close();
//            } catch (IOException e) {
//                System.err.println("Error writing input: " + e.getMessage());
//            }
//        }
//
//        // Collect output
//        List<String> output = readProcessOutput(runProcess);
//        List<String> errors = readProcessError(runProcess);
//
//        if (!runProcess.waitFor(30, TimeUnit.SECONDS)) {
//            runProcess.destroyForcibly();
//            return new ExecutionResult(false, true,
//                    "Execution timed out",
//                    "", testcase.getInput(), testcase.getExpectedOutput());
//        }
//
//        if (runProcess.exitValue() != 0) {
//            return new ExecutionResult(false, true,
//                    "Runtime Error: " + String.join("\n", errors),
//                    String.join("\n", output), testcase.getInput(), testcase.getExpectedOutput());
//        }
//
//        String outputValue = String.join("\n", output);
//        boolean success = outputValue.trim().equals(testcase.getExpectedOutput().trim());
//
//        return new ExecutionResult(
//                success,
//                false,
//                success ? "All Test Cases Passed" : "Test Cases Failed",
//                outputValue,
//                testcase.getInput(),
//                testcase.getExpectedOutput()
//        );
//    }
//
//    private ExecutionResult handlePythonCode(String code, TestCases testCase, String executionDir, String executionId) throws IOException, InterruptedException {
//        // Write Python code to file
//        String fileName = "main.py";
//        Path filePath = Paths.get(executionDir, fileName);
//        Files.write(filePath, code.getBytes());
//
//        // Write input to file
//        Path inputFilePath = Paths.get(executionDir, "input.txt");
//        Files.write(inputFilePath, testCase.getInput().getBytes());
//
//        // Execute the code
//        ProcessBuilder runProcessBuilder = new ProcessBuilder(
//                "docker", "run", "--rm", "-i", "-v", executionDir + ":/code",
//                "zippycode/coderunner_python:latest", "python3", "/code/main.py"
//        );
//
//        Process runProcess = runProcessBuilder.start();
//
//        // Feed input to the process
//        if (!testCase.getInput().isEmpty()) {
//            try {
//                runProcess.getOutputStream().write(testCase.getInput().getBytes());
//                runProcess.getOutputStream().flush();
//                runProcess.getOutputStream().close();
//            } catch (IOException e) {
//                System.err.println("Error writing input: " + e.getMessage());
//            }
//        }
//
//        // Collect output
//        List<String> output = readProcessOutput(runProcess);
//        List<String> errors = readProcessError(runProcess);
//
//        if (!runProcess.waitFor(30, TimeUnit.SECONDS)) {
//            runProcess.destroyForcibly();
//            return new ExecutionResult(false, true,
//                    "Execution timed out",
//                    "", testCase.getInput(), testCase.getExpectedOutput());
//        }
//
//        if (runProcess.exitValue() != 0) {
//            return new ExecutionResult(false, true,
//                    "Runtime Error: " + String.join("\n", errors),
//                    String.join("\n", output), testCase.getInput(), testCase.getExpectedOutput());
//        }
//
//        String outputValue = String.join("\n", output);
//        boolean success = outputValue.trim().equals(testCase.getExpectedOutput().trim());
//
//        return new ExecutionResult(
//                success,
//                false,
//                success ? "All Test Cases Passed" : "Test Cases Failed",
//                outputValue,
//                testCase.getInput(),
//                testCase.getExpectedOutput()
//        );
//    }
//
//    private List<String> readProcessOutput(Process process) throws IOException {
//        List<String> output = new ArrayList<>();
//        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
//            String line;
//            while ((line = reader.readLine()) != null) {
//                output.add(line);
//            }
//        }
//        return output;
//    }
//
//    private List<String> readProcessError(Process process) throws IOException {
//        List<String> errors = new ArrayList<>();
//        try (BufferedReader reader = new BufferedReader((new InputStreamReader(process.getErrorStream())))) {
//            String line;
//            while ((line = reader.readLine()) != null) {
//                errors.add(line);
//            }
//        }
//        return errors;
//    }
//
//    private void deleteDirectory(File directory) throws IOException {
//        if (directory.exists()) {
//            File[] files = directory.listFiles();
//            if (files != null) {
//                for (File file : files) {
//                    if (file.isDirectory()) {
//                        deleteDirectory(file);
//                    } else {
//                        Files.delete(file.toPath());
//                    }
//                }
//            }
//            Files.delete(directory.toPath());
//        }
//    }
}



