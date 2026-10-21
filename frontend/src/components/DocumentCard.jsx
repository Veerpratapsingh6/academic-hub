import { Link } from "react-router-dom"
import Rating from "./Rating"
import api from "../api"
import { useEffect, useState } from "react"

function DocumentCard({ document, onDownloadSuccess }) {

    const [currentUserId, setCurrentUserId] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({
      title: document.title,
      subject: document.subject,
      description: document.description || ""
    })

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get("/profile")
        setCurrentUserId(response.data.user.id)
      } catch (error) {
        console.error("Could not fetch current user:", error)
      }
    }

    fetchCurrentUser()
  }, [])

  const isOwner = currentUserId === document.user_id

  
  const handleEditSubmit = async (e) => {
    e.preventDefault()

    try {
      await api.put(`/documents/${document.id}`, {
        title: editForm.title,
        subject: editForm.subject,
        description: editForm.description
      })

      alert("Document updated successfully.")
      setIsEditing(false)
      window.location.reload()
    } catch (error) {
      console.error("Document update failed:", error)
      alert(
        error.response?.data?.detail ||
        "Could not update document."
      )
    }
  }


  
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${document.title}"? This action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    try {
      await api.delete(`/documents/${document.id}`)

      alert("Document deleted successfully.")
      window.location.reload()
    } catch (error) {
      console.error("Document deletion failed:", error)
      alert(
        error.response?.data?.detail ||
        "Could not delete document."
      )
    }
  }



    const handleDownload = async () => {
    try {

      const response = await api.get(
        `/documents/${document.id}/download`,
        { responseType: "blob" }
      )

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      )

      const link = window.document.createElement("a")
      link.href = url
      // 🟢 PDF filename fix
      const contentDisposition = response.headers["content-disposition"]
      const filenameMatch = contentDisposition?.match(/filename="?([^"]+)"?/)
      const filename = filenameMatch?.[1] || `${document.title}${document.file_extension || ".pdf"}`

link.download = filename
      window.document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)

      if (onDownloadSuccess) {
        await onDownloadSuccess()
      }
    } catch (error) {
      console.error("Download failed:", error)
      alert("Could not download document.")
    }
  }


  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition duration-200">

      {/* Document Title */}
      <h2 className="text-xl font-bold text-gray-900">
        {document.title}
      </h2>

      {/* Subject */}
      <p className="text-gray-500 mt-2">
        {document.subject}
      </p>

      {/* Information */}
      <div className="flex items-center justify-between mt-5">

        <div>
          <p className="text-sm text-gray-500">
            Rating
          </p>

          <Rating rating={document.rating} />
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Downloads
          </p>

          <p className="font-semibold text-gray-900">
            {document.downloads}
          </p>
        </div>

      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-5">
      
        <Link
          to={`/documents/${document.id}`}
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium text-center hover:bg-blue-700 transition"
        >
          View Details
        </Link>
      
        <button
          onClick={handleDownload}
          className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-700 transition"
        >
          Download
        </button>
      
      </div>

      
      {isEditing && isOwner && (
        <form onSubmit={handleEditSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={editForm.subject}
              onChange={(e) =>
                setEditForm({ ...editForm, subject: e.target.value })
              }
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => {
                setEditForm({
                  title: document.title,
                  subject: document.subject,
                  description: document.description || ""
                })
                setIsEditing(false)
              }}
              className="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}


      
      {isOwner && (
        <div className="flex gap-3 mt-3">
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex-1 bg-amber-500 text-white py-2.5 rounded-lg font-medium hover:bg-amber-600 transition"
          >
            {isEditing ? "Cancel Edit" : "Edit"}
          </button>


          
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition"
          >
            Delete
          </button>

        </div>
      )}


    </div>
  )
}

export default DocumentCard