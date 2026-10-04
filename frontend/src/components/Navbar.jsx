import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">

      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold text-blue-600 hover:text-blue-700"
      >
        Academic Hub
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-3">

        <Link
          to="/login"
          className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </Link>

      </div>

    </nav>
  )
}

export default Navbar