import { useState,useEffect } from "react"
import axios from "axios"
import DocumentCard from "../components/DocumentCard"
import SearchBar from "../components/SearchBar"

function Documents() {
    const [search, setSearch] = useState("")
    const [subject, setSubject] = useState("All")
    const [sortBy, setSortBy] = useState("default")
    const [minRating, setMinRating] = useState("0")
    const resetFilters = () => {
      setSearch("")
      setSubject("All")
      setSortBy("default")
      setMinRating("0")
    }

    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    
    const fetchDocuments = () => {
  axios.get("http://127.0.0.1:8000/documents", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
  })
    .then((response) => {
      setDocuments(response.data.documents)
      setError("")
    })
    .catch((error) => {
      setError(
        error.response?.data?.detail ||
        "Failed to load documents."
      )
    })
    .finally(() => {
      setLoading(false)
    })
}

useEffect(() => {
  fetchDocuments()
}, [])


  const subjects = [...new Set(documents.map((document) => document.subject))]
  const filteredDocuments = documents
  .filter((document) => {

    
  const searchTerm = search.trim().toLowerCase()
  
  const matchesSearch =
    document.title.toLowerCase().includes(searchTerm) ||
    document.subject.toLowerCase().includes(searchTerm) ||
    (document.description || "").toLowerCase().includes(searchTerm)


    const matchesSubject =
      subject === "All" || document.subject === subject
    const matchesRating = document.rating >= Number(minRating)

    return matchesSearch && matchesSubject && matchesRating
  })
  .sort((a, b) => {

    if (sortBy === "rating") {
      return b.rating - a.rating
    }

    if (sortBy === "downloads") {
      return b.downloads - a.downloads
    }

    if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    }

    return 0
  })

  return (
    <div className="min-w-0 p-4 sm:p-6 lg:p-8">

      {/* Page Header */}
      <div className="mb-8">

        <p className="text-blue-600 font-medium">
          ACADEMIC RESOURCES
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
          Documents
        </h1>

        <p className="text-gray-500 mt-2">
          Explore useful notes, study materials and academic resources.
        </p>

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <div className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2">

  {/* Filter by Subject */}
  <div>

    <label className="block text-sm font-medium text-gray-700 mb-2">
      Filter by Subject
    </label>

    <select
      value={subject}
      onChange={(e) => setSubject(e.target.value)}
      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
    >

      <option value="All">
        All Subjects
      </option>

      {subjects.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}

    </select>

  </div>

  {/* Sort By */}
  <div>

    <label className="block text-sm font-medium text-gray-700 mb-2">
      Sort By
    </label>

    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
    >

      <option value="default">
        Default
      </option>

      <option value="rating">
        Rating: High to Low
      </option>

      <option value="downloads">
        Downloads: High to Low
      </option>

      <option value="title">
        Title: A to Z
      </option>

    </select>

  </div>

  
  {/* Filter by Minimum Rating */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Minimum Rating
    </label>

    <select
      value={minRating}
      onChange={(e) => setMinRating(e.target.value)}
      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="0">All Ratings</option>
      <option value="1">1+ Stars</option>
      <option value="2">2+ Stars</option>
      <option value="3">3+ Stars</option>
      <option value="4">4+ Stars</option>
      <option value="5">5 Stars</option>
    </select>
  </div>


</div>
        
        <button
          type="button"
          onClick={resetFilters}
          className="mb-6 inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-100 hover:shadow-md active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h5M5.5 15a7 7 0 1 0 1.2-7.8L4 9"
            />
          </svg>
          Reset Filters
        </button>

        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Browse your academic resources
          </p>
        
          <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
            {loading ? "Loading..." : `${filteredDocuments.length} found`}
          </span>
        </div>

      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3 lg:gap-6">

        {loading ? (
  <p className="col-span-full text-center text-gray-500">
    Loading documents...
  </p>
) : error ? (
  <p className="col-span-full text-center text-red-500">
    {error}
  </p>
) : filteredDocuments.length > 0 ? (
  filteredDocuments.map((document) => (
    <DocumentCard
  key={document.id}
  document={document}
  onDownloadSuccess={fetchDocuments}
/>
  ))
) : (

  <div className="col-span-full bg-white border border-gray-200 rounded-2xl p-10 text-center">

    <h2 className="text-xl font-bold text-gray-900">
      No Documents Found
    </h2>

    <p className="text-gray-500 mt-2">
      Try searching with a different keyword.
    </p>

  </div>

)}

      </div>

    </div>
  )
}

export default Documents