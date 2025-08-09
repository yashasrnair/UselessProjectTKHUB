import React,{ useState,useEffect } from "react";


function Login(){
  
  const[userName,setUserName] = useState("");

  const handleClick = () => {
    setUserName(userName);
    onSubmit(userName);
  }

  
  return(
    <div>
      <input type="text" name="userName" placeholder="userName" value={userName}/>
      <button type="button" onClick={handleClick}>
        Enter
      </button>
    </div>
  );
}

export default Login;
