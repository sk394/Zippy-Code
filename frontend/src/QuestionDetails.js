"use client";

import { Editor } from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import useQuery from "./hooks/use-query";
import { useEffect, useState } from "react";


const QuestionDetails = () => {
    const { id } = useParams();
    const { data: question, loading, error } = useQuery(`questions/${id}`);
    
    const [code, setCode] = useState("");

    useEffect(() => {
        if (question && question.codeSnippets && Array.isArray(question.codeSnippets) && question.codeSnippets.length > 0) {
            setCode(question.codeSnippets[0].code || "");
        }
    }, [question]);
    
    return (
        <div>
            <div className="grid grid-cols-5 grid-rows-5 gap-4">
                <div className="col-span-2 row-span-5">
                    {/* Questions and Test cases go over here */}
                    <div className="mockup-window border border-base-300 w-full">
                        <div className="grid place-content-center border-t border-base-300 h-screen">
                            {loading && <div>Loading...</div>}
                            {error && <div>Error: {error}</div>}
                            <div className="flex w-full flex-col">
                                <div className="card bg-base-300 rounded-box grid h-full py-4 place-items-center">
                                    <code>{question?.content}</code>
                                </div>
                                <div className="divider"></div>
                                <div className="card bg-base-300 rounded-box grid h-full py-2 place-items-center">
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
                <div className="col-span-3 row-span-5 col-start-3">
                    {/* Coding playground over here */}
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
                        onChange={(value) => console.log(value)}
                    />
                </div>
            </div>
        </div>
    );

};

export default QuestionDetails;