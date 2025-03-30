import { useState } from 'react';

const BASE_URL = "http://localhost:8000/api";

const useEdit = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const putRequest = async (url, body, headers = {}) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await fetch(`${BASE_URL}/${url}`, {
                method: 'PUT',
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`PUT request failed with status ${response.status}`);
            }

            const result = await response.json();
            setData(result);
            return result;
        } catch (err) {
            setError(err.message || 'Something went wrong');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, putRequest };
};

export default useEdit;