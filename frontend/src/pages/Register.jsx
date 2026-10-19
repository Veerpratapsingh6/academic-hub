import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

function Register() {

  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-6">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-8">

        <div className="text-center mb-8">

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Join the Academic Hub community
          </p>

        </div>

        <form
          onSubmit={async(e) => {
          e.preventDefault()

          setNameError("")
          setEmailError("")
          setPasswordError("")
      
          let isValid = true
      
          if (!name.trim()) {
            setNameError("Please enter your name.")
            isValid = false
          }
          else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
            setNameError("Name must contain only letters and spaces.")
            isValid = false
          }
      
          if (!email.trim()) {
            setEmailError("Please enter your email.")
            isValid = false
          }
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError("Please enter a valid email address.")
            isValid = false
          }
      
          
          if (!password.trim()) {
            setPasswordError("Please enter your password.")
            isValid = false
          }
          else if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters.")
            isValid = false
          }
          else if (!/[A-Z]/.test(password)) {
            setPasswordError("Password must contain at least one capital letter.")
            isValid = false
          }
          else if (!/[a-z]/.test(password)) {
            setPasswordError("Password must contain at least one small letter.")
            isValid = false
          }
          else if (!/[0-9]/.test(password)) {
            setPasswordError("Password must contain at least one number.")
            isValid = false
          }
          else if (!/[^A-Za-z0-9]/.test(password)) {
            setPasswordError("Password must contain at least one special symbol.")
            isValid = false
          }

      
          if (!isValid) {
            return
          }

          try {

            const response = await axios.post(
              "http://127.0.0.1:8000/register",
              {
                name: name,
                email: email,
                password: password
              }
            )
          
            console.log("Registration successful")
            console.log(response.data)

            navigate("/login")

          } catch (error) {

            console.log("Registration error:", error)
          
            if (error.response) {
          
              setEmailError(error.response.data.detail)
          
            } else {
          
              setEmailError("Something went wrong. Please try again.")
          
            }

          }
            }}
  className="space-y-5"
>

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

            {nameError && (
              <p className="text-sm text-red-600 mt-1">
                {nameError}
              </p>
            )}

          </div>

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

            {emailError && (
              <p className="text-sm text-red-600 mt-1">
                {emailError}
              </p>
            )}

          </div>

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <p className="text-xs text-gray-500 mt-2">
              Password must contain:
            </p>
            <ul className="text-xs text-gray-500 mt-1 space-y-1">
              <li>• At least 8 characters</li>
              <li>• One uppercase letter (A-Z)</li>
              <li>• One lowercase letter (a-z)</li>
              <li>• One number (0-9)</li>
              <li>• One special symbol (@, #, !, etc.)</li>
            </ul>


            {passwordError && (
             <p className="text-sm text-red-600 mt-1">
               {passwordError}
              </p>
            )}

          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Create Account
          </button>

        </form>

        <p className="text-center text-gray-500 mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  )
}

export default Register