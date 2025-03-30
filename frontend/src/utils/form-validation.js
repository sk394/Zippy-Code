export const isFormValid = (question) => {
    return (
        question?.level?.trim() !== '' &&
        question?.content?.trim() !== '' &&
        question?.topics.some(topic => topic?.trim() !== '') &&
        question?.codeSnippets.some(snippet =>
            snippet?.lang.trim() !== '' &&
            snippet?.langSlug.trim() !== '' &&
            snippet?.code.trim() !== ''
        ) &&
        question?.testCases.input?.trim() !== '' &&
        question?.testCases.expectedOutput?.trim() !== ''
    );
};