import { useState } from 'react';
import API from '../api/axios'; // Import your custom client

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Clean, abstract, and automatically handles base URL + headers
      const response = await API.post('/groups/createGroup', { groupName: groupName });
      console.log('Group created:', response.data);
      
      setMessage({ type: 'success', text: 'Group created successfully!' });
      setGroupName(''); // Reset input on success
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Something went wrong';
      console.error('Failed to create group:', errorMsg);
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Create a New Group
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Collaborate and share with your team members.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="group-name" className="text-sm font-medium text-gray-700 block">
              Group Name
            </label>
            <input
              id="group-name"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Marketing Team, Project Alpha"
              required
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 
                         transition duration-200 ease-in-out
                         focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                         disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          {/* Feedback Messages */}
          {message.text && (
            <div
              className={`rounded-lg p-3 text-sm font-medium ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !groupName.trim()}
            className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 
                       text-sm font-semibold text-white transition duration-200 ease-in-out 
                       hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
                       focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
                       disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                {/* Simple Tailwind Spinner */}
                <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </span>
            ) : (
              'Create Group'
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CreateGroup;