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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-900">
          Welcome
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={userName}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white font-medium bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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

