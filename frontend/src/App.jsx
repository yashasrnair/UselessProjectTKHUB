import { useState,useEffect } from 'react'
import './App.css'
import Login

function App() {
  const[userName,setUserName] = useState("");
  const[newUser,setNewUser] = useState(true);

  const logout(() => {
    setNewUser(true);
    setUserName("");
    
  }

  const handleUserName = () 

  useEffect(() => {
    let savedName = window.localStorage.getItem('userName');
    if(savedName){
      setNewUser(false);
      setUserName(savedName);
    }
  },[]);

  return (
    <>
      {newUser ? (
        <Login onSubmit = {handleUserName} />
    </>
  )
}

export default App
