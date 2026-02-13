import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const SeekerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchApplications();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/applications/seeker/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await API.get("/applications/my");
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "shortlisted")
      return "bg-green-100 text-green-700";
    if (status === "rejected")
      return "bg-red-100 text-red-700";
    if (status === "interview")
      return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">

      <h1 className="text-3xl font-bold mb-8">
        Job Seeker Dashboard
      </h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-blue-100 p-6 rounded-xl text-center shadow">
            <p className="text-sm text-gray-600">Total</p>
            <h2 className="text-2xl font-bold">{stats.total}</h2>
          </div>

          <div className="bg-yellow-100 p-6 rounded-xl text-center shadow">
            <p className="text-sm text-gray-600">Pending</p>
            <h2 className="text-2xl font-bold">{stats.pending}</h2>
          </div>

          <div className="bg-green-100 p-6 rounded-xl text-center shadow">
            <p className="text-sm text-gray-600">Shortlisted</p>
            <h2 className="text-2xl font-bold">{stats.shortlisted}</h2>
          </div>

          <div className="bg-red-100 p-6 rounded-xl text-center shadow">
            <p className="text-sm text-gray-600">Rejected</p>
            <h2 className="text-2xl font-bold">{stats.rejected}</h2>
          </div>

        </div>
      )}

      {}
      <h2 className="text-2xl font-semibold mb-6">
        Recent Applications
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {applications.slice(0, 4).map((app) => (
          <div
            key={app._id}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h3 className="text-lg font-semibold mb-1">
              {app.job?.title}
            </h3>

            <p className="text-sm text-gray-600">
              {app.job?.company} • {app.job?.location}
            </p>

            {}
            <div className="mt-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                  app.status
                )}`}
              >
                {app.status.charAt(0).toUpperCase() +
                  app.status.slice(1)}
              </span>
            </div>

            {}
            {app.status === "interview" && (
              <div className="mt-4 bg-blue-50 p-3 rounded-lg text-sm">
                <p>
                  <strong>Interview Date:</strong>{" "}
                  {new Date(app.interviewDate).toLocaleString()}
                </p>

                {app.interviewNote && (
                  <p className="mt-1">
                    <strong>Note:</strong> {app.interviewNote}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="flex gap-4">
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Browse Jobs
          </Link>

          <Link
            to="/profile/jobseeker"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            Edit Profile
          </Link>

          <Link
            to="/jobseeker/resume"
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Manage Resume
          </Link>
        </div>
      </div>

    </div>
  );
};

export default SeekerDashboard;
