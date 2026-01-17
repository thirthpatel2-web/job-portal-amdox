import API from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const JobCard = ({ job }) => {
  const { user } = useContext(AuthContext);

  const handleApply = async () => {
    try {
      await API.post(
        `/applications/${job._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("Applied successfully");
    } catch (error) {
      alert("Already applied or not authorized");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg 
p-6 rounded-2xl 
shadow-lg hover:shadow-xl 
transition-all duration-300
">
      <h2 className="text-xl font-semibold mb-1">{job.title}</h2>
      <p className="text-gray-600 mb-1">{job.company}</p>
      <p className="text-sm text-gray-500 mb-2">{job.location}</p>
      <p className="text-sm mb-4">{job.description}</p>

      {user && user.role === "jobseeker" && (
        <button
          onClick={handleApply}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Apply
        </button>
      )}
    </div>
  );
};

export default JobCard;
