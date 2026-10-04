import { useState } from "react"
import DocumentCard from "../components/DocumentCard"
import { Link } from "react-router-dom"
import SearchBar from "../components/SearchBar"

function Documents() {
    const [search, setSearch] = useState("")

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

  const filteredDocuments = documents.filter((document) =>
  document.title.toLowerCase().includes(search.toLowerCase()) ||
  document.subject.toLowerCase().includes(search.toLowerCase())
)

  return (
    <div>

      {/* Page Header */}
      <div className="mb-8">

        <p className="text-blue-600 font-medium">
          ACADEMIC RESOURCES
        </p>

        <h1 className="text-3xl font-bold text-gray-900 mt-1">
          Documents
        </h1>

        <p className="text-gray-500 mt-2">
          Explore useful notes, study materials and academic resources.
        </p>

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

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

  <div className="col-span-full bg-white border border-gray-200 rounded-xl p-10 text-center">

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