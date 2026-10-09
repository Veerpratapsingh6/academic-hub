import { useState,useEffect } from "react"
import axios from "axios"
import DocumentCard from "../components/DocumentCard"
import SearchBar from "../components/SearchBar"

function Documents() {
    const [search, setSearch] = useState("")
    const [subject, setSubject] = useState("All")
    const [sortBy, setSortBy] = useState("default")

    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    
    useEffect(() => {
      axios.get("http://127.0.0.1:8000/documents", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      })
        .then((response) => {
          setDocuments(response.data.documents)
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
    }, [])


  const subjects = [...new Set(documents.map((document) => document.subject))]
  const filteredDocuments = documents
  .filter((document) => {

    const matchesSearch =
      document.title.toLowerCase().includes(search.toLowerCase()) ||
      document.subject.toLowerCase().includes(search.toLowerCase())

    const matchesSubject =
      subject === "All" || document.subject === subject

    return matchesSearch && matchesSubject
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
    <div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

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

</div>

        <p className="text-sm text-gray-500 mb-6">
          {filteredDocuments.length} documents found
        </p>

      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

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