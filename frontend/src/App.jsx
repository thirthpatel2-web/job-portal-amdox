import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployerDashboard from "./pages/EmployerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PostJob from "./pages/PostJob";
import SeekerDashboard from "./pages/SeekerDashboard";
import EmployerApplications from "./pages/EmployerApplications";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
  path="/employer"
  element={
    <ProtectedRoute role="employer">
      <EmployerDashboard />
    </ProtectedRoute>
  }
/>      
        <Route
  path="/employer/post-job"
  element={
    <ProtectedRoute role="employer">
      <PostJob />
    </ProtectedRoute>
  }
/>
        <Route
  path="/seeker"
  element={
    <ProtectedRoute role="jobseeker">
      <SeekerDashboard />
    </ProtectedRoute>
  }
/>
        <Route
  path="/employer/applications"
  element={
    <ProtectedRoute role="employer">
      <EmployerApplications />
    </ProtectedRoute>
  }
/>


      </Routes>
    </>
  );
}

export default App;
