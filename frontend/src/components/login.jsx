import React, { useCallback, useState } from "react";

const Login = React.memo(({ onSubmit }) => {
  const [userName, setUserName] = useState("");

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit(userName);
  }, [userName, onSubmit]);

  const handleInputChange = useCallback((e) => {
    setUserName(e.target.value);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col max-w-md mx-auto gap-4 p-6">
      <input 
        type="text" 
        name="userName" 
        placeholder="userName" 
        value={userName}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button 
        type="submit"
        className="w-full px-4 py-2 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Enter
      </button>
    </form>
  );
});

Login.displayName = "Login";

export default Login;

