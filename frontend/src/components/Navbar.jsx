import { useState } from "react"
import { Link,useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuth()

  const handleLogout = () => {
  logout()
  setMenuOpen(false)
  navigate("/login")
}

  

  return (
    <nav className="bg-white border-b border-gray-200">

      <div className="h-16 flex items-center justify-between px-6">

        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700"
        >
          Academic Hub
        </Link>

{/* Desktop Buttons */}
<div className="hidden md:flex items-center gap-3">

  {isLoggedIn ? (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
    >
      Logout
    </button>
  ) : (
    <>
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
    </>
  )}

</div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-gray-700"
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 px-6 py-4 space-y-2">
      
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            Home
          </Link>
      
          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            Dashboard
          </Link>
      
          <Link
            to="/documents"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            Documents
          </Link>
      
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            Profile
          </Link>
      
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-3 bg-red-600 text-white rounded-lg text-center hover:bg-red-700"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-gray-100"
              >
                Login
              </Link>
      
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
      
        </div>
      )}

    </nav>
  )
}

export default Navbar