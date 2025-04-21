import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch users for a leaderboard from Clerk
 * @param {Object} options - Configuration options
 * @param {number} options.limit - Maximum number of users to fetch (default: 10)
 * @param {string} options.orderBy - Sort order (default: '-unsafe_metadata.points')
 * @returns {Object} The users data, loading state, and error state
 */
const useLeaderboardUsers = ({ limit = 10, orderBy = '-unsafe_metadata.points' } = {}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                // Fetch the users from the backend API
                const response = await fetch('api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ limit, orderBy }),
                });
                console.log(response);
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();

                // Format the users data
                const formattedUsers = data.users.map((user, index) => ({
                    userId: user.id,
                    username: user.emailAddresses?.[0]?.emailAddress || 'Unknown',
                    points: user.unsafeMetadata?.points || 0,
                    rank: index + 1,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    imageUrl: user.imageUrl
                }));

                setUsers(formattedUsers);
                setTotalCount(data.totalCount);
                setError(null);
            } catch (err) {
                setError(err.message || 'An error occurred while fetching users');
                console.error('Error fetching leaderboard users:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [limit, orderBy]);

    return { users, loading, error, totalCount };
};

export default useLeaderboardUsers;