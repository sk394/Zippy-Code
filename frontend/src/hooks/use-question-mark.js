import { useState } from 'react';

const BASE_URL = "https://zippycode-tagname.onrender.com/api/";
const useMarkQuestionAsSolved = () => {
    const [state, setState] = useState({
        isLoading: false,
        error: null,
        data: null
    });

    const markAsSolved = async (questionId, studentId) => {
        setState({ isLoading: true, error: null, data: null });

        try {
            const response = await fetch(
                `${BASE_URL}/questions/${questionId}/solve/${studentId}`,
                {
                    method: 'PATCH',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            setState({
                isLoading: false,
                error: null,
                data: data
            });

            return data;
        } catch (error) {
            setState({
                isLoading: false,
                error: error.response?.data || { message: error.message },
                data: null
            });

            throw error;
        }
    };

    return {
        markAsSolved,
        isLoading: state.isLoading,
        error: state.error,
        data: state.data
    };
};

export default useMarkQuestionAsSolved;