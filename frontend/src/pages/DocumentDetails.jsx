import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import api from "../api"
import Comment from "../components/Comment"

function DocumentDetails() {

  const { id } = useParams()
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true) 
  const [saved, setSaved] = useState(false)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([])
  const [ratingData, setRatingData] = useState({
    average_rating: 0,
    total_ratings: 0,
    user_rating: null
  })
  
  const [selectedRating, setSelectedRating] = useState(0)
  const [ratingLoading, setRatingLoading] = useState(false)


  const handleSubmitRating = async () => {
  if (selectedRating === 0) {
    alert("Please select a rating first")
    return
  }

  setRatingLoading(true)

  try {
    await api.post(`/documents/${id}/rating`, {
      rating: selectedRating
    })

    const response = await api.get(`/documents/${id}/rating`)
    setRatingData(response.data)
    setSelectedRating(response.data.user_rating || 0)

    alert("Rating submitted successfully!")
  } catch (error) {
    console.error("Failed to submit rating:", error)
    alert("Failed to submit rating. Please try again.")
  } finally {
    setRatingLoading(false)
  }
}


  
useEffect(() => {
  const fetchComments = async () => {
    try {
      const response = await api.get(`/documents/${id}/comments`)
      setComments(response.data.comments)
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    }
  }

  fetchComments()
}, [id])


useEffect(() => {
  const fetchRating = async () => {
    console.log("Fetching rating for document:", id)
    try {
      const response = await api.get(`/documents/${id}/rating`)

      setRatingData(response.data)
      setSelectedRating(response.data.user_rating || 0)
    } catch (error) {
      console.error("Failed to fetch rating:", error)
    }
  }

  fetchRating()
}, [id])


useEffect(() => {
  const fetchDocument = async () => {
    try {
      const response = await api.get("/documents")
      const foundDocument = response.data.documents.find(
        (item) => item.id === Number(id)
      )

      setDocument(foundDocument || null)
    } catch (error) {
      console.error("Failed to fetch document:", error)
      setDocument(null)
    } finally {
      setLoading(false) 
    }
  }

  fetchDocument()
}, [id])


useEffect(() => {
  const checkSavedStatus = async () => {
    try {
      const response = await api.get("/documents/saved")
      const savedDocuments = response.data.documents || []

      setSaved(
        savedDocuments.some((item) => item.id === Number(id))
      )
    } catch (error) {
      console.error("Failed to check saved status:", error)
    }
  }

  checkSavedStatus()
}, [id])


  if (loading) {
    return (
      <p className="text-gray-500">Loading document...</p>
    )
  }

  if (!document) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-8">

        <h1 className="text-2xl font-bold text-red-600">
          Document Not Found
        </h1>

        <p className="text-gray-500 mt-2">
          The document you are looking for does not exist.
        </p>

        <Link
          to="/documents"
          className="inline-block mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Back to Documents
        </Link>

      </div>
    )
  }

  
  const handleDownload = async () => {
    try {
      const response = await api.get(
        `/documents/${id}/download`,
        { responseType: "blob" }
      )
  
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
  
      const link = window.document.createElement("a")
      link.href = url
  
      const contentDisposition = response.headers["content-disposition"]
      const filenameMatch = contentDisposition?.match(/filename="?([^"]+)"?/)
      const filename =
        filenameMatch?.[1] ||
        `${document.title}${document.file_extension || ".pdf"}`
  
      link.download = filename
      window.document.body.appendChild(link)
      link.click()
link.remove()

window.URL.revokeObjectURL(url)

const updatedDocument = await api.get("/documents")
const latestDocument = updatedDocument.data.documents.find(
  (item) => item.id === Number(id)
)

if (latestDocument) {
  setDocument((previousDocument) => ({
    ...previousDocument,
    downloads: latestDocument.downloads
  }))
}
    } catch (error) {
      console.error("Download failed:", error)
      alert(error.response?.data?.detail || "Failed to download document.")
    }
  }


  
  const handleAddComment = async () => {
    if (!comment.trim()) return
  
    try {
      const response = await api.post(
        `/documents/${id}/comments`,
        { text: comment.trim() }
      )
  
      setComments((previousComments) => [
        ...previousComments,
        response.data
      ])
  
      setComment("")
    } catch (error) {
      console.error("Failed to add comment:", error)
      alert(error.response?.data?.detail || "Failed to add comment.")
    }
  }

  
const handleSave = async () => {
  try {
    if (saved) {
      await api.delete(`/documents/${id}/save`)
      setSaved(false)
    } else {
      await api.post(`/documents/${id}/save`)
      setSaved(true)
    }
  } catch (error) {
    console.error("Failed to update saved status:", error)
    alert(error.response?.data?.detail || "Failed to update saved document.")
  }
}



  return (
    <div className="min-w-0 space-y-4 p-4 sm:p-6 lg:p-8">

      {/* Back Button */}
      <Link
        to="/documents"
        className="inline-block mb-6 text-blue-600 hover:underline"
      >
        ← Back to Documents
      </Link>

      {/* Document Details */}
      <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">

        <p className="text-blue-600 font-medium">
          DOCUMENT DETAILS
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
          {document.title}
        </h1>

        <p className="text-gray-500 mt-2">
          {document.subject}
        </p>

        {/* Information */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">

          <div className="bg-gray-50 rounded-xl p-5">
  <p className="text-sm text-gray-500">Rating</p>

  <p className="font-semibold text-gray-900 mt-1">
    ⭐ {ratingData.average_rating}
  </p>

  <p className="text-sm text-gray-500 mt-4">
    Rate this document
  </p>

  <div className="flex items-center gap-2 mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setSelectedRating(star)}
          className={`text-2xl transition ${
            star <= selectedRating
              ? "text-yellow-500"
              : "text-gray-300"
          }`}
          aria-label={`Rate ${star} out of 5`}
        >
          ★
        </button>
      ))}
    </div>

    <button
  type="button"
  onClick={handleSubmitRating}
  disabled={ratingLoading || selectedRating === 0}
  className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
>
  {ratingLoading ? "Submitting..." : "Submit Rating"}
</button>
  </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Downloads
            </p>

            <p className="font-semibold text-gray-900 mt-1">
              {document.downloads}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Uploaded By
            </p>

            <p className="font-semibold text-gray-900 mt-1">
              {document.uploadedBy}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Document ID
            </p>

            <p className="font-semibold text-gray-900 mt-1">
              {document.id}
            </p>
          </div>

        </div>

        {/* Description */}
        <div className="mt-8">

          <h2 className="text-xl font-bold text-gray-900">
            Description
          </h2>

          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-gray-600 sm:text-base">
            {document.description}
          </p>

        </div>

         {/* Comments */}

        <div className="mt-5">

  <textarea
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    placeholder="Write a comment..."
    rows="4"
    className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
  />

  <button
    onClick={handleAddComment}
    className="mt-3 w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
  >
    Add Comment
  </button>

</div>

        {/* Comments */}
<div className="mt-10">

  <h2 className="text-xl font-bold text-gray-900">
    Comments
  </h2>

  <div className="space-y-4 mt-5">

    {comments.map((item, index) => (
  <Comment
    key={index}
    name={item.name}
    text={item.text}
  />
))}

  </div>

</div>

        {/* Download Button */}
        <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:flex-wrap">

  <button
    onClick={handleDownload}
    className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
  >
    Download Document
  </button>

  <button
    onClick={handleSave}
    className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition ${
      saved
        ? "bg-green-600 text-white"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
    }`}
  >
    {saved ? "✓ Saved" : "Save Document"}
  </button>

</div>

      </div>

    </div>
  )
}

export default DocumentDetails