import { Link } from "react-router-dom"
import Rating from "./Rating"

function DocumentCard({ document }) {
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

      {/* view details */}
      <Link
          to={`/documents/${document.id}`}
          className="block w-full mt-5 bg-blue-600 text-white py-2.5 rounded-lg font-medium text-center hover:bg-blue-700 transition"
        >
           View Details
        </Link>

    </div>
  )
}

export default DocumentCard