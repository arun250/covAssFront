import { useEffect } from "react"
import RegisterForm from "./components/RegisterForm"
import UserDetailsCard from "./components/UserDetailsCard"
import RegisSuccessCard from "./components/RegisSuccessCard"
import LoginForm from "./components/LoginForm"
import NotFound from "./components/NotFound"
import { Routes, Route, Navigate } from "react-router-dom"


function App() {
 

  return (
    <>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
        <Route path="/user-details" element={<UserDetailsCard />} />
        <Route path="/user-success" element={ <RegisSuccessCard/>} />
        <Route path="/not-found" element={ <NotFound/>} />
      </Routes>
    </>
  )
}

export default App
