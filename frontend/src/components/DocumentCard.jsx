import { Link } from "react-router-dom"
import Rating from "./Rating"
import api from "../api"

function DocumentCard({ document, onDownloadSuccess }) {

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

    </div>
  )
}

export default DocumentCard