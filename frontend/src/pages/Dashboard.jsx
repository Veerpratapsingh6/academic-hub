import UploadModal from "../components/UploadModal"
import { useEffect,useState } from "react"
import api from "../api"

function Dashboard() {

  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    uploaded_documents: 0,
    saved_documents: 0
  })

  useEffect(() => {
  api.get("/profile")
    .then((response) => {
      console.log("Profile data:", response.data)
      setUser(response.data.user)
    })
    .catch((error) => {
      console.log("Profile error:", error)
    })
}, [])

useEffect(() => {
  api.get("/dashboard/stats")
    .then((response) => {
      setStats(response.data)
    })
    .catch((error) => {
      console.log("Dashboard stats error:", error)
    })
}, [])
  return (
    <div className="min-w-0 p-4 sm:p-6 lg:p-8">

      <div className="mb-6 space-y-1 sm:mb-8">

        <p className="text-blue-600 font-medium">
          STUDENT DASHBOARD
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
          Welcome back, {user?.name}!
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
          Here's an overview of your academic activity.
        </p>

      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">

        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500">
            Uploaded Documents
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {stats.uploaded_documents}
          </h2>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500">
            Saved Documents
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {stats.saved_documents}
          </h2>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500">
            Contributions
          </p>


          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {stats.contributions}
          </h2>

        </div>

      </div>

      {/* Upload Document */}
      <div className="mt-6 min-w-0 sm:mt-8">
        <UploadModal />
      </div>

    </div>
  )
}

export default Dashboard