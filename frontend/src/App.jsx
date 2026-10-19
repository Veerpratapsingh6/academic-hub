import { BrowserRouter, Routes, Route } from "react-router-dom"

import MainLayout from "./layouts/MainLayout"

import Home from "./pages/Home"
import Login from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Documents from "./pages/Documents"
import DocumentDetails from "./pages/DocumentDetails"
import Profile from "./pages/Profile"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"
import SavedDocuments from "./pages/SavedDocuments"

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
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route path="/register" element={<Register />} />
        <Route path="/saved" element={<SavedDocuments />} />

      </Routes>
    </BrowserRouter>
  </AuthProvider>
  )
}

export default App