import { Link, useParams } from "react-router-dom"
import { useState } from "react"
import Comment from "../components/Comment"

function DocumentDetails() {

  const { id } = useParams()
  const [saved, setSaved] = useState(false)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([
  {
    name: "Aman Verma",
    text: "Very useful notes. Helped me a lot during exam preparation."
  },
  {
    name: "Priya Singh",
    text: "The DBMS topics are explained really well."
  }
])

  const documents = [
    {
      id: 1,
      title: "DBMS Notes",
      subject: "Database Management System",
      rating: 4.6,
      downloads: 120,
      uploadedBy: "Rahul Sharma",
      description:
        "Complete DBMS study material covering database concepts, SQL, normalization, transactions and important exam topics."
    },
    {
      id: 2,
      title: "Operating System Notes",
      subject: "Operating System",
      rating: 4.8,
      downloads: 95,
      uploadedBy: "Aman Verma",
      description:
        "Complete Operating System notes covering processes, CPU scheduling, deadlocks, memory management and file systems."
    },
    {
      id: 3,
      title: "Computer Networks Notes",
      subject: "Computer Networks",
      rating: 4.5,
      downloads: 80,
      uploadedBy: "Priya Singh",
      description:
        "Computer Networks study material covering OSI model, TCP/IP, Ethernet, routing, protocols and network security."
    },
    {
      id: 4,
      title: "Compiler Design Notes",
      subject: "Compiler Design",
      rating: 4.7,
      downloads: 70,
      uploadedBy: "Karan Gupta",
      description:
        "Compiler Design notes covering lexical analysis, syntax analysis, parsing, CFG, FIRST, FOLLOW and intermediate code generation."
    },
    {
      id: 5,
      title: "Machine Learning Notes",
      subject: "Machine Learning",
      rating: 4.9,
      downloads: 150,
      uploadedBy: "Neha Sharma",
      description:
        "Machine Learning study material covering supervised learning, regression, classification, preprocessing and model evaluation."
    },
    {
      id: 6,
      title: "Data Structures Notes",
      subject: "Data Structures & Algorithms",
      rating: 4.8,
      downloads: 180,
      uploadedBy: "Ravi Kumar",
      description:
        "DSA notes covering arrays, linked lists, stacks, queues, trees, graphs, searching and sorting algorithms."
    }
  ]

  const document = documents.find(
    (item) => item.id === Number(id)
  )

  if (!document) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8">

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

  return (
    <div>

      {/* Back Button */}
      <Link
        to="/documents"
        className="inline-block mb-6 text-blue-600 hover:underline"
      >
        ← Back to Documents
      </Link>

      {/* Document Details */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">

        <p className="text-blue-600 font-medium">
          DOCUMENT DETAILS
        </p>

        <h1 className="text-3xl font-bold text-gray-900 mt-2">
          {document.title}
        </h1>

        <p className="text-gray-500 mt-2">
          {document.subject}
        </p>

        {/* Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Rating
            </p>

            <p className="font-semibold text-gray-900 mt-1">
              ⭐ {document.rating}
            </p>
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

          <p className="text-gray-600 mt-2 leading-7">
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
    onClick={() => {
      if (comment.trim() === "") return

      setComments([
  ...comments,
  {
    name: "You",
    text: comment
  }
])

setComment("")
    }}
    className="mt-3 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
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
        <div className="mt-8 flex gap-3">

  <button
    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
  >
    Download Document
  </button>

  <button
    onClick={() => setSaved(!saved)}
    className={`px-6 py-3 rounded-lg font-medium transition ${
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