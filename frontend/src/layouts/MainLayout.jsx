import { Outlet } from "react-router-dom"

import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex min-w-0 pt-16">
      
        <Sidebar />
      
        <main className="flex-1 min-w-0 p-4 md:p-6 md:ml-64">
          <Outlet />
        </main>
      
      </div>

    </div>
  )
}

export default MainLayout