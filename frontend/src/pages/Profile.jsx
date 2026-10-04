function Profile() {
  return (
    <div>

      {/* Page Header */}
      <div className="mb-8">

        <p className="text-blue-600 font-medium">
          ACCOUNT
        </p>

        <h1 className="text-3xl font-bold text-gray-900 mt-1">
          My Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your profile and view your academic activity.
        </p>

      </div>

      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

          {/* Profile Avatar */}
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            VP
          </div>

          {/* User Information */}
          <div className="text-center md:text-left">

            <h2 className="text-2xl font-bold text-gray-900">
              Veer Pratap Singh
            </h2>

            <p className="text-gray-500 mt-1">
              Computer Science Student
            </p>

            <p className="text-gray-500 mt-1">
              MMMUT Gorakhpur
            </p>

          </div>

        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-semibold text-gray-900 mt-1">
              student@example.com
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Department
            </p>

            <p className="font-semibold text-gray-900 mt-1">
              Computer Science & Engineering
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Year
            </p>

            <p className="font-semibold text-gray-900 mt-1">
              3rd Year
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Documents Uploaded
            </p>

            <p className="font-semibold text-gray-900 mt-1">
              12
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Profile
