import API from '@/api/axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const GroupsListPage = () => {
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await API.get('/groups/userGroups');
        setUserGroups(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch groups", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  // --- LOADING SKELETON STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200 mb-6"></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-24 animate-pulse rounded-xl bg-white border border-gray-100 p-5"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        
        {/* Header section with Create CTA hook */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-5 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">My Groups</h1>
            <p className="mt-1 text-sm text-gray-500">Manage and browse the groups you are currently a part of.</p>
          </div>
          <Link 
            to="/createGroup" 
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            + New Group
          </Link>
        </div>

        {/* Error Handling State */}
        {error && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 mb-6">
            There was an error pulling your group list. Please refresh the page or try again later.
          </div>
        )}

        {/* --- EMPTY STATE --- */}
        {!error && userGroups.length === 0 ? (
          <div className="text-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-12 px-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No groups found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your very first group space.</p>
          </div>
        ) : (
          
          /* --- GROUPS LIST GRID --- */
          <div className="grid gap-4 sm:grid-cols-2">
            {userGroups.map((group) => (
              <Link
                key={group.id}
                to={`/groups/${group.id}`}
                className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {group.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      ID: {group.id} • Click to view members
                    </p>
                  </div>
                  
                  {/* Visual indicator arrow icon */}
                  <div className="rounded-lg bg-gray-50 p-2 text-gray-400 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default GroupsListPage;