import API from "@/api/axios";
import {useState,useEffect} from "react";
import { useParams } from "react-router-dom";//WHAT IS THE USE OF USEPARAM AND WHAT IS REACT ROUTER


const GroupMembersList=()=>
{
    const{groupId}=useParams();
    // State Management
//   const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,setError] =useState('');
  useEffect(()=>{
  const fetchGroupData = async () => {
      try {
        setLoading(true);
        setError(''); // Reset error state on new fetch

        // 2. Use a template literal to insert the dynamic groupId into the API endpoint
        const response = await API.get(`/groups/groupMembers/${groupId}`);
        console.log("backend response:",response.data.data);
        
        // 3. Axios automatically handles network errors and parses JSON into response.data
        // Adjust 'response.data.members' if your backend structure wraps it differently
        setMembers(response.data.data || []);
      } 
      catch (err) {
        // Axios errors store the server's error message inside err.response?.data?.message
        const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch group details';
        setError(errorMsg); 
      } 
      finally {
        setLoading(false);
      } 
    };

    // Only fetch data if groupId exists

      fetchGroupData();
    
    
  },[groupId]);
  if (loading) return <div>Loading members...</div>;
  if(error) return <div>Error:{error}</div>;
  return (
    <div style={{ padding: '20px' }}>
      <h3>Group Members ({members.length})</h3>
      
      {members.length === 0 ? (
        <p>No members found in this group.</p>
      ) : (
        <ul>
          {members.map((member,index) => (
            <li key={index} style={{ margin: '8px 0' }}>
              <strong>{member.username}</strong> 
              {/* <span style={{ color: '#ea1313', marginLeft: '8px' }}>({member.email})</span> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
export default GroupMembersList