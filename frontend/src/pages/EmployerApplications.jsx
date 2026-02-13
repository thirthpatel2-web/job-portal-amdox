import { useEffect, useState } from "react";
import API from "../services/api";

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewNote, setInterviewNote] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get("/applications/employer");
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/applications/${id}/status`, { status });
      fetchApplications();
    } catch (err) {
      alert("Status update failed");
    }
  };

  const scheduleInterview = async () => {
    try {
      await API.put(`/applications/${selectedApp._id}/status`, {
        status: "interview",
        interviewDate,
        interviewNote,
      });

      setSelectedApp(null);
      setInterviewDate("");
      setInterviewNote("");
      fetchApplications();
    } catch (err) {
      alert("Interview scheduling failed");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "shortlisted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "interview":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8">
        Applications Received
      </h1>

      {applications.length === 0 ? (
        <p className="text-gray-600">
          No applications received yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                {app.job?.title}
              </h2>

              <div className="space-y-1 text-sm text-gray-700">
                <p><strong>Name:</strong> {app.applicant?.name}</p>
                <p><strong>Email:</strong> {app.applicant?.email}</p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {app.applicantProfile?.phone || "N/A"}
                </p>
              </div>

              {}
              {app.applicantProfile?.resume && (
                <a
                  href={`http://localhost:5000/${app.applicantProfile.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline block mt-3 text-sm"
                >
                  View Resume
                </a>
              )}

              {}
              <div className="mt-4">
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
                <div className="mt-3 text-sm text-blue-600">
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(app.interviewDate).toLocaleString()}
                  </p>
                  {app.interviewNote && (
                    <p><strong>Note:</strong> {app.interviewNote}</p>
                  )}
                </div>
              )}

              {}
              {app.status === "applied" && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() =>
                      updateStatus(app._id, "shortlisted")
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Shortlist
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(app._id, "rejected")
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => setSelectedApp(app)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Interview
                  </button>
                </div>
              )}

              {app.status !== "applied" && (
                <p className="mt-4 text-xs text-gray-500">
                  Decision already made.
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              Schedule Interview
            </h2>

            <input
              type="datetime-local"
              className="border p-2 w-full rounded mb-3"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
            />

            <textarea
              placeholder="Interview note (optional)"
              className="border p-2 w-full rounded mb-3"
              value={interviewNote}
              onChange={(e) => setInterviewNote(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={scheduleInterview}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerApplications;
