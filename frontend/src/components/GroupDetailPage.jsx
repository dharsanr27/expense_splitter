
import API from '@/api/axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const GroupsListPage =  () => {
    const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  // Hardcoded example of what your fetched data array might look like
  useEffect(()=>
  {
    const fetchGroups = async () =>
{
    try{
const response= await API.get('/groups/userGroups');

setUserGroups(response.data.data || []);

    }
    catch(err){
        console.error("Failed to fetch groups",err);
    }
    finally
    {
        setLoading(false);
    }
};
fetchGroups();
},[]);
if (loading) return <div>Loading your groups...</div>
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>My Groups</h2>
      <ul>
        {userGroups.map((group) => (
          <li key={group.id} style={{ margin: '10px 0' }}>
            {/* Clicking this generates a clean URL like: /groups/101
              The user never types anything; they just click.
            */}
            <Link to={`/groups/${group.id}`} style={{ fontWeight: 'bold', color: 'blue' }}>
              View {group.name} Members
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupsListPage;