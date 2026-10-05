import { NavLink } from "react-router-dom"

function Sidebar() {

  const navItems = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Documents",
      path: "/documents",
    },
    {
      name: "Profile",
      path: "/profile",
    },
  ]

  return (
    <aside className="w-64 min-h-[calc(100vh-64px)] bg-gray-900 text-white p-5 hidden md:block">

      {/* Sidebar Header */}
      <div className="mb-8">

        <h2 className="text-xl font-bold">
          Academic Hub
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Student Portal
        </p>

      </div>

      {/* Navigation */}
      <nav className="space-y-2">

        {navItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {item.name}
          </NavLink>

        ))}

      </nav>

    </aside>
  )
}

export default Sidebar