import { TrophyIcon, ChevronUpIcon } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import useQuery from './hooks/use-query';


const WeeklyTopLeaderboard = () => {
    const { user } = useUser();
    const { data: users, loading, error } = useQuery('users/top-10');

    if (error) {
        return <div>Error loading leaderboard: {error}</div>;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Find current user's index in the array
    const currentUserRank = users.findIndex(item => item.id === user?.id) + 1 | "Not Ranked";

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    Weekly Leaderboard
                </h1>
                <p className="text-gray-600">Top performers of the week</p>

                {user && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                        <p className="text-gray-700">
                            Your rank: <span className="font-semibold">{currentUserRank}</span>
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <TrophyIcon size={20} />
                            <h2 className="font-bold">Top Performers</h2>
                        </div>
                        <p className="text-sm">Week of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </div>

                <ul className="divide-y divide-gray-100">
                    {users.map((user, index) => (
                        <li key={user.id} className={`
              ${user[0] ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' : ''}
              hover:bg-gray-50 transition-colors
            `}>
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        {user[0] && (
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                                                <TrophyIcon size={12} className="text-white" />
                                            </div>
                                        )}

                                        <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center 
                      ${user[0] ? 'bg-yellow-500' :
                                                user[1] ? 'bg-gray-400' :
                                                    user[2] ? 'bg-amber-700' : 'bg-blue-100'}
                      ${user.rank <= 3 ? 'text-white' : 'text-gray-700'}
                    `}>
                                            {user.userName ? (
                                                <svg width="30" height="30" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0.877014 7.49988C0.877014 3.84219 3.84216 0.877045 7.49985 0.877045C11.1575 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1575 14.1227 7.49985 14.1227C3.84216 14.1227 0.877014 11.1575 0.877014 7.49988ZM7.49985 1.82704C4.36683 1.82704 1.82701 4.36686 1.82701 7.49988C1.82701 8.97196 2.38774 10.3131 3.30727 11.3213C4.19074 9.94119 5.73818 9.02499 7.50023 9.02499C9.26206 9.02499 10.8093 9.94097 11.6929 11.3208C12.6121 10.3127 13.1727 8.97172 13.1727 7.49988C13.1727 4.36686 10.6328 1.82704 7.49985 1.82704ZM10.9818 11.9787C10.2839 10.7795 8.9857 9.97499 7.50023 9.97499C6.01458 9.97499 4.71624 10.7797 4.01845 11.9791C4.97952 12.7272 6.18765 13.1727 7.49985 13.1727C8.81227 13.1727 10.0206 12.727 10.9818 11.9787ZM5.14999 6.50487C5.14999 5.207 6.20212 4.15487 7.49999 4.15487C8.79786 4.15487 9.84999 5.207 9.84999 6.50487C9.84999 7.80274 8.79786 8.85487 7.49999 8.85487C6.20212 8.85487 5.14999 7.80274 5.14999 6.50487ZM7.49999 5.10487C6.72679 5.10487 6.09999 5.73167 6.09999 6.50487C6.09999 7.27807 6.72679 7.90487 7.49999 7.90487C8.27319 7.90487 8.89999 7.27807 8.89999 6.50487C8.89999 5.73167 8.27319 5.10487 7.49999 5.10487Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd">
                                                    </path>
                                                </svg>

                                            ) : (
                                                <span className="font-bold">{user.userName}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="font-medium text-black">{user.userName}</p>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${user[0] ? 'bg-yellow-100 text-yellow-800' :
                                                    user[1] ? 'bg-gray-100 text-gray-800' :
                                                        user[2] ? 'bg-amber-100 text-amber-800' : 'bg-blue-50 text-blue-800'}
                      `}>
                                                #{index + 1}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="flex items-center space-x-1 text-emerald-600 mr-4">
                                        <ChevronUpIcon size={16} />
                                        <span className="font-medium">{user.score}</span>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                        {user.score} pts
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WeeklyTopLeaderboard;