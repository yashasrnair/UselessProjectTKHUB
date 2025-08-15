import React, { useCallback, useState } from "react";

const Login = React.memo(({ onSubmit }) => {
  const [userName, setUserName] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit(userName);
    },
    [userName, onSubmit]
  );

  const handleInputChange = useCallback((e) => {
    setUserName(e.target.value);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-gray-200 dark:border-slate-800 fade-in">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-900 dark:text-white">Welcome</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={userName}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="w-full px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white font-medium bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
});

Login.displayName = "Login";

export default Login;
