import React from 'react';
import useQuery from './hooks/use-query';
import { Link } from 'react-router-dom';

function Questions() {
    const { data, loading, error } = useQuery("questions");

    return (
        <div>
            <code>
                {loading && <div>Loading...</div>}
                {error && <div>Error: {error}</div>}
                {/* <pre>{JSON.stringify(data, null, 2)}</pre> Use this to check fro data incoming */}
                <h1 className="p-4 pb-2 text-xl opacity-60 tracking-wide">Most attempted questions this week</h1>
                {data && data.map((question, index) => {
                    return (
                        <Link to={`/questions/${question.id}`} key={question.id} >
                            <ul  className="list bg-base-100 rounded-box shadow-md hover:bg-sky-700">
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
            </code>
        </div>
    );
}
export default Questions;