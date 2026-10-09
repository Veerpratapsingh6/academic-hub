import { BrowserRouter, Routes, Route } from "react-router-dom"

import MainLayout from "./layouts/MainLayout"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Documents from "./pages/Documents"
import DocumentDetails from "./pages/DocumentDetails"
import Profile from "./pages/Profile"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>

        
        {/* Main Application Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents" element={<Documents />} />
            <Route
              path="/documents/:id"
              element={<DocumentDetails />}
            />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>


        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  </AuthProvider>
  )
}

export default App