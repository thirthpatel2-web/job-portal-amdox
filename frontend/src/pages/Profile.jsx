import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { auth, token } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(res.data);
      } catch (error) {
        console.log("PROFILE ERROR:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (!auth) {
    return (
      <div className="text-center mt-20 text-gray-600">
        Please login to view profile
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow">
      <h2 className="text-3xl font-bold mb-6">My Profile</h2>

      <div className="space-y-3 text-gray-700">
        <p><strong>Name:</strong> {auth.name}</p>
        <p><strong>Email:</strong> {auth.email}</p>
        <p><strong>Role:</strong> {auth.role}</p>

        <p><strong>Phone:</strong> {profile?.phone || "N/A"}</p>
        <p><strong>Bio:</strong> {profile?.bio || "N/A"}</p>

        {profile?.resume && (
          <a
            href={`http://localhost:5000/${profile.resume}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Resume
          </a>
        )}
      </div>
    </div>
  );
};

export default Profile;
