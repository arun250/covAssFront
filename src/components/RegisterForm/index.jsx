import { useState,useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./index.css"

const RegisterForm = () => {
    const [form, setForm] = useState({FirstName: "",LastName : "", Email:"", PasswordHash:"", PhoneNumber: "", DateOfBirth:"", Gender:""})
    const [message, setMessage] = useState("");
    const [showedSuccess, setShowSuccess] = useState(false);
    const [showedFailure, setShowFailure] = useState(false);
    const [errors, setErrors] = useState("")
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



    
    const handleChange = (e) => {
        setForm({...form, [e.target.name]:e.target.value})
    }

// complete validation functions 
    const validate = () => {
        const newErrors = {}
        
        //first name
        if (!form.FirstName.trim()) {
            newErrors.FirstName = "First name is required"
        }
        // last name
        if (!form.LastName.trim()) {
            newErrors.LastName = "Last name is required"
        }
        // email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.Email) {
            newErrors.Email = "Email is required"
        }
        else if (!emailRegex.test(form.Email)) {
            newErrors.Email = "Invalid Email format"
        }
        // password
        if (!form.PasswordHash) {
            newErrors.PasswordHash = "Password is required"
        }
        else if (form.PasswordHash.length < 8) {
        newErrors.PasswordHash = "Password must be atleast 8 characters"    
        }
        //Phone number
        const phoneRegex = /^[0-9]{10}$/;
        if (!form.PhoneNumber) {
            newErrors.PhoneNumber = "Phone number is required"
        }
        else if (!phoneRegex.test(form.PhoneNumber)) {
            newErrors.PhoneNumber = "Phone number must be 10 digits"
        }
        //Dob
       
        if (!form.DateOfBirth) {
            newErrors.DateOfBirth = "Date of Birth is required"
        }
        else {
            const today = new Date()
            const dobDate = new Date(form.DateOfBirth);
            const age = today.getFullYear() - dobDate.getFullYear()
            const monthDiff = today.getMonth() - dobDate.getMonth()
            const dayDiff = today.getDate() - dobDate.getDate()
            const isUnder18 = 
            age <18 || (age === 18 && (monthDiff <0 || (monthDiff === 0 && dayDiff <0)))
            if (isUnder18) {
                newErrors.DateOfBirth = "you must be at least 18 years old"
            }
        }
        // Gender
        if (!form.Gender) {
            newErrors.Gender = "Gender is required";
         }
  
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }
    
    const getMaxDOB = () => {
        const today = new Date()
        today.setFullYear(today.getFullYear() - 18)
        return today.toISOString().split("T")[0];
    }

    // clicksubmit function 
    const onClickSubmit = async(event) => {
        event.preventDefault()
        if (validate()) {
            const formattedDOB = new Date(form.DateOfBirth).toISOString().split("T")[0];
            const payload = {
              ...form,
              DateOfBirth: formattedDOB,
            }
            console.log("payload", payload)
            const apiUrl = "https://conassserver.onrender.com/api/register"
            const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }
            const response = await fetch(apiUrl, options)
            const data = await response.json()
            if (response.ok === true) {
                setMessage(data.message)
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                  }, 3000);
                setForm({ FirstName: "", LastName: "", Email: "", PasswordHash: "", PhoneNumber: "", DateOfBirth: "", Gender: "" })
                navigate("/user-success")
            }
            else {
                setMessage(data.message || "Registration Failed")
                   setTimeout(() => {
                    setShowFailure(false);
                  }, 3000);
                setShowFailure(true);
            }
        }
    }
    const renderInput = (label, name, type = "text", placeholder) => (
        <div className="userCard">
          <label htmlFor={name} className="input-label">{label} :</label>
          <input
            type={type}
            name={name}
            id={name}
            className="username-input-field"
            max={type === "date" ? getMaxDOB() : undefined}
            value={form[name]}
            onChange={handleChange}
            placeholder={placeholder}
          />
          {errors[name] && <span className="error">{errors[name]}</span>}
        </div>
      );
    
    return (
        <div className="body-container">
       
            <form className="form-container" onSubmit={onClickSubmit}>
            <h1>Sign-up</h1>
        {renderInput("FIRSTNAME", "FirstName","text", "Enter your FirstName")}
        {renderInput("LASTNAME", "LastName","text", "Enter your LastName")}
        {renderInput("EMAIL", "Email","email", "Enter your Email Address")}
        {renderInput("PASSWORD", "PasswordHash", "password", "Enter your Password")}
        
        {renderInput("MOBILE NUMBER", "PhoneNumber", "text", "Enter your Mobile Number")}
        {renderInput("DATE OF BIRTH", "DateOfBirth", "date", "Enter your Date of Birth")}

        <div className="selectCard">
          <label htmlFor="gender" className="input-label">GENDER :</label>
        <select
                        id= "Gender"
                        name="Gender"
                        className="username-select-field"
                        value={form.Gender}
                        onChange={handleChange}         
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
                    </select>
        {errors.Gender && <span className="error">{errors.Gender}</span>}

        </div>

        <div className="userCard">
          <button type="submit" className="submit-btn">Register</button>
                </div> 
                <p>Already registered? <Link href='/login'>Sign in now.</Link></p>
                {showedSuccess && (
          <div className="success-message">
                        {message}                        
          </div>
                )}    
        {showedFailure&& (
          <div className="failure-message">
                        {message}                        
          </div>
        )}  
        </form>
              
            </div>
        )
    }




export default RegisterForm