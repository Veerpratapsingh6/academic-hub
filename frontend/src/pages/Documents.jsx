import { useState } from "react"
import DocumentCard from "../components/DocumentCard"
import { Link } from "react-router-dom"
import SearchBar from "../components/SearchBar"

function Documents() {
    const [search, setSearch] = useState("")
    const [subject, setSubject] = useState("All")
    const [sortBy, setSortBy] = useState("default")

  const documents = [
    {
      id: 1,
      title: "DBMS Notes",
      subject: "Database Management System",
      rating: 4.6,
      downloads: 120
    },
    {
      id: 2,
      title: "Operating System Notes",
      subject: "Operating System",
      rating: 4.8,
      downloads: 95
    },
    {
      id: 3,
      title: "Computer Networks Notes",
      subject: "Computer Networks",
      rating: 4.5,
      downloads: 80
    },
    {
      id: 4,
      title: "Compiler Design Notes",
      subject: "Compiler Design",
      rating: 4.7,
      downloads: 70
    },
    {
      id: 5,
      title: "Machine Learning Notes",
      subject: "Machine Learning",
      rating: 4.9,
      downloads: 150
    },
    {
      id: 6,
      title: "Data Structures Notes",
      subject: "Data Structures & Algorithms",
      rating: 4.8,
      downloads: 180
    }
  ]

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

      <option value="Database Management System">
        Database Management System
      </option>

      <option value="Operating System">
        Operating System
      </option>

      <option value="Computer Networks">
        Computer Networks
      </option>

      <option value="Compiler Design">
        Compiler Design
      </option>

      <option value="Machine Learning">
        Machine Learning
      </option>

      <option value="Data Structures & Algorithms">
        Data Structures & Algorithms
      </option>

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

        {filteredDocuments.length > 0 ? (

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