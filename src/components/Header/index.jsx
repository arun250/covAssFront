import React from 'react'
import { useNavigate } from "react-router-dom"
import "./index.css"

function Header() {
  const navigate = useNavigate();
  const handleLogout = async () => {
   
    try {
      const res = await fetch("https://conassserver.onrender.com/api/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.message === "Logout successful") {
        
        console.log("Logged out");
      navigate("/login")
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  

  return (
      <nav className='navBarContainer'>
          <button className='btn logout' onClick={handleLogout}>Logout</button>
    </nav>
  )
}

export default Header