"use client";

import { Editor } from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import useQuery from "./hooks/use-query";
import { useEffect, useState } from "react";
import { useMutation } from "./hooks/use-mutation";
import useMarkQuestionAsSolved from "./hooks/use-question-mark";
import { useUser } from "@clerk/clerk-react";


const QuestionDetails = () => {
    const { id } = useParams();
    const { user } = useUser();
    const { data: question, loading, error } = useQuery(`questions/${id}`);
    const [submitCode, { isLoading, error: postError, data: result }] = useMutation("code/submit");
    const { markAsSolved } = useMarkQuestionAsSolved();

    const [code, setCode] = useState("");
    const [hasResult, setHasResult] = useState(false);

    useEffect(() => {
        if (question && question.codeSnippets && Array.isArray(question.codeSnippets) && question.codeSnippets.length > 0) {
            setCode(question.codeSnippets[0].code || "");
        }
    }, [question]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleSubmitCode = async (e) => {
        e.preventDefault();
        const body = {
            id: `solution-${id}`,
            questionId: id,
            lang: "Python",
            langSlug: "python",
            code: code
        };
        try {
            await submitCode(body);
            setHasResult(true);
        } catch (error) {
            console.error(error);
        }
    };

    // Render the result properly
    const renderResult = () => {
        if (!result) return null;

        return (
            <div className="flex flex-col">
                <div className="flex flex-row gap-2">
                    {result.success ?
                        <div className="flex flex-row gap-2">
                            <div className="badge badge-success">Correct</div>
                            <button onClick={async () => {
                                await markAsSolved(id, user.id);
                                alert("Question marked as solved!");
                            }}>
                                Submit
                            </button>
                        </div>
                        :
                        <div className="badge badge-warning w-full">Incorrect!</div>}

                    {result.actualOutput && (
                        <span>
                            <pre>Your Output: {result.actualOutput}</pre>
                        </span>
                    )}
                </div>
                <div className="ml-12 pl-6">
                    <pre>Expected Output: {question?.testCases?.expectedOutput}</pre>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="grid grid-cols-5 gap-2">
                <div className="col-span-2">
                    {/* Questions and Test cases go over here */}
                    <div className="mockup-window border border-base-300 w-full">
                        <div className="grid place-content-center border-t border-base-300 h-screen">
                            {error && <div>Error: {error}</div>}
                            <div className="flex w-full flex-col">
                                <div className="flex flex-wrap card h-full py-4 justify-start space-y-3">
                                    <code>{question?.topics?.map(topic => (<span className="px-1 font-bold" key={topic}>{topic.toUpperCase()}</span>))}</code>
                                    <code>{question?.content}</code>
                                </div>
                                <div className="divider"></div>
                                <div className="card grid h-full py-2 place-items-center">
                                    <code>{question?.testCases ?
                                        <div>
                                            {question?.testCases?.input} {"=>"} {question?.testCases?.expectedOutput}
                                        </div>
                                        :
                                        <div>No test cases available</div>}
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-3 flex flex-col">
                    <div className="bg-slate-950 p-2 flex flex-row justify-between items-center h-20">
                        <div className="flex flex-wrap w-1/2">
                            {!hasResult && <pre>{!isLoading ? "Submit your code to check your result!!" : <span>Checking.....</span>}</pre>}
                            {renderResult()}
                            {postError && <pre>{postError}</pre>}
                        </div>
                        <button className="btn btn-outline btn-success btn-sm"
                            onClick={handleSubmitCode}
                            disabled={isLoading}
                        >
                            Submit
                        </button>
                    </div>
                    {/* Coding playground over here */}
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

};

export default QuestionDetails;