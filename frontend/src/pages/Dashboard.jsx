import UploadModal from "../components/UploadModal"

function Dashboard() {
  return (
    <div>

      <div className="mb-8">

        <p className="text-blue-600 font-medium">
          STUDENT DASHBOARD
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
          Welcome back!
        </h1>

        <p className="text-gray-500 mt-2">
          Here's an overview of your academic activity.
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500">
            Uploaded Documents
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            12
          </h2>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500">
            Saved Documents
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            8
          </h2>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500">
            Contributions
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            5
          </h2>
        </div>

      </div>

      {/* Upload Document */}
      <div className="mt-8">
        <UploadModal />
      </div>

    </div>
  )
}

export default Dashboard