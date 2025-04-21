import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const LLMResponse = ({ response }) => {
    return (
        <div className="llm-response prose dark:prose-invert max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={atomDark}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-md"
                                showLineNumbers={true}
                                wrapLines={true}
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={`${className} bg-gray-800 text-gray-100 px-1 py-0.5 rounded`} {...props}>
                                {children}
                            </code>
                        );
                    },
                    // Customize other markdown elements
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                    p: ({ node, ...props }) => <p className="my-3" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-3" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-3" {...props} />,
                    li: ({ node, ...props }) => <li className="my-1" {...props} />,
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-4">
                            <table className="min-w-full divide-y divide-gray-300 border border-gray-300" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => <thead className="bg-gray-100" {...props} />,
                    tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-200" {...props} />,
                    tr: ({ node, ...props }) => <tr className="even:bg-gray-50" {...props} />,
                    th: ({ node, ...props }) => (
                        <th className="px-4 py-2 text-left font-medium text-gray-900" {...props} />
                    ),
                    td: ({ node, ...props }) => <td className="px-4 py-2" {...props} />,
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 py-1 italic my-4 text-gray-700" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                        <a className="text-blue-600 hover:text-blue-800 hover:underline" {...props} />
                    ),
                    img: ({ node, ...props }) => (
                        <img className="max-w-full h-auto my-4 rounded-md" {...props} />
                    ),
                    hr: ({ node, ...props }) => <hr className="my-6 border-t border-gray-300" {...props} />,
                    pre: ({ node, ...props }) => <pre className="my-4" {...props} />,
                }}
            >
                {response}
            </ReactMarkdown>
        </div>
    );
};

export default LLMResponse;