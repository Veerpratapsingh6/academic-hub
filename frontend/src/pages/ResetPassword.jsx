
import { useState } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setMessage("")

    if (!token) {
      setError("Reset link is missing. Please request a new link.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one capital letter.")
      return
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one small letter.")
      return
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.")
      return
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setError("Password must contain at least one special symbol.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(
        "http://127.0.0.1:8000/reset-password",
        {
          token: token,
          new_password: password
        }
      )

      setMessage(response.data.message)

      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to reset password. Please request a new link."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Reset Password
        </h1>

        <p className="text-gray-500 text-center mt-3 mb-6">
          Enter and confirm your new password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="text-xs text-gray-500 mt-2">
              Minimum 8 characters, uppercase, lowercase, number and special symbol required.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
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
            {loading ? "Resetting Password..." : "Reset Password"}
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

export default ResetPassword
