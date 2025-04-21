import { useState, useEffect } from 'react';
import { Play, Save, Clock, AlertTriangle, Check, X } from 'lucide-react';
import { useJudge0 } from './hooks/use-code';
import { Editor } from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import useQuery from './hooks/use-query';
import useMarkQuestionAsSolved from './hooks/use-question-mark';


export default function QuestionDetails() {
    const { id } = useParams();
    const { user } = useUser();
    const { data: question, loading, error } = useQuery(`questions/${id}`);
    const { solveQuestion, loading: submitLoading } = useMarkQuestionAsSolved();

    const [code, setCode] = useState("");
    const [input, setInput] = useState("");
    const [savedCodes, setSavedCodes] = useState([]);
    const [selectedSavedCode, setSelectedSavedCode] = useState(null);

    // Judge0 hook for code execution
    const {
        loading: judge0Loading,
        error: judge0Error,
        result: judge0Result,
        executeCode
    } = useJudge0();

    // Load question code when question data arrives
    useEffect(() => {
        if (question && question.codeSnippets && Array.isArray(question.codeSnippets) && question.codeSnippets.length > 0) {
            setCode(question.codeSnippets[0].code || "");
        }

        // Set input from test cases if available
        if (question && question.testCases && question.testCases.input) {
            setInput(question.testCases.input);
        }
    }, [question]);

    // Load saved codes from localStorage
    useEffect(() => {
        const savedItems = localStorage.getItem(`savedCodes-question-${id}`);
        if (savedItems) {
            setSavedCodes(JSON.parse(savedItems));
        }
    }, [id]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }


    // Execute code using Judge0
    const handleRunCode = async () => {
        await executeCode(code, input);
    };

    // Save code to localStorage
    const handleSaveCode = () => {
        if (code.trim() === '') return;

        const newCode = {
            id: Date.now(),
            title: `Solution ${savedCodes.length + 1}`,
            code,
            input,
            createdAt: new Date().toISOString()
        };

        const updatedCodes = [...savedCodes, newCode];
        setSavedCodes(updatedCodes);
        localStorage.setItem(`savedCodes-question-${id}`, JSON.stringify(updatedCodes));
        setSelectedSavedCode(newCode.id);
    };

    // Load saved code
    const loadSavedCode = (savedCode) => {
        setCode(savedCode.code);
        if (savedCode.input) {
            setInput(savedCode.input);
        }
        setSelectedSavedCode(savedCode.id);
    };

    // Check if Judge0 output matches expected output
    const isOutputCorrect = () => {
        if (!judge0Result || !judge0Result.stdout || !question || !question.testCases || !question.testCases.expectedOutput) {
            return false;
        }

        // Trim whitespace and normalize line endings
        const normalizedActual = judge0Result.stdout.trim().replace(/\r\n/g, '\n').replace(/\s/g, '');
        const normalizedExpected = question.testCases.expectedOutput.trim().replace(/\r\n/g, '\n').replace(/\s/g, '');

        return normalizedActual === normalizedExpected;
    };

    const handleMarkAsSolved = async () => {
        try {
            await solveQuestion(id, user.emailAddresses[0].emailAddress.split('@')[0]);
            alert("Question marked as solved!");
        } catch (err) {
            console.log('Failed to mark question as solved');
            alert("Failed to mark question as solved.");
        }
    };

    // Render Judge0 execution results
    const renderJudge0Result = () => {
        if (!judge0Result) return null;

        const isCorrect = isOutputCorrect();

        return (
            <div className="flex flex-col gap-2 bg-slate-800 p-3 rounded-md">
                <div className="flex items-center gap-2">
                    {isCorrect ? (
                        <div className="flex items-center gap-2 text-green-400">
                            <Check size={16} />
                            <span className="font-medium">Correct Answer</span>
                            <button
                                className="btn btn-xs btn-outline btn-success ml-2"
                                onClick={handleMarkAsSolved}
                                disabled={submitLoading}
                            >
                                Mark As Solved
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-yellow-400">
                            <X size={16} />
                            <span className="font-medium">Incorrect Answer</span>
                        </div>
                    )}

                    {judge0Result.time && (
                        <span className=" sm:ml-8 text-xs text-gray-400 ml-auto">
                            Time: {judge0Result.time}s, Memory: {judge0Result.memory} KB
                        </span>
                    )}
                </div>

                {judge0Result.compile_output && (
                    <div className="mt-2">
                        <div className="text-sm text-gray-300">Compilation Output:</div>
                        <pre className="text-xs bg-slate-900 p-2 rounded whitespace-pre-wrap text-red-400">{judge0Result.compile_output}</pre>
                    </div>
                )}

                {judge0Result.stdout && (
                    <div className="mt-2">
                        <div className="text-sm text-gray-300">Your Output:</div>
                        <pre className="text-xs bg-slate-900 p-2 rounded whitespace-pre-wrap text-green-400">{judge0Result.stdout}</pre>
                    </div>
                )}

                {judge0Result.stderr && (
                    <div className="mt-2">
                        <div className="text-sm text-red-400">Standard Error:</div>
                        <pre className="text-xs bg-slate-900 p-2 rounded whitespace-pre-wrap text-red-400">{judge0Result.stderr}</pre>
                    </div>
                )}

                <div className="mt-2">
                    <div className="text-sm text-gray-300">Expected Output:</div>
                    <pre className="text-xs bg-slate-900 p-2 rounded whitespace-pre-wrap text-blue-400">{question?.testCases?.expectedOutput}</pre>
                </div>
            </div>
        );
    };

    return (
        <div className="h-screen flex flex-col">
            <div className="grid grid-cols-5 gap-2 flex-grow">
                <div className="col-span-2 flex flex-col h-screen ">
                    {/* Questions and Test cases go over here */}
                    <div className="mockup-window border border-base-300 w-full flex-1 overflow-y-auto  ">
                        <div className="grid justify-items-start border-t border-base-300 ">
                            {error && <div className="p-4 text-red-500">Error: {error}</div>}
                            <div className="flex w-full flex-col">
                                <div className="flex flex-wrap card h-full py-3 justify-start space-y-2 p-4">
                                    <code className="flex flex-wrap gap-2">
                                        {question?.topics?.map(topic => (
                                            <span className="px-2 py-1 bg-slate-700 text-white rounded text-xs font-bold" key={topic}>{topic.toUpperCase()}</span>
                                        ))}
                                    </code>
                                    <code className="inline-flex place-items-start whitespace-pre-wrap">{question?.content}</code>
                                    <hr />
                                    <code>{question?.testCases ?
                                        <div className="w-full">
                                            <div className="mb-2 font-semibold text-slate-600">Test Case:</div>
                                            <div className="flex flex-col gap-2">
                                                <div>
                                                    <div className="text-sm text-slate-500">Input:</div>
                                                    <pre className="p-2  rounded">{question?.testCases?.input}</pre>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-slate-500">Expected Output:</div>
                                                    <pre className="p-2  rounded">{question?.testCases?.expectedOutput}</pre>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div>No test cases available</div>}
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Saved Codes Section */}
                    <div className="flex-1 overflow-y-auto mt-2 bg-slate-800 p-3 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-medium">Saved Solutions</h3>
                            <button
                                onClick={handleSaveCode}
                                className="btn btn-xs btn-outline btn-info flex items-center gap-1"
                            >
                                <Save size={12} />
                                <span>Save</span>
                            </button>
                        </div>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                            {savedCodes.length === 0 ? (
                                <div className="text-gray-400 text-xs">No saved solutions yet</div>
                            ) : (
                                savedCodes.map((savedCode) => (
                                    <div
                                        key={savedCode.id}
                                        onClick={() => loadSavedCode(savedCode)}
                                        className={`p-2 text-xs rounded cursor-pointer ${selectedSavedCode === savedCode.id ? 'bg-slate-600' : 'bg-slate-700'} hover:bg-slate-600`}
                                    >
                                        <div className="font-medium text-white">{savedCode.title}</div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(savedCode.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-span-3 flex flex-col">
                    {/* Results Bar */}
                    <div className="bg-slate-950 p-3 flex flex-col">
                        <div className="flex flex-row-reverse justify-between items-center">
                            <div className="flex flex-wrap">
                                {!judge0Result && !judge0Loading && (
                                    <pre className="text-gray-400 text-sm">Run or submit your code to check the result</pre>
                                )}
                                {(judge0Loading) && <pre className="text-blue-400 text-sm">Processing...</pre>}
                                {judge0Error && <pre className="text-red-400 text-sm">{judge0Error}</pre>}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="btn btn-outline btn-info btn-sm"
                                    onClick={handleRunCode}
                                    disabled={judge0Loading}
                                >
                                    <Play size={16} />
                                    Run
                                </button>
                            </div>
                            <div className="mb-1 grid grid-cols-2 gap-3">
                                {judge0Result && renderJudge0Result()}
                            </div>
                        </div>
                    </div>

                    {/* Coding playground  */}
                    <div className="flex-grow">
                        <Editor
                            height="100%"
                            defaultLanguage="python"
                            value={code || "print('Hello World')\n"}
                            theme="vs-dark"
                            options={{
                                minimap: {
                                    enabled: false,
                                },
                                fontSize: 16,
                                wordWrap: "on",
                            }}
                            onChange={(value) => setCode(value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}