import { useState } from 'react';

export function useJudge0() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [token, setToken] = useState(null);

    // Function to encode string to base64
    const encodeBase64 = (str) => {
        return btoa(unescape(encodeURIComponent(str)));
    };

    // Function to decode base64 to string
    const decodeBase64 = (str) => {
        return decodeURIComponent(escape(atob(str)));
    };

    // Submit code to Judge0 API
    const submitCode = async (sourceCode, stdin = '') => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const url = 'https://judge0-extra-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*';
            const options = {
                method: 'POST',
                headers: {
                    'x-rapidapi-key': '6504bf6b31msh61cfd958377ba21p12fe2ejsnd95dd74663ff',
                    'x-rapidapi-host': 'judge0-extra-ce.p.rapidapi.com',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    language_id: 27, // Python language ID
                    source_code: encodeBase64(sourceCode),
                    stdin: stdin ? encodeBase64(stdin) : ''
                })
            };

            const response = await fetch(url, options);
            const data = await response.json();

            if (data.token) {
                setToken(data.token);
                return data.token;
            } else {
                throw new Error('No token received from API');
            }
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Check the status of a submission
    const checkStatus = async (submissionToken) => {
        setLoading(true);
        setError(null);

        try {
            const url = `https://judge0-extra-ce.p.rapidapi.com/submissions/${submissionToken}?base64_encoded=true&fields=*`;
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '6504bf6b31msh61cfd958377ba21p12fe2ejsnd95dd74663ff',
                    'x-rapidapi-host': 'judge0-extra-ce.p.rapidapi.com'
                }
            };

            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data);

            // Process the result
            const processedResult = {
                status: data.status,
                stdout: data.stdout ? decodeBase64(data.stdout) : '',
                stderr: data.stderr ? decodeBase64(data.stderr) : '',
                compile_output: data.compile_output ? decodeBase64(data.compile_output) : '',
                message: data.message,
                time: data.time,
                memory: data.memory
            };

            setResult(processedResult);
            return processedResult;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Poll until we get a result
    const pollSubmission = async (submissionToken, interval = 1000, maxAttempts = 10) => {
        setLoading(true);

        let attempts = 0;

        const poll = async () => {
            attempts++;

            const result = await checkStatus(submissionToken);

            if (result && (result.status.id >= 3 || attempts >= maxAttempts)) {
                // Status id >= 3 means the submission is not queued or processing anymore
                return result;
            }

            if (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, interval));
                return poll();
            }

            setError("Maximum polling attempts reached");
            return null;
        };

        try {
            return await poll();
        } finally {
            setLoading(false);
        }
    };

    // Execute code (submit and poll until completion)
    const executeCode = async (sourceCode, stdin = '') => {
        const submissionToken = await submitCode(sourceCode, stdin);

        if (submissionToken) {
            return await pollSubmission(submissionToken);
        }

        return null;
    };

    return {
        loading,
        error,
        result,
        token,
        submitCode,
        checkStatus,
        executeCode
    };
}