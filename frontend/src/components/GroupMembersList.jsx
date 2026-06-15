import API from "@/api/axios";
import {useState,useEffect,useMemo} from "react";//what is the use of useCallback
import debounce from "lodash.debounce";
import { useParams } from "react-router-dom";//WHAT IS THE USE OF USEPARAM AND WHAT IS REACT ROUTER


const GroupMembersList=()=>
{
    const{groupId}=useParams();
    // State Management
//   const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const[searchTerm,setSearchTerm]=useState('')
  const [newMemberInput, setNewMemberInput] = useState('');
  const [results, setResults] = useState([]);
  const [error,setError] =useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const[message,setMessage] = useState('');
/////
 const handleSearchUsers = async(query) =>
  {
   
    try{
       if (!query || query.trim() === '') {
      setResults([]);
      return;
       }
      const response = await API.get(`/users?search=${query}`);
      console.log("Search API Full Response:", response.data);
      const users = response.data.data;
      setResults(users);
    }

    catch(error)
    {
     console.error('Failed to fetch username:',error);
    }
    
  }
 const debouncedSearch = useMemo(() =>
    debounce((nextValue)=>handleSearchUsers(nextValue),500),[]
  );


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
  // get users
 
  const handleAddMember = async (e)=>
  {
e.preventDefault();
if(!newMemberInput.trim()) return //1.why we use trim here
try{
  setError('');
  const response = await API.post(`/groups/addMember/${groupId}`,
    {
      userId:selectedUserId
    }
  );
  const result=response.data.message;
  setMessage(result);
 
  const addedMember = {id:selectedUserId,username:newMemberInput};
  setMembers((prevMembers)=>[...prevMembers,addedMember])
}
catch(error)
{
  console.error('Failed to fetch username:',error)
}
  }

  const handleInputChange = (e) =>
  {
    e.preventDefault();
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  }
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
      <hr />
      {/* Add Member Form */}
      <h3>Add New Members</h3>
      <form onSubmit={handleAddMember}>
        <div>
          {/* task know why label is used for detail */}
          <label>

          </label>
          <input type="text" value={searchTerm} onChange={handleInputChange} placeholder="Type username..."/>
          <ul>
            {results.map((user)=>(
              <li className="hover:cursor-pointer"key={user.id} onClick={()=>{setSearchTerm(user.username);setNewMemberInput(user.username);setSelectedUserId(user.id);}}>
                {user.username}
              </li>
            ))}
          </ul>
          
        </div>
        <button type="submit" >
add member
        </button>
      </form>
    </div>
  )
}
export default GroupMembersList