import { Link } from "react-router-dom"
import { useState } from "react"

function Register() {

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
  onSubmit={(e) => {
    e.preventDefault()

    setNameError("")
    setEmailError("")
    setPasswordError("")

    let isValid = true

    if (!name.trim()) {
      setNameError("Please enter your name.")
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
    else if (!/\d/.test(password)) {
      setPasswordError("Password must contain at least one number.")
      isValid = false
    }

    if (!isValid) {
      return
    }

    alert("Registration validation successful!")
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