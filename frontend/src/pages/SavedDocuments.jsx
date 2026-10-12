
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api"

function SavedDocuments() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSavedDocuments = async () => {
      try {
        const response = await api.get("/documents/saved")
        setDocuments(response.data.documents || [])
      } catch (error) {
        console.error("Failed to fetch saved documents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSavedDocuments()
  }, [])


  
const handleUnsave = async (documentId) => {
  try {
    await api.delete(`/documents/${documentId}/save`)

    setDocuments((previousDocuments) =>
      previousDocuments.filter((item) => item.id !== documentId)
    )
  } catch (error) {
    console.error("Failed to unsave document:", error)
    alert(error.response?.data?.detail || "Failed to remove saved document.")
  }
}


  if (loading) {
    return (
      <div className="min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-gray-200" />
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-2xl border border-gray-200 bg-gray-100"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full min-w-0 bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-blue-600">
          YOUR PERSONAL LIBRARY
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Saved Documents
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Keep your important study materials in one place.
        </p>

        <div className="mt-5 h-px bg-gray-200" />
      </div>

      {/* Documents */}
      {documents.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
            ♡
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            No saved documents yet
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            Save useful notes and study materials to find them here later.
          </p>

          <Link
            to="/documents"
            className="mt-6 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Explore Documents
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold text-gray-800">
              Your Collection
            </h2>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              {documents.length}{" "}
              {documents.length === 1 ? "document" : "documents"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {documents.map((document) => (
              <div
                key={document.id}
                className="group min-w-0 rounded-2xl border border-gray-200 bg-white p-4 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-gray-200/60 sm:p-5"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                    📄
                  </div>

                  <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500">
                    Saved
                  </span>
                </div>

                <h3 className="line-clamp-2 min-h-12 text-lg font-semibold leading-6 text-gray-900">
                  {document.title}
                </h3>

                <div className="mt-3">
                  <span className="inline-block max-w-full truncate rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                    {document.subject}
                  </span>
                </div>

                
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                  <Link
                    to={`/documents/${document.id}`}
                    className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    View Details →
                  </Link>
                
                  <button
                    onClick={() => handleUnsave(document.id)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Unsave
                  </button>
                </div>

              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default SavedDocuments
