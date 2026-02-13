import { useEffect, useState } from "react";
import API from "../services/api";

const EmployerProfile = () => {
  const [form, setForm] = useState({
    companyName: "",
    companyWebsite: "",
    companyDescription: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile/me");
        if (res.data) {
          setForm({
            companyName: res.data.companyName || "",
            companyWebsite: res.data.companyWebsite || "",
            companyDescription: res.data.companyDescription || "",
            phone: res.data.phone || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put("/profile", form);
      alert("Company profile updated successfully");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Company Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="companyWebsite"
          placeholder="Company Website"
          value={form.companyWebsite}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <textarea
          name="companyDescription"
          placeholder="Company Description"
          value={form.companyDescription}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="phone"
          placeholder="Contact Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EmployerProfile;
