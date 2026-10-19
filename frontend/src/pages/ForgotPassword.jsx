
import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage("")
    setError("")

    if (!email.trim()) {
      setError("Please enter your email.")
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(
        "http://127.0.0.1:8000/forgot-password",
        { email: email.trim() }
      )

      setMessage(response.data.message)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to send reset link. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Forgot Password?
        </h1>

        <p className="text-gray-500 text-center mt-3 mb-6">
          Enter your registered email to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {message && (
            <p className="text-sm text-green-700">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
