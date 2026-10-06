import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CreateGroup from "./components/CreateGroup";
import GroupDetailPage from "./components/GroupDetailPage";
import GroupMembersList from "./components/GroupMembersList";
import Dashboard from "./components/Dashboard";
import GroupExpenseList from "./components/GroupExpenseList";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import { ThemeProvider } from "./components/ThemeContext";
import { AuthProvider } from "./components/AuthContext";
import Navbar from "./components/Navbar";

const NO_NAVBAR_ROUTES = ["/forgot-password", "/reset-password"];

function AppContent() {
  const location = useLocation();
  const hideNavbar = NO_NAVBAR_ROUTES.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/createGroup" element={<CreateGroup />} />
        <Route path="/groups/:groupId" element={<GroupMembersList />} />
        <Route path="/groupDetails" element={<GroupDetailPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groupExpenses/:groupId" element={<GroupExpenseList />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
    </AuthProvider>
  );
}

export default App;