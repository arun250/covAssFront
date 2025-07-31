import React from 'react'
import { useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import "./index.css"
function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [error, setNewError] = useState("")
  const [toast, setToast] = useState(false)
  const [sucMessage, setSucMessage] = useState("")
  const [showErrMsg, setShowErrMsg] = useState(false);
  const navigate = useNavigate();


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
  



  const validate = () => {
    const newValidErrors = {}
        // email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newValidErrors.Email = "Email is required"
        }
        else if (!emailRegex.test(email)) {
            newValidErrors.Email = "Invalid Email format"
        }
        // password
        if (!password) {
            newValidErrors.PasswordHash = "Password is required"
        }
        else if (password.length < 8) {
        newValidErrors.PasswordHash = "Password must be atleast 8 characters"    
        }
        setNewError(newValidErrors)
       
    return Object.keys(newValidErrors).length === 0;
  }

  const handleLogin = async(event) => {
    event.preventDefault()
    if (validate()) {
      const response = await fetch("https://conassserver.onrender.com/api/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials:"include"
    })
    const data = await response.json()
      if (response.ok === true) {
        setSucMessage("login successful")
        navigate("/user-details")
      setToast(true);
                setTimeout(() => {
                    setToast(false);
                }, 3000);
      
      setEmail("")
      setPassword("")
    }
    else {
      
        setSucMessage(data.error)
        setShowErrMsg(true)
        setTimeout(() => {
          setShowErrMsg(false)
      }, 3000);
      setEmail("")
      setPassword("")
    }
    
  }
}


const emailField = () => {
    return (
      <>
        <label className="input-label" htmlFor="email">
          EMAIL
        </label>
        <input
          type="email"
          id="email"
          className="username-input-field"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Enter your Email"
        />
        
      </>
  )
  }
  const passwordField = () => {
    
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          placeholder="Password"
        />
      </>
    )
  }
  return (
    <div className="login-form-container">
    <form className="form-container" onSubmit={handleLogin}>
    <h2>Sign In</h2>
        <div className="input-container">{emailField()}
        {error["Email"] && <span className="error">{error["Email"]}</span>}
        </div>
        <div className="input-container">{passwordField()}
        {error["PasswordHash"] && <span className="error">{error["PasswordHash"]}</span>}
        </div>
      <button type="submit" className="login-button">
        Sign In
        </button>
      <p>Not already registered yet? <a href='/'>Sign up now.</a></p>
      {showSubmitError && <p className="error-message">*{errorMsg}</p>}
      {toast && (
          <div className="success-message">
                      {sucMessage}                        
          </div>
        )}  
       {showErrMsg && (
          <div className="failure-message">
                      {sucMessage}                        
          </div>
                )}  
      </form>
  </div>
  )
}

export default LoginForm