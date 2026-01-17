const EmployerDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Employer Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-lg 
p-6 rounded-2xl 
shadow-lg hover:shadow-xl 
transition-all duration-300
">
          <h2 className="text-xl font-semibold mb-2">
            Post a Job
          </h2>
          <p className="text-gray-600 mb-4">
            Create a new job listing and attract candidates.
          </p>
          <button
            onClick={() => window.location.href = "/employer/post-job"}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-200"
          >
            Post Job
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-lg 
p-6 rounded-2xl 
shadow-lg hover:shadow-xl 
transition-all duration-300
">
          <h2 className="text-xl font-semibold mb-2">
            View Applications
          </h2>
          <p className="text-gray-600 mb-4">
            Review applicants who applied to your jobs.
          </p>
         <button
  onClick={() => window.location.href = "/employer/applications"}
  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-all duration-200"
>
  View Applications
</button>

        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
