import { useState } from 'react';

const BASE_URL = "https://zippycode-tagname.onrender.com/api";

const useMarkQuestionAsSolved = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const solveQuestion = async (questionId, studentId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${BASE_URL}/questions/${questionId}/solve/${studentId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message || `Error: ${response.status} ${response.statusText}`
                );
            }

            const result = await response.json();
            setResponse(result);
            return result;
        } catch (err) {
            setError(err.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Reset the hook state
     */
    const reset = () => {
        setLoading(false);
        setError(null);
        setResponse(null);
    };

    return { solveQuestion, loading, error, response, reset };
};

export default useMarkQuestionAsSolved;