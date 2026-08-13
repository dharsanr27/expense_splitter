import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CreateGroup from "./components/CreateGroup";
import GroupDetailPage from "./components/GroupDetailPage";
import GroupMembersList from "./components/GroupMembersList";
import Dashboard from "./components/Dashboard";
import GroupExpenseList from "./components/GroupExpenseList"
import { ThemeProvider } from "./components/ThemeContext";
import Navbar from "./components/Navbar";
function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/createGroup"  element={<CreateGroup/>}/>
        <Route path="/groups/:groupId" element={<GroupMembersList/>}/>
        <Route path="/groupDetails" element={<GroupDetailPage/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/groupExpenses/:groupId" element={<GroupExpenseList/>}/>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
    
  );
}

export default App;