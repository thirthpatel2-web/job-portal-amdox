import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const res = await API.get("/jobs");
      const job = res.data.find((j) => j._id === id);

      if (job) {
        setTitle(job.title);
        setDescription(job.description);
        setCompany(job.company);
        setLocation(job.location);
        setJobType(job.jobType);
        setSalary(job.salary);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/jobs/${id}`, {
        title,
        description,
        company,
        location,
        jobType,
        salary,
      });

      alert("Job updated successfully");
      navigate("/employer/dashboard");

    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Job</h1>

      <form onSubmit={handleUpdate} className="space-y-4">

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Job
        </button>

      </form>
    </div>
  );
};

export default EditJob;
