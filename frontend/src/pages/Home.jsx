import { useEffect, useState, useRef, useContext } from "react";
import API from "../services/api";
import JobCard from "../components/JobCard";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { auth } = useContext(AuthContext);
  const user = auth?.user;

  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [sort, setSort] = useState("newest");

  const observer = useRef();

  useEffect(() => {
    fetchJobs(1, true);
  }, [keyword, location, jobType, sort]);

  const fetchJobs = async (pageNumber, reset = false) => {
    try {
      setLoading(true);

      const res = await API.get(
        `/jobs?page=${pageNumber}&limit=6&keyword=${keyword}&location=${location}&jobType=${jobType}&sort=${sort}`
      );

      const jobData = res.data.jobs || [];

      if (reset) {
        setJobs(jobData);
      } else {
        setJobs((prev) => [...prev, ...jobData]);
      }

      setTotalPages(res.data.totalPages || 1);
      setPage(pageNumber);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const lastJobRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < totalPages) {
        fetchJobs(page + 1);
      }
    });

    if (node) observer.current.observe(node);
  };
  if (!auth) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white flex flex-col justify-center items-center px-6">

      {/* Animated Background Glow */}
      <div className="absolute w-96 h-96 bg-pink-400 opacity-30 rounded-full blur-3xl animate-pulse top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-indigo-400 opacity-30 rounded-full blur-3xl animate-pulse bottom-10 right-10"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl">

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight animate-fadeIn">
          The Smart Way To <br />
          <span className="text-yellow-300">Hire & Get Hired</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl opacity-90">
          Built for ambitious professionals and fast-growing companies.
          Search smarter. Apply faster. Track everything.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="bg-white text-indigo-700 px-8 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition"
          >
            Get Started Free
          </Link>

          <Link
            to="/login"
            className="border border-white px-8 py-3 rounded-2xl font-semibold hover:bg-white hover:text-indigo-700 transition"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-14 text-sm opacity-80">
          Trusted by 1000+ professionals & modern startups
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">
        Explore Opportunities
      </h1>

      {}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8 bg-white p-4 rounded-xl shadow">
        <input
          placeholder="Keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="internship">Internship</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="newest">Newest</option>
          <option value="salary-high">Salary High → Low</option>
          <option value="salary-low">Salary Low → High</option>
        </select>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job, index) => {
          if (jobs.length === index + 1) {
            return (
              <div ref={lastJobRef} key={job._id}>
                <JobCard job={job} />
              </div>
            );
          }
          return <JobCard key={job._id} job={job} />;
        })}
      </div>

      {loading && (
        <p className="text-center mt-6 text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default Home;
