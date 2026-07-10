import API from '@/api/axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from "./ThemeContext";

const GroupsListPage = () => {
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { theme } = useTheme();

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

  // Tailwind's `dark:` variants only fire inside an ancestor with the
  // `dark` class, so we toggle it here based on the same theme value
  // the rest of the app already uses.
  const isDark = theme === "dark";

  // --- LOADING SKELETON STATE ---
  if (loading) {
    return (
      <div className={isDark ? "dark" : ""} data-theme={theme}>
        <div className="min-h-screen bg-[#faf6ee] dark:bg-[#11161A] px-4 py-8 sm:px-6 lg:px-8 transition-colors">
          <div className="mx-auto max-w-4xl">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-[#ece4d3] dark:bg-[#11161A] mb-6"></div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-24 animate-pulse rounded-2xl bg-[#f2ead9] dark:bg-[#11161A] border border-[#e4d9c2] dark:border-[#2D383F] p-5"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={isDark ? "dark" : ""} >
      <div className="min-h-screen bg-[#F2F4F1] dark:bg-[#11161A] text-[#2a2318] dark:text-[#ECF0EE] px-4 py-8 sm:px-6 lg:px-8 font-sans transition-colors">
        <div className="mx-auto max-w-4xl">

          {/* Header section with Create CTA hook */}
          <div className="flex items-center justify-between border-b border-[#D9DED7] dark:border-[#2D383F] pb-5 mb-6">
            <div>
              <p className="font-mono text-xs font-semibold tracking-widest uppercase text-[#0F6B5C] dark:text-[#5fcbb0] mb-1">
                Your spaces
              </p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Groups</h1>
              <p className="mt-1 text-sm text-[#8B978F] dark:text-[#6C7A73]">
                Manage and browse the groups you are currently a part of.
              </p>
            </div>
            <Link
              to="/createGroup"
              className="shrink-0 whitespace-nowrap rounded-xl bg-[#0F6B5C] hover:bg-[#0c5449] active:scale-[0.98] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition"
            >
              + New Group
            </Link>
          </div>

          {/* Error Handling State */}
          {error && (
            <div className="rounded-xl border border-[#AE4230] bg-[#f7e4de] dark:bg-[#3a1f18] p-4 text-sm text-[#AE4230] dark:text-[#e08a76] mb-6">
              There was an error pulling your group list. Please refresh the page or try again later.
            </div>
          )}

          {/* --- EMPTY STATE --- */}
          {!error && userGroups.length === 0 ? (
            <div className="text-center rounded-2xl border-2 border-dashed border-[#e4d9c2] dark:border-[#2D383F] bg-[#f2ead9] dark:bg-[#1A2127] py-12 px-4">
              <svg
                className="mx-auto h-12 w-12 text-[#a89c85] dark:text-[#6C7A73]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-semibold">No groups found</h3>
              <p className="mt-1 text-sm text-[#6b6152] dark:text-[#6C7A73]">
                Get started by creating your very first group space.
              </p>
            </div>
          ) : (

            /* --- GROUPS LIST GRID --- */
            <div className="grid gap-4 sm:grid-cols-2">
              {userGroups.map((group) => (
                <Link
                  key={group.id}
                  to={`/groups/${group.id}`}
                  className="group relative rounded-2xl border border-[#D9DED7] dark:border-[#2D383F] bg-[#FFFFFF] dark:bg-[#1A2127] p-5 shadow-xs transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-[#0F6B5C] hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">

                    <div className="min-w-0 space-y-1">
                      <h3 className="font-bold truncate text-[#2a2318] dark:text-[#ECF0EE] group-hover:text-[#0F6B5C] dark:group-hover:text-[#5fcbb0] transition-colors">
                        {group.name}
                      </h3>
                      <p className="font-mono text-xs text-[#8B978F] dark:text-[#6C7A73]">
                        ID: {group.id} • Click to view members
                      </p>
                    </div>

                    {/* Visual indicator arrow icon */}
                    <div className="shrink-0 rounded-full bg-[#EBEFEA] dark:bg-[#212A31] p-2 text-[#8B978F] dark:text-[#6C7A73] transition-colors group-hover:bg-[#e3f2ee] dark:group-hover:bg-[#123832] group-hover:text-[#0F6B5C] dark:group-hover:text-[#5fcbb0]">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default GroupsListPage;