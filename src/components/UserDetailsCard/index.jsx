import { useEffect, useState } from "react";
import "./index.css";
import { useNavigate, Link } from "react-router-dom"
import Header from "../Header/index.jsx"
function UserDetailsCard() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({})
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
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
          navigate("/login")
        } else {
          console.log("Not logged in");
        }
      });
  }, [navigate]);



  // get allUsersData
    useEffect(() => {
      dataFromApi();
      
    }, [users]);
  
    const dataFromApi = async() => {
      const apiUrl = "https://conassserver.onrender.com/api"
      const response = await fetch(apiUrl)
      if (response.ok === true) {
        const fetchedData = await response.json()
        const updatedData = fetchedData.users.map((eachUser) => ({
          FirstName: eachUser.FirstName,
          LastName: eachUser.LastName, 
          Email: eachUser.Email,
          PasswordHash: eachUser.PasswordHash,
          PhoneNumber: eachUser.PhoneNumber,
          DateOfBirth: eachUser.DateOfBirth.split("T")[0],
          Gender:eachUser.Gender,
        }))
        setUsers(updatedData)
      }
      else {
          alert( "fetching Failed")
        
    }
    }
    
  const handleEdit = (user) => {
    setEditingUser(user.Email)
    setFormData(user)
    
  }
  
  const handleChange = (e) => {
    setFormData((prev=> ({...prev,[e.target.name]: e.target.value })))
  }
  
  const handleUpdate = async () => {
    const response = await fetch("https://conassserver.onrender.com/api/register/edit", {
        method:"POST",
        headers: {
          "Content-Type": "application/json"},
          body: JSON.stringify(formData)
      })
    if (response.ok === true) {
      const data = await response.json()
        await dataFromApi()
        setEditingUser(null);
        setMessage(data.message)
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
      else {
        setMessage(data.message || "Registration Failed")
        setTimeout(() => {
            setShowFailure(false);
          }, 3000);
        setShowFailure(true);
    }
    }

  const handleDelete = async(email) => {
    
        const response = await fetch("https://conassserver.onrender.com/api/register/delete", {
        method:"POST",
        headers: {
          "Content-Type": "application/json"},
          body: JSON.stringify({Email:email})
        })
    if (response.ok === true) {
      const data = await response.json()
      setUsers((prevUsers) => prevUsers.filter((user) => user.Email !== email));
      await dataFromApi()   
      setMessage(data.message)
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
    }
    else {
      setMessage(data.message || "Registration Failed")
      setTimeout(() => {
          setShowFailure(false);
        }, 3000);
      setShowFailure(true);
  }        
}
  if (users === undefined) return null
  return (
    <>
    <Header/>
    <div className='userDetailsContainer'>
      <h2>Registered User Details </h2>
          <table>
              <thead>
                  <tr>
                      <th>FirstName</th>
                      <th>LastName</th>
                      <th>Email</th>
                      <th>Password</th>
                      <th>PhoneNumber</th>
                      <th>DOB</th>
                      <th>Gender</th>
                      <th>Actions</th>
                      <th>Remove</th>
                   </tr>
              </thead>
              <tbody>
  {users.map(item => (
  <tr key={item.Email}>
    {editingUser === item.Email ? (
      <>
        <td>
          <input
            name="FirstName"
            value={formData.FirstName || ""}
            onChange={handleChange}
            />
        </td>
        <td>
          <input
            name="LastName"
            value={formData.LastName || ""}
            onChange={handleChange}
            />
        </td>
        <td>
          <input
            name="Email"
            value={formData.Email || ""}
            onChange={handleChange}
            disabled
            />
        </td>
        <td>
          <input
            name="PasswordHash"
            value={formData.PasswordHash || ""}
            onChange={handleChange}
            disabled
            />
        </td>
        <td>
          <input
            name="PhoneNumber"
            value={formData.PhoneNumber || ""}
            onChange={handleChange}
            />
        </td>
        <td>
          <input
            name="DateOfBirth"
            value={formData.DateOfBirth || ""}
            onChange={handleChange}
            />
        </td>
        <td>
          <input
            name="Gender"
            value={formData.Gender || ""}
            onChange={handleChange}
            />
        </td>
        <td>
          <button className="btn save" onClick={handleUpdate}>Save</button>
        
        </td>
                      <td>
          <button className="btn cancel" onClick={() => setEditingUser(null)}>Cancel</button>
                      </td>
        <td></td>
      </>
    ) : (
      <>
        <td>{item.FirstName}</td>
        <td>{item.LastName}</td>
        <td>{item.Email}</td>
        <td>{item.PasswordHash}</td>
        <td>{item.PhoneNumber}</td>
        <td>{item.DateOfBirth}</td>
        <td>{item.Gender}</td>
        <td><button className="btn edit" onClick={() => handleEdit(item)}>Edit</button></td>
        <td><button className="btn delete" onClick={() => handleDelete(item.Email)}>Delete</button></td>
      </>
    )}
  </tr>
))}
             </tbody>
        </table>
      </div>
      <div className="body">
      {showSuccess && (
        <div className="successMessage">
                        {message}                        
          </div>
                )}    
         {showFailure&& (
           <div className="failureMessage">
                        {message}                        
          </div>
        )} 
    </div>
        </>
  )
}

export default UserDetailsCard