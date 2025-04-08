import { useState } from "react";

const BASE_URL = "https://zippycode-tagname.onrender.com/api";

export const useMutation = (api) => {
    const [state, setState] = useState({
        isLoading: false,
        error: null,
        data: null
    });

    const mutate = async (body) => {
        setState({ isLoading: true, error: null, data: null });
        try {
            const isFormData = body instanceof FormData;
            const response = await fetch(`${BASE_URL}/${api}`, {
                method: 'POST',
                mode: "cors",
                headers: isFormData ? {} : {
                    'Content-Type': 'application/json',
                },
                body: isFormData ? body : JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            setState({ isLoading: false, error: null, data });
            return data;
        } catch (error) {
            setState({ isLoading: false, error: error.message, data: null });
            throw error;
        }
    };

    return [mutate, state];
};