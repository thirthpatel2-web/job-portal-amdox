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
import JobSeekerProfile from "./pages/JobSeekerProfile";
import EmployerProfile from "./pages/EmployerProfile";
import JobSeekerResume from "./pages/JobSeekerResume";
import EditJob from "./pages/EditJob";
import SavedJobs from "./pages/SavedJobs";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Navbar />
      <div className="pt-24">
  <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {}
        <Route
  path="/employer/edit-job/:id"
  element={
    <ProtectedRoute role="employer">
      <EditJob />
    </ProtectedRoute>
  }
/>

        <Route
          path="/employer/dashboard"
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
          path="/employer/applications"
          element={
            <ProtectedRoute role="employer">
              <EmployerApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/employer"
          element={
            <ProtectedRoute role="employer">
              <EmployerProfile />
            </ProtectedRoute>
          }
        />

        {/* Job Seeker Routes */}
        <Route
          path="/jobseeker/dashboard"
          element={
            <ProtectedRoute role="jobseeker">
              <SeekerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobseeker/resume"
          element={
            <ProtectedRoute role="jobseeker">
              <JobSeekerResume />
            </ProtectedRoute>
          }
        />
        <Route
  path="/saved-jobs"
  element={
    <ProtectedRoute role="jobseeker">
      <SavedJobs />
    </ProtectedRoute>
  }
/>
<Route path="/profile" element={<Profile />} />


        <Route
          path="/profile/jobseeker"
          element={
            <ProtectedRoute role="jobseeker">
              <JobSeekerProfile />
            </ProtectedRoute>
          }
        />
        </Routes>
</div>

    </>
  );
}

export default App;
