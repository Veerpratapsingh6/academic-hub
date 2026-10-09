
import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("access_token"))
  )

  useEffect(() => {
  const handleUnauthorized = () => {
    localStorage.removeItem("access_token")
    setIsLoggedIn(false)
    window.location.href = "/login"
  }

  window.addEventListener("auth-unauthorized", handleUnauthorized)

  return () => {
    window.removeEventListener("auth-unauthorized", handleUnauthorized)
  }
}, [])

  const login = (token) => {
    localStorage.setItem("access_token", token)
    setIsLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
