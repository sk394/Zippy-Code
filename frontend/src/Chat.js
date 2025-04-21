import LLMResponse from "./components/llm-response";
import useChat from "./hooks/use-chat";
import { useEffect, useRef, useState } from "react";

export function Chat(props) {
  const [prompt, setPrompt] = useState('');
  const [showReasoning, setShowReasoning] = useState(false);
  const {
    chatResponse,
    reasoning,
    loading,
    error,
    streamingReasoning,
    streamingResponse,
    reasoningComplete,
    sendChat,
    cancelRequest
  } = useChat();


  const handleSubmit = (e) => {
    e.preventDefault();
    sendChat(prompt);
  };

  useEffect(() => {
    if (loading) {
      setShowReasoning(false);
    }
  }, [loading]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat with ZippyAI</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Create a question related to dynamic programming....."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex float-right justify-end">
          {loading ? (
            <button
              type="button"
              onClick={cancelRequest}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
            >
              Cancel
            </button>
          ) :
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
              Submit
            </button>

          }
        </div>
      </form >
      {error && (
        <div className="p-4 mb-4 border border-red-300 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      {
        (reasoning || chatResponse) && (
          <div className="mb-4">
            {(streamingReasoning) && (
              <div className="p-4 border border-yellow-200 rounded  mb-4">
                <h2 className="text-xl font-semibold mb-2">Thinking...</h2>
                <pre className="whitespace-pre-wrap font-mono text-sm">{reasoning}</pre>
                {streamingReasoning && (
                  <span className="inline-block animate-pulse ml-1">▌</span>
                )}
              </div>
            )}
            {reasoning && reasoningComplete && !streamingReasoning && (
              <div className="mb-4">
                <button
                  onClick={() => setShowReasoning(!showReasoning)}
                  className="px-3 py-1.5 mb-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md flex items-center"
                >
                  <span className="mr-1">{showReasoning ? 'Hide' : 'Show'} AI's Reasoning</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${showReasoning ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showReasoning && (
                  <div className="p-4 border border-pink-300 rounded bg-black bg-opacity-40">
                    <h2 className="text-xl font-semibold mb-2">AI's Reasoning Process</h2>
                    <div className="font-mono text-sm whitespace-pre-wrap">
                      {reasoning}
                    </div>
                  </div>
                )}
              </div>
            )}
            {(reasoningComplete || !reasoning) && (chatResponse || streamingResponse) && (
              <div className="relative p-4 border border-green-500 rounded ">
                <h2 className="text-xl font-semibold mb-2 ">Response</h2>
                <LLMResponse response={chatResponse} />
                {streamingResponse && (
                  <span className="inline-block animate-pulse ml-1">▌</span>
                )}
              </div>
            )}
          </div>
        )
      }
    </div >
  );
};;;
