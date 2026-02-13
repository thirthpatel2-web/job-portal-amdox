import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const EmployerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const statsRes = await API.get("/applications/employer/stats");
      const jobsRes = await API.get("/jobs/my-jobs");

      setStats(statsRes.data);
      setJobs(jobsRes.data);
    } catch (err) {
      console.error("Dashboard fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await API.delete(`/jobs/${id}`);
      fetchDashboard();
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-10">
        <div className="animate-pulse text-gray-500">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10">

      <h1 className="text-3xl font-bold mb-8">
        Employer Dashboard
      </h1>

      {}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-blue-100 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Total Jobs</h3>
            <p className="text-2xl font-bold mt-2">
              {stats.totalJobs}
            </p>
          </div>

          <div className="bg-yellow-100 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Applications</h3>
            <p className="text-2xl font-bold mt-2">
              {stats.totalApplications}
            </p>
          </div>

          <div className="bg-green-100 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Shortlisted</h3>
            <p className="text-2xl font-bold mt-2">
              {stats.shortlisted}
            </p>
          </div>

          <div className="bg-red-100 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Rejected</h3>
            <p className="text-2xl font-bold mt-2">
              {stats.rejected}
            </p>
          </div>

        </div>
      )}

      {}
      <div className="flex gap-4 mb-10">
        <Link
          to="/employer/post-job"
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl"
        >
          Post New Job
        </Link>

        <Link
          to="/employer/applications"
          className="bg-green-600 text-white px-5 py-2 rounded-xl"
        >
          View Applications
        </Link>
      </div>

      {}
      <h2 className="text-2xl font-semibold mb-6">
        My Job Listings
      </h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs posted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h3 className="text-lg font-semibold">
                {job.title}
              </h3>

              <p className="text-gray-600">
                {job.location} • {job.jobType}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Posted on {new Date(job.createdAt).toLocaleDateString()}
              </p>

              <div className="flex gap-3 mt-4">
                <Link
                  to={`/employer/edit-job/${job._id}`}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(job._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
