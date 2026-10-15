
import { useEffect, useState } from "react"
import api from "../api"


function Profile() {

  const [user, setUser] = useState(null)

  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    year: ""
  })



useEffect(() => {
  api.get("/profile")
    .then((response) => {
      const profile = response.data.user

      setUser(profile)

      setFormData({
        name: profile.name || "",
        department: profile.department || "",
        year: profile.year || ""
      })
    })
    .catch((error) => {
      console.log("Profile error:", error)
    })
}, [])



const [stats, setStats] = useState({
  uploaded_documents: 0
})

useEffect(() => {
  api.get("/dashboard/stats")
    .then((response) => {
      setStats(response.data)
    })
    .catch((error) => {
      console.log("Profile stats error:", error)
    })
}, [])


const handleSave = async (event) => {
  event.preventDefault()
  setSaving(true)
  setMessage("")

  try {
    const response = await api.put("/profile", formData)

    setUser(response.data.user)
    setFormData({
      name: response.data.user.name || "",
      department: response.data.user.department || "",
      year: response.data.user.year || ""
    })

    setIsEditing(false)
    setMessage("Profile updated successfully!")
  } catch (error) {
    const errorDetail = error.response?.data?.detail

  setMessage(
    typeof errorDetail === "string"
      ? errorDetail
      : "Unable to update profile. Please check your connection and try again."
  )
  } finally {
    setSaving(false)
  }
}


  return (
    <div>

      {/* Page Header */}
      <div className="mb-8">

        <p className="text-blue-600 font-medium">
          ACCOUNT
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
          My Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your profile and view your academic activity.
        </p>

      </div>

      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-8">

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

          {/* Profile Avatar */}

          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {user?.name
              ? user.name
                  .trim()
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((word) => word[0].toUpperCase())
                  .join("")
              : "..."}
          </div>


          {/* User Information */}

<div className="text-center md:text-left flex-1 min-w-0">

  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
    {user?.name || "Loading..."}
  </h2>

  <p className="text-gray-500 mt-1">
    Computer Science Student
  </p>

  <p className="text-gray-500 mt-1">
    MMMUT Gorakhpur
  </p>


<button
  type="button"
  disabled={!user || saving}

onClick={() => {
  setMessage("")

  if (isEditing) {
    setFormData({
      name: user?.name || "",
      department: user?.department || "",
      year: user?.year || ""
    })
  }

  setIsEditing(!isEditing)
}}

  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
>
  {isEditing ? "Cancel Editing" : "Edit Profile"}
</button>


</div>


        </div>


{isEditing && (
  <form onSubmit={handleSave} className="mt-8 p-5 bg-gray-50 rounded-xl space-y-5">
    <h3 className="text-lg font-semibold text-gray-900">
      Edit Your Details
    </h3>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Full Name
      </label>
      <input
        type="text"
        value={formData.name}
        onChange={(event) =>
          setFormData({ ...formData, name: event.target.value })
        }
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Department
      </label>
      <input
        type="text"
        value={formData.department}
        onChange={(event) =>
          setFormData({ ...formData, department: event.target.value })
        }
        placeholder="e.g. Computer Science & Engineering"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Year
      </label>
      <select
        value={formData.year}
        onChange={(event) =>
          setFormData({ ...formData, year: event.target.value })
        }
        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Year</option>
        <option value="1st Year">1st Year</option>
        <option value="2nd Year">2nd Year</option>
        <option value="3rd Year">3rd Year</option>
        <option value="4th Year">4th Year</option>
      </select>
    </div>

    <div className="flex flex-col sm:flex-row gap-3">
      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

      <button
        type="button"
        onClick={() => {
          setIsEditing(false)
          setMessage("")
          setFormData({
            name: user?.name || "",
            department: user?.department || "",
            year: user?.year || ""
          })
        }}
        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
      >
        Cancel
      </button>
    </div>
  </form>
)}


{message && (
  <div
    role="status"
    className={`mt-6 rounded-lg p-3 text-sm ${
      message.includes("successfully")
        ? "bg-green-50 text-green-700"
        : "bg-red-50 text-red-700"
    }`}
  >
    {message}
  </div>
)}


        {/* Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-semibold text-gray-900 mt-1">
              {user?.email || "Loading..."}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Department
            </p>

            <p className="font-semibold text-gray-900 mt-1">
              {user?.department || "Not specified"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Year
            </p>

            <p className="font-semibold text-gray-900 mt-1">
              {user?.year || "Not specified"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Documents Uploaded
            </p>

            <p className="font-semibold text-gray-900 mt-1">
              {stats.uploaded_documents}
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Profile
