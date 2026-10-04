import { BrowserRouter, Routes, Route } from "react-router-dom"

import MainLayout from "./layouts/MainLayout"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Documents from "./pages/Documents"
import DocumentDetails from "./pages/DocumentDetails"
import Profile from "./pages/Profile"

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Main Application Layout */}
        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/documents" element={<Documents />} />
          <Route
            path="/documents/:id"
            element={<DocumentDetails />}
          />

          <Route path="/profile" element={<Profile />} />

        </Route>

        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App