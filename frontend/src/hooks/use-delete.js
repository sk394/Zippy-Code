import { useState } from 'react';

const BASE_URL = "https://zippycode-tagname.onrender.com/api";

const useDelete = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteRequest = async (url, headers = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/${url}`, {
                method: 'DELETE',
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
            });

            if (!response.ok) {
                throw new Error(`DELETE request failed with status ${response.status}`);
            }

            // Some DELETE endpoints return no content (204), so handle that case
            const result = response.status === 204 ? { success: true } : await response.json();
            return result;
        } catch (err) {
            setError(err.message || 'Something went wrong');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, deleteRequest };
};

export default useDelete;