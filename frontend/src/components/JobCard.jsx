import { useContext, useState } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const JobCard = ({ job }) => {
  const { auth } = useContext(AuthContext);
  const user = auth?.user;

  const [showDetails, setShowDetails] = useState(false);
  const [applied, setApplied] = useState(job.alreadyApplied || false);
  const [saved, setSaved] = useState(job.bookmarked || false);
  const [loading, setLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const isJobSeeker = auth?.role === "jobseeker";

  const handleApply = async () => {
    try {
      setLoading(true);
      await API.post(`/applications/${job._id}`);
      setApplied(true);
    } catch (error) {
      alert(error.response?.data?.message || "Application failed");
    } finally {
      setLoading(false);
    }
  };
  const handleBookmark = async () => {
    try {
      setBookmarkLoading(true);

      if (saved) {
        await API.delete(`/bookmarks/${job._id}`);
        setSaved(false);
      } else {
        await API.post(`/bookmarks/${job._id}`);
        setSaved(true);
      }
    } catch (error) {
      alert("Bookmark failed");
    } finally {
      setBookmarkLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 relative">

        {}
        {isJobSeeker && (
          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className="absolute top-4 right-4 text-2xl hover:scale-110 transition"
          >
            {saved ? "❤️" : "🤍"}
          </button>
        )}

        <h2 className="text-xl font-bold">{job.title}</h2>

        <p className="text-gray-600">
          {job.company} • {job.location}
        </p>

        {job.createdBy && (
          <p className="text-sm text-gray-500">
            Posted by: {job.createdBy.name}
          </p>
        )}

        <p className="text-xs text-gray-400 mb-3">
          {new Date(job.createdAt).toLocaleDateString()}
        </p>

        <div className="flex gap-2 mt-3">

          <button
            onClick={() => setShowDetails(true)}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
          >
            View Details
          </button>

          {isJobSeeker && (
            applied ? (
              <span className="bg-gray-400 text-white px-3 py-1 rounded">
                Already Applied
              </span>
            ) : (
              <button
                onClick={handleApply}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                {loading ? "Applying..." : "Apply"}
              </button>
            )
          )}

        </div>
      </div>

      {}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-xl w-full shadow-xl max-h-[90vh] overflow-y-auto">

            <h2 className="text-2xl font-bold mb-3">
              {job.title}
            </h2>

            <p className="mb-4 text-gray-700">
              {job.description}
            </p>

            <div className="space-y-2 text-sm">
              <p><strong>Salary:</strong> {job.salary || "N/A"}</p>
              <p><strong>Type:</strong> {job.jobType}</p>
              <p><strong>Qualification:</strong> {job.qualification || "N/A"}</p>
              <p><strong>Experience:</strong> {job.experience || "N/A"}</p>
              <p><strong>Responsibilities:</strong> {job.responsibilities || "N/A"}</p>

              <p>
                <strong>Skills:</strong>{" "}
                {job.skillsRequired?.length
                  ? job.skillsRequired.join(", ")
                  : "N/A"}
              </p>

              <p className="mt-3">
                <strong>Employer:</strong> {job.createdBy?.name}
              </p>

              <p>
                <strong>Contact:</strong> {job.createdBy?.email}
              </p>
            </div>

            <button
              onClick={() => setShowDetails(false)}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </>
  );
};

export default JobCard;
