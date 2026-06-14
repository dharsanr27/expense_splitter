import GroupDetailPage from "./GroupDetailPage";
import { Link } from "react-router-dom";

function Dashboard(){
return (
    <div>
        <GroupDetailPage/> 
           <p className="text-center">
            Create group?<Link to="/createGroup" className="hover:underline">Create Group</Link>
          </p>
         
    </div>
   
)
}
export default Dashboard;