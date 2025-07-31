import React from 'react'
import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import "./index.css"
const RegisSuccessCard = () => {
  const navigate = useNavigate()
  useEffect(() => {
    fetch("https://conassserver.onrender.com/api/check-auth", {
      method:"GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          console.log("User is logged in:", data.user.Email);
          navigate("/user-details")
        } else {
          console.log("Not logged in");
        }
      });
  }, [navigate]);
  return (
    <div className='success-container'>
          <h2 className=''>You've successfully registered in this portal.</h2>
          <h2><Link to='/login'> Click here</Link> to return to the Login Page. </h2>
    </div>
  )
}

export default RegisSuccessCard