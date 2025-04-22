import React, { useEffect, useMemo, useState } from 'react';
import useQuery from './hooks/use-query';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import useDelete from './hooks/use-delete';

function Questions() {
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, questionId: null });
    const { data, loading, error } = useQuery("questions");
    const { user } = useUser();
    const [filterOption, setFilterOption] = useState("all");
    const { loading: deleteLoading, error: deleteError, deleteRequest } = useDelete();

    const currentUserId = user?.id;
    const isProfessor = user?.unsafeMetadata?.role === "professor";

    // Filter questions based on professor ID when user is a professor
    const filteredQuestions = useMemo(() => {
        if (!data) return [];

        if (filterOption === "my-questions" && isProfessor) {
            return data.filter(question => question.professorId === currentUserId);
        }

        return data;
    }, [data, filterOption, currentUserId, isProfessor]);

    // Handle right-click event
    const handleContextMenu = (e, questionId) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            questionId
        });
    };

    const handleClickOutside = () => {
        setContextMenu({ ...contextMenu, visible: false });
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Context menu actions
    const handleMenuAction = async (action, questionId) => {
        switch (action) {
            case 'delete':
                try {
                    await deleteRequest(
                        `questions/${questionId}`
                    );
                } catch (err) {
                    console.error('Delete failed:', err);
                }
                location.reload();
                break;
            case 'share':
                await navigator.clipboard.writeText(`http://localhost:4000/questions/${questionId}`);
                alert('Question link copied to clipboard!');
                break;
            default:
                break;
        }
        setContextMenu({ ...contextMenu, visible: false });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto mt-2">
            <div>
                <code>
                    {error && <div>Error: {error}</div>}
                    {deleteError && <p className="text-red-500">Delete Error: {deleteError}</p>}

                    <h1 className="p-4 pb-2 text-xl opacity-60 tracking-wide">Most attempted questions this week</h1>
                    <div className="flex justify-between px-2">
                        {isProfessor && (
                            <select
                                className="select select-bordered select-sm"
                                value={filterOption}
                                onChange={(e) => setFilterOption(e.target.value)}
                            >
                                <option value="all">All Questions</option>
                                <option value="my-questions">My Questions</option>
                            </select>
                        )}
                        {isProfessor && <p className="mt-1 text-xs text-green-600">*Right click your question for actions!</p>}
                        {isProfessor && <Link to={`/questions/${user.id}/create-question`} >
                            <button className="btn btn-outline btn-info">Create Question</button>
                        </Link>
                        }
                    </div>

                    {filteredQuestions && filteredQuestions.map((question, index) => {
                        return (
                            <Link to={`/questions/${question.id}`} key={question.id} >
                                <ul className="list bg-base-100 rounded-box shadow-md hover:bg-sky-700"
                                    onContextMenu={(e) => handleContextMenu(e, question.id)}>
                                    <li className="list-row flex items-center gap-4">
                                        <div className="text-4xl font-thin opacity-30 tabular-nums">{(index + 1).toString().padStart(2, '0')}</div>
                                        <div><img className="size-10 rounded-box" src="https://cdn-icons-png.flaticon.com/512/7580/7580891.png" /></div>
                                        <div className="flex flex-row items-center flex-grow gap-2">
                                            <div className="whitespace-nowrap overflow-hidden text-overflow-ellipsis max-w-[400px]">
                                                {question.content.length > 5 ? question.content.substring(0, 50) + "..." : question.content}
                                            </div>
                                            <div className="text-xs uppercase font-semibold opacity-60 ml-10 pl-10">
                                                {question.topics.map(topic => (<span className="px-1" key={topic}>{topic}</span>))}
                                            </div>
                                        </div>
                                        <button className="btn btn-soft btn-secondary">
                                            {question.level.toUpperCase()}
                                        </button>
                                    </li>
                                </ul>
                            </Link>
                        );
                    })}
                    {contextMenu.visible && filterOption === "my-questions" && (
                        <div
                            className="absolute bg-base-200 rounded-box shadow-lg p-2 z-10"
                            style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
                        >
                            <ul className="menu">
                                <li>
                                    <Link to={`/questions/${contextMenu.questionId}/edit`} >
                                        <button>Edit</button>
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={() => handleMenuAction('delete', contextMenu.questionId)}>
                                        {deleteLoading ? 'Deleting...' : 'Delete'}
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleMenuAction('share', contextMenu.questionId)}>
                                        Share
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </code>
            </div>
        </div>
    );
}
export default Questions;