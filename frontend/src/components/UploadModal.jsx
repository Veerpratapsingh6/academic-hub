import { useState } from "react"
import api from "../api"

function UploadModal() {

    const [title, setTitle] = useState("")
    const [subject, setSubject] = useState("")
    const [description, setDescription] = useState("")
    const [file, setFile] = useState(null)
    const [error, setError] = useState("")


    
const handleSubmit = async (e) => {
  e.preventDefault()
  setError("")

  if (!title.trim()) {
    setError("Please enter a document title.")
    return
  }

  if (!subject.trim()) {
    setError("Please enter a subject.")
    return
  }

  if (!description.trim()) {
    setError("Please enter a description.")
    return
  }

  if (!file) {
    setError("Please select a document.")
    return
  }

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ]

  if (!allowedTypes.includes(file.type)) {
    setError("Only PDF and DOCX files are allowed.")
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    setError("File size must be less than 5 MB.")
    return
  }

  const formData = new FormData()
  formData.append("title", title)
  formData.append("subject", subject)
  formData.append("description", description)
  formData.append("file", file)

  try {
    const response = await api.post("/documents/upload", formData)

    alert(response.data.message)

    setTitle("")
    setSubject("")
    setDescription("")
    setFile(null)

    const fileInput = document.getElementById("document-file")
    if (fileInput) {
      fileInput.value = ""
    }
  } catch (error) {
    setError(
      error.response?.data?.detail ||
      "Document upload failed. Please try again."
    )
  }
}

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-gray-900">
          Upload Document
        </h2>

        <p className="text-gray-500 mt-1">
          Share your study material with other students.
        </p>

      </div>

      <form onSubmit={handleSubmit} className="space-y-5">


        {error && (
  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
    {error}
  </div>
)}

        {/* Document Title */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Title
          </label>

           <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

        </div>

        {/* Subject */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>

            <input
               type="text"
               value={subject}
               onChange={(e) => setSubject(e.target.value)}
               placeholder="Enter subject"
               className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

        </div>

        {/* Description */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>

           <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="Describe your document"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

        </div>

        {/* File */}
<div>

  <label className="block text-sm font-medium text-gray-700 mb-2">
    Select Document
  </label>

  <label
  htmlFor="document-file"
  className="flex items-center w-full min-w-0 px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
>
  <span className="text-gray-700 truncate">
    {file ? file.name : "Choose File"}
  </span>
</label>

  <input
    id="document-file"
    type="file"
    accept=".pdf,.doc,.docx"
    onChange={(e) => setFile(e.target.files[0])}
    className="hidden"
  />

  {file && (
    <p className="text-sm text-green-600 mt-2">
      ✓ Selected file: {file.name}
    </p>
  )}

</div>

        {/* Upload Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
        >
          Upload Document
        </button>

      </form>

    </div>
  )
}

export default UploadModal