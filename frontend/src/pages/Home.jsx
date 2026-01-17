import { useEffect, useState } from "react";
import API from "../services/api";
import JobCard from "../components/JobCard";

const Home = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await API.get("/jobs");
      setJobs(res.data);
    };

    fetchJobs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Available Jobs
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default Home;
