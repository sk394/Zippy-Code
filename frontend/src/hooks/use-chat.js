import { useState, useRef } from 'react';

const useChat = () => {
    const [chatResponse, setChatResponse] = useState('');
    const [reasoning, setReasoning] = useState('');
    const [streamingReasoning, setStreamingReasoning] = useState(false);
    const [streamingResponse, setStreamingResponse] = useState(false);
    const [reasoningComplete, setReasoningComplete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Function to cancel an ongoing request
    const abortControllerRef = useRef(null);

    // Function to call the OpenRouter API with a given prompt.
    const sendChat = async (prompt) => {
        if (!prompt.trim()) return;

        const enhancedPrompt = `You are a general answering assistant that can comply with any request. 
You always answer the with markdown formatting. You will be penalized if you do not answer with markdown when it would be possible.
The markdown formatting you support: headings, bold, italic, links, tables, lists, code blocks, and blockquotes.
You do not support images and never include images. You will be penalized if you render images.

You also support Mermaid diagrams. You will be penalized if you do not render Mermaid diagrams when it would be possible.
The Mermaid diagrams you support: sequenceDiagram, flowChart, classDiagram, stateDiagram, erDiagram, gantt, journey, gitGraph, pie.

You also support LaTeX equation syntax only in markdown code blocks with the "latex" language.
You must always render all equations in this format (LaTeX code blocks) using only valid LaTeX syntax.
For example:
\`\`\`latex
\\[ F = \\frac{{G \\cdot m_1 \\cdot m_2}}{{r^2}} \\]
\`\`\`latex
Create a detailed question description with test cases based on this request: "${prompt}"

Please include:
1. A clear problem statement
2. Input/output specifications
3. Constraints and edge cases
4. Template Code with test case implementation in Python

The sample response example is as below:
Design a function to check if a given string of parentheses is valid.
Description: ............

Example:
Input: "(()())"
Output: true

Input: "())("
Output: false

The code template is as below:
def is_valid_parentheses(s):
    # Write your code here
    pass

# Test case
s = "(()())"
print(is_valid_parentheses(s))  # Should print True

For any non-coding questions, say "I cannot answer this question".`;

        // Cancel any existing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create a new AbortController
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setLoading(true);
        setChatResponse('');
        setReasoning('');
        setStreamingReasoning(false);
        setStreamingResponse(false);
        setReasoningComplete(false);
        setError('');

        // Prepare the request payload based on the API reference.
        const payload = {
            model: 'agentica-org/deepcoder-14b-preview:free', // Can be changed to any model
            messages: [{ role: 'user', content: enhancedPrompt }],
            stream: true,
        };

        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${process.env.REACT_APP_OPEN_ROUTER_KEY}`,
                },
                body: JSON.stringify(payload),
                signal,
            });

            //     const data = await response.json();

            //     // Extract the content and reasoning from the response
            //     if (data.choices && data.choices.length > 0) {
            //         const message = data.choices[0].message;
            //         setChatResponse(message.content || '');
            //         setReasoning(message.reasoning || '');
            //     } else {
            //         setError('No response data received');
            //     }
            // } catch (error) {
            //     setError('An error occurred: ' + error.message);
            // }
            // setLoading(false);
            // Read the streaming response.
            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Response body is not readable');
            }

            const decoder = new TextDecoder();
            let buffer = '';

            // First, let's handle the reasoning part
            setStreamingReasoning(true);

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    // Append new chunk to buffer
                    buffer += decoder.decode(value, { stream: true });

                    // Process complete lines from buffer
                    while (true) {
                        const lineEnd = buffer.indexOf('\n');
                        if (lineEnd === -1) break;

                        const line = buffer.slice(0, lineEnd).trim();
                        buffer = buffer.slice(lineEnd + 1);

                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') break;

                            try {
                                const parsed = JSON.parse(data);

                                // Check if we have reasoning data
                                if (parsed.choices[0].delta.reasoning) {
                                    setReasoning(prev => prev + parsed.choices[0].delta.reasoning);
                                }
                                // Check if we have content data
                                else if (parsed.choices[0].delta.content) {
                                    // If we're still in reasoning mode and get content,
                                    // transition to response mode
                                    if (streamingReasoning && !streamingResponse) {
                                        setStreamingReasoning(false);
                                        setReasoningComplete(true);
                                        setStreamingResponse(true);
                                    }

                                    setChatResponse(prev => prev + parsed.choices[0].delta.content);
                                }

                                // Check if we're at the end of the stream
                                if (parsed.choices[0].finish_reason === 'stop') {
                                    setStreamingReasoning(false);
                                    setStreamingResponse(false);
                                    setReasoningComplete(true);
                                }
                            } catch (e) {
                                // Ignore invalid JSON
                            }
                        }
                    }
                }
            } finally {
                reader.cancel();
                setLoading(false);

                // If we never got any reasoning data but did get content,
                // make sure we mark reasoning as complete
                if (!reasoningComplete) {
                    setReasoningComplete(true);
                }

                setStreamingReasoning(false);
                setStreamingResponse(false);
            }
        } catch (error) {
            // Don't show abort errors (they're intentional)
            if (error.name !== 'AbortError') {
                setError('An error occurred: ' + error.message);
            }
            setLoading(false);
            setStreamingReasoning(false);
            setStreamingResponse(false);
        }
    };

    // Cancel request function
    const cancelRequest = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setLoading(false);
            setStreamingReasoning(false);
            setStreamingResponse(false);
        }
    };

    return {
        chatResponse,
        reasoning,
        loading,
        error,
        streamingReasoning,
        streamingResponse,
        reasoningComplete,
        sendChat,
        cancelRequest
    };
};

export default useChat;
