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

    // Initializes the Docker client with default configuration
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
        Path tarFile = null; // Temporary tar file for Docker copy
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

            // Copy the tar file into the container using the Docker CLI
            Process process = Runtime.getRuntime().exec("docker cp " + tarFile.toAbsolutePath().toString() + " " + containerId + ":/app/");
            process.waitFor(5, TimeUnit.SECONDS);
            System.out.println("Copy command executed via CLI");

            // Extract the tar file inside the container to get script.py
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

            // Verify the contents of /app directory post-copy
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
}



