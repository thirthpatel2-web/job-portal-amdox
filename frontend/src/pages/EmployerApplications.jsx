import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await API.get("/applications/employer", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setApplications(res.data);
    };

    fetchApplications();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">
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
              className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg"
            >
              <h2 className="text-xl font-semibold">
                {app.job.title}
              </h2>
              <p className="text-gray-600">
                Applicant: {app.applicant.name}
              </p>
              <p className="text-sm text-gray-500">
                {app.applicant.email}
              </p>
              <span className="inline-block mt-3 px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700">
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerApplications;
