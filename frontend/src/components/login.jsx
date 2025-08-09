import React, { useState, useCallback } from "react";

function Login({ onSubmit }) {
  const [userName, setUserName] = useState("");

  const handleClick = useCallback(() => {
    onSubmit(userName);
  }, [userName, onSubmit]);

  return (
    <div>
      <input 
        type="text" 
        name="userName" 
        placeholder="userName" 
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button type="button" onClick={handleClick}>
        Enter
      </button>
    </div>
  );
}

export default React.memo(Login);

