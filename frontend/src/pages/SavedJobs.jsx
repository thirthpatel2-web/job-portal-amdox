import { useEffect, useState } from "react";
import API from "../services/api";
import JobCard from "../components/JobCard";

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await API.get("/bookmarks");
      console.log("Saved Jobs Response:", res.data);
      setJobs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch saved jobs", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading saved jobs...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8">
        Saved Jobs
      </h1>

      {jobs.length === 0 ? (
        <p className="text-gray-600">
          No saved jobs yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
