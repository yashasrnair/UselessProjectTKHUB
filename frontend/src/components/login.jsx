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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative w-full max-w-md p-8 bg-slate-800/40 rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20 backdrop-blur-xl">
        {/* Glowing overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-md -z-10"></div>

        <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          Welcome
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-cyan-200"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={userName}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="w-full px-4 py-2 text-white bg-slate-900/50 border border-cyan-500/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-lg shadow-md shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105"
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
