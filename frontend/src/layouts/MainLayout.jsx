import { Outlet } from "react-router-dom"

import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex min-w-0">

        <Sidebar />

        <main className="flex-1 p-4 md:p-6 min-w-0">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default MainLayout