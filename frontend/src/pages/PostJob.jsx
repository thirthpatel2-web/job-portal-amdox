import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/jobs",
        {
          title,
          description,
          company,
          location,
          jobType,
          salary,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Job posted successfully");
      navigate("/employer");
    } catch (error) {
      alert("Failed to post job");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Post a Job
        </h2>

        <input
          type="text"
          placeholder="Job Title"
          className="w-full mb-3 p-3 border rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Job Description"
          className="w-full mb-3 p-3 border rounded-md"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Company"
          className="w-full mb-3 p-3 border rounded-md"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full mb-3 p-3 border rounded-md"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <select
          className="w-full mb-3 p-3 border rounded-md"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          required
        >
          <option value="">Select Job Type</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="internship">Internship</option>
          <option value="contract">Contract</option>
        </select>

        <input
          type="text"
          placeholder="Salary"
          className="w-full mb-6 p-3 border rounded-md"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />

        <button
  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl 
             hover:bg-indigo-700 
             transition-all duration-200"
>
  Post Job
</button>

      </form>
    </div>
  );
};

export default PostJob;
