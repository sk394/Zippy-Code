import { useState, useEffect } from 'react';
import { TrophyIcon, UserIcon, ChevronUpIcon } from 'lucide-react';
import { useClerk, useUser } from '@clerk/clerk-react';
import useLeaderboardUsers from './hooks/use-leaderboard-users';


const WeeklyTopLeaderboard = () => {
    const { user } = useUser();
    const { users, loading, error, totalCount } = useLeaderboardUsers({
        limit: 10,
        orderBy: '-unsafe_metadata.points'  // Sort by points in descending order
    });

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

    // Find current user's position
    const currentUserRank = users.find(item => item.id === user?.id)?.rank || 'Not ranked';

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
                    {users.map((user) => (
                        <li key={user.id} className={`
              ${user.rank === 1 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' : ''}
              hover:bg-gray-50 transition-colors
            `}>
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        {user.rank === 1 && (
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                                                <TrophyIcon size={12} className="text-white" />
                                            </div>
                                        )}

                                        <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center 
                      ${user.rank === 1 ? 'bg-yellow-500' :
                                                user.rank === 2 ? 'bg-gray-400' :
                                                    user.rank === 3 ? 'bg-amber-700' : 'bg-blue-100'}
                      ${user.rank <= 3 ? 'text-white' : 'text-gray-700'}
                    `}>
                                            {user.imageUrl ? (
                                                <img
                                                    src={user.imageUrl}
                                                    alt={`${user.firstName} ${user.lastName}`}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            ) : (
                                                <span className="font-bold">{user.rank}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                                                    user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                                                        user.rank === 3 ? 'bg-amber-100 text-amber-800' : 'bg-blue-50 text-blue-800'}
                      `}>
                                                #{user.rank}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="flex items-center space-x-1 text-emerald-600 mr-4">
                                        <ChevronUpIcon size={16} />
                                        <span className="font-medium">{user.points}</span>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                        {user.points} pts
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