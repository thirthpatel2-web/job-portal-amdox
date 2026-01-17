import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const SeekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await API.get("/applications/my", {
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        My Applications
      </h1>

      {applications.length === 0 ? (
        <p className="text-gray-600">
          You haven’t applied to any jobs yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white/80 backdrop-blur-lg 
p-6 rounded-2xl 
shadow-lg hover:shadow-xl 
transition-all duration-300
"
            >
              <h2 className="text-xl font-semibold">
                {app.job.title}
              </h2>
              <p className="text-gray-600">{app.job.company}</p>
              <p className="text-sm text-gray-500 mb-2">
                {app.job.location}
              </p>
              <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeekerDashboard;
