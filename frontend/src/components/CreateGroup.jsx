import  { useState } from 'react';
import API from '../api/axios'; // Import your custom client

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean, abstract, and automatically handles base URL + headers
      const response = await API.post('/groups/createGroup', { groupName: groupName });
      console.log('Group created:', response.data);
    } catch (error) {
      console.error('Failed to create group:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className='text-center'>
      <h1>Create a New Group</h1>
      <form onSubmit={handleSubmit}>
        <input className='text-center'
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
          required
        />
        <button type="submit" className="text-center">Create Group</button>
      </form>
    </div>
  );
};

export default CreateGroup


