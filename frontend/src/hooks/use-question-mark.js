import { useState } from 'react';

const BASE_URL = "https://zippycode-tagname.onrender.com/api/users";

const useMarkQuestionAsSolved = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const solveQuestion = async (userId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/${userId}/score`, {
                method: 'PUT',
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

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