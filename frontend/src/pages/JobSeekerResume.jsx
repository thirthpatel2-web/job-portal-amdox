import { useEffect, useState } from "react";
import api from "../services/api";

const JobSeekerResume = () => {
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/profile/me")
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      await api.post("/profile/resume", formData);
      alert("Resume uploaded successfully");

      const updated = await api.get("/profile/me");
      setProfile(updated.data);
    } catch (err) {
      alert("Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">My Resume</h1>

      {profile?.resume ? (
        <div className="mb-4">
          <p className="text-green-600 font-medium mb-2">
            Resume uploaded ✔
          </p>
          <a
            href={`http://localhost:5000/${profile.resume}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            View / Download Resume
          </a>
        </div>
      ) : (
        <p className="text-red-500 mb-4">
          No resume uploaded yet
        </p>
      )}

      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>
      </form>
    </div>
  );
};

export default JobSeekerResume;
