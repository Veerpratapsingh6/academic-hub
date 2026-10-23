
import { Link, useParams } from "react-router-dom"
import { useState, useEffect, useRef, useCallback } from "react"
import { Document as PdfDocument, Page, pdfjs } from "react-pdf"
import { useInView } from "react-intersection-observer"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import api from "../api"
import Comment from "../components/Comment"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString()


function ScrollablePdfPage({
  pageNumber,
  scale,
  onPageVisible,
  pdfViewerRef,
}) {
  const { ref, inView } = useInView({
    rootMargin: "500px 0px",
    triggerOnce: true,
  })
  
const { ref: visibilityRef, inView: isPageVisible } = useInView({
  root: null,
  threshold: 0.5,
})


useEffect(() => {
  if (!isPageVisible) return

  const viewer = pdfViewerRef?.current
  const pageElement = window.document.getElementById(
    `pdf-page-${pageNumber}`
  )

  if (!viewer || !pageElement) return

  const viewerRect = viewer.getBoundingClientRect()
  const pageRect = pageElement.getBoundingClientRect()

  const visibleTop = Math.max(pageRect.top, viewerRect.top)
  const visibleBottom = Math.min(pageRect.bottom, viewerRect.bottom)
  const visibleHeight = Math.max(0, visibleBottom - visibleTop)

  if (visibleHeight > 0) {
    onPageVisible(pageNumber)
  }
}, [isPageVisible, pageNumber, onPageVisible, pdfViewerRef])


 
  
return (
    <div
  id={`pdf-page-${pageNumber}`}
  ref={(node) => {
    ref(node)
    visibilityRef(node)
  }}
  className="mb-5 flex min-h-[200px] items-start justify-center scroll-mt-4"
>

      {inView ? (
        <Page
          pageNumber={pageNumber}
          scale={scale}
          renderTextLayer={true}
          renderAnnotationLayer={true}
          className="w-fit shadow-md"
        />
      ) : (
        <div className="flex min-h-[200px] w-full items-center justify-center text-sm text-gray-400">
          Page {pageNumber}
        </div>
      )}
    </div>
  )
}




function DocumentDetails() {

  const { id } = useParams()
  const [document, setDocument] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // PDF Viewer state
  const [numPages, setNumPages] = useState(0)
  const pdfViewerRef = useRef(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [targetPage, setTargetPage] = useState("1")
  const [scale, setScale] = useState(1)
  const [pdfSearch, setPdfSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
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
  // Ask the Document state
  const [aiQuestion, setAiQuestion] = useState("")
  const [aiAnswer, setAiAnswer] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState("")
  const [aiMessages, setAiMessages] = useState([])

  const handlePageVisible = useCallback((visiblePage) => {
  setPageNumber(visiblePage)
  setTargetPage(String(visiblePage))
}, [])

  const handlePdfLoadSuccess = ({ numPages }) => {
  setNumPages(numPages)
  setPageNumber(1)
  setTargetPage("1")
}

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      scrollToPdfPage(pageNumber - 1)
    }
  }

  


const scrollToPdfPage = (targetPage) => {
  const viewer = pdfViewerRef.current
  const pageElement = window.document.getElementById(
    `pdf-page-${targetPage}`
  )

  if (!viewer || !pageElement) return

  const viewerRect = viewer.getBoundingClientRect()
  const pageRect = pageElement.getBoundingClientRect()
  const viewerStyle = window.getComputedStyle(viewer)
  const viewerPaddingTop = parseFloat(viewerStyle.paddingTop) || 0

  const targetPosition =
    viewer.scrollTop +
    pageRect.top -
    viewerRect.top -
    viewer.clientTop -
    viewerPaddingTop

  setPageNumber(targetPage)
  setTargetPage(String(targetPage))

  viewer.scrollTo({
    top: targetPosition,
    behavior: "auto",
  })
}




  const goToNextPage = () => {
    if (pageNumber < numPages) {
    scrollToPdfPage(pageNumber + 1)
    }
  }

  const zoomIn = () => {
    setScale((previousScale) => Math.min(previousScale + 0.2, 2.5))
  }

  const zoomOut = () => {
    setScale((previousScale) => Math.max(previousScale - 0.2, 0.6))
  }

  

  const handlePdfSearch = async () => {
    const query = pdfSearch.trim().toLowerCase().replace(/\s+/g, " ")
  
    if (!query || !previewUrl || !numPages) {
      setSearchResults([])
      return
    }
  
    setSearching(true)
    setSearchResults([])
  
    try {
      
      const pdf = await pdfjs.getDocument({ url: previewUrl }).promise
      const results = []
      const maxResults = 200
  
      for (let page = 1; page <= pdf.numPages; page++) {
        const pdfPage = await pdf.getPage(page)
        const textContent = await pdfPage.getTextContent()
  
        const pageText = textContent.items
          .map((item) => item.str || "")
          .join(" ")
          .replace(/\s+/g, " ")
          .toLowerCase()
  
        let startIndex = 0
  
        while (startIndex < pageText.length) {
          const matchIndex = pageText.indexOf(query, startIndex)
  
          if (matchIndex === -1) break
  
          results.push({
            pageNumber: page,
            text: pageText.slice(
              Math.max(0, matchIndex - 50),
              Math.min(pageText.length, matchIndex + query.length + 50)
            ),
          })
  
          if (results.length >= maxResults) break
  
          startIndex = matchIndex + Math.max(query.length, 1)
        }
  
        if (results.length >= maxResults) break
      }
  
      setSearchResults(results)
    } catch (error) {
      console.error("PDF text search failed:", error)
      alert("Could not search this PDF. Please try again.")
    } finally {
      setSearching(false)
    }
  }




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


const handleAskAI = async (e) => {
  e.preventDefault()

  if (!aiQuestion.trim() || aiLoading) return

  const question = aiQuestion.trim()

  const updatedMessages = [
    ...aiMessages,
    { role: "user", content: question },
  ]

  setAiMessages(updatedMessages)
  setAiQuestion("")
  setAiLoading(true)
  setAiAnswer("")
  setAiError("")

  try {
    const response = await api.post("/ai/ask-document", {
      document_id: Number(id),
      question,
      history: aiMessages,
    })

    setAiMessages([
      ...updatedMessages,
      { role: "assistant", content: response.data.answer },
    ])
  } catch (error) {
    console.error("Ask the Document failed:", error)

    setAiError(
      error.response?.data?.detail ||
        "Failed to get an answer. Please try again."
    )
  } finally {
    setAiLoading(false)
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
  if (!document || document.file_extension?.toLowerCase() !== ".pdf") {
    setPreviewUrl(null)
    return
  }

  let objectUrl = null

  const fetchPreview = async () => {
    try {
      const response = await api.get(
        `/documents/${id}/preview`,
        { responseType: "blob" }
      )

      objectUrl = window.URL.createObjectURL(response.data)
      setPreviewUrl(objectUrl)
    } catch (error) {
      console.error("Failed to load PDF preview:", error)
      setPreviewUrl(null)
    }
  }

  fetchPreview()

  return () => {
    if (objectUrl) {
      window.URL.revokeObjectURL(objectUrl)
    }
  }
}, [document, id])



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
        

{/* Ask the Document */}
<div className="mt-8 overflow-hidden rounded-2xl border border-indigo-200 bg-indigo-50/50">
  <div className="border-b border-indigo-100 p-4 sm:p-6">
    <h2 className="text-xl font-bold text-gray-900">
      Ask the Document
    </h2>

    <p className="mt-2 text-sm text-gray-600">
      Chat with AI about this PDF. Ask follow-up questions anytime.
    </p>
  </div>

  {/* Chat messages */}
  <div className="space-y-4 p-4 sm:p-6">
    {aiMessages.length === 0 && !aiLoading && (
      <div className="rounded-xl border border-dashed border-indigo-200 bg-white p-6 text-center">
        <p className="font-medium text-gray-800">
          Start a conversation
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Ask a question about your notes to get started.
        </p>
      </div>
    )}

    {aiMessages.map((message, index) => (
      <div
        key={index}
        className={`flex ${
          message.role === "user" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-[90%] rounded-2xl p-4 sm:max-w-[80%] ${
            message.role === "user"
              ? "rounded-br-md bg-indigo-600 text-white"
              : "rounded-bl-md border border-gray-200 bg-white text-gray-800"
          }`}
        >
          <p className="mb-2 text-xs font-semibold opacity-75">
            {message.role === "user" ? "You" : "AI Tutor"}
          </p>

          <p className="whitespace-pre-wrap break-words text-sm leading-7">
            {message.content}
          </p>
        </div>
      </div>
    ))}

    {aiLoading && (
      <div className="flex justify-start">
        <div className="rounded-2xl rounded-bl-md border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">
            AI Tutor is thinking...
          </p>
        </div>
      </div>
    )}

    {aiError && (
      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
        {aiError}
      </div>
    )}
  </div>

  {/* Question input */}
  <form
    onSubmit={handleAskAI}
    className="border-t border-indigo-100 bg-white p-4 sm:p-6"
  >
    <label
      htmlFor="ai-question"
      className="mb-2 block text-sm font-semibold text-gray-800"
    >
      Your question
    </label>

    <textarea
      id="ai-question"
      value={aiQuestion}
      onChange={(e) => setAiQuestion(e.target.value)}
      placeholder="Ask a question or follow up on the previous answer..."
      rows={3}
      maxLength={2000}
      className="w-full resize-y rounded-xl border border-gray-300 bg-white p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      required
    />

    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-gray-500">
        Answers are based on your PDF and relevant explanations.
      </p>

      <button
        type="submit"
        disabled={aiLoading || !aiQuestion.trim()}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {aiLoading ? "Thinking..." : "Send question"}
      </button>
    </div>
  </form>
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
        

{/* PDF Preview */}
{document.file_extension?.toLowerCase() === ".pdf" && (
  <div className="mt-8 min-w-0">
    <h2 className="mb-4 text-xl font-semibold text-gray-900">
      Advanced PDF Viewer
    </h2>

    {previewUrl ? (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
       
{/* Viewer Controls */}
<div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white p-4">
  {/* Zoom Controls */}
  <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1">
    <button
      type="button"
      onClick={zoomOut}
      disabled={scale <= 0.6}
      title="Zoom out"
      className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-semibold text-gray-700 transition hover:bg-indigo-100 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      −
    </button>

    <span className="min-w-[58px] text-center text-sm font-bold text-gray-800">
      {Math.round(scale * 100)}%
    </span>

    <button
      type="button"
      onClick={zoomIn}
      disabled={scale >= 2.5}
      title="Zoom in"
      className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-semibold text-gray-700 transition hover:bg-indigo-100 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      +
    </button>
  </div>

    {/* Page Navigation */}
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={goToPreviousPage}
        disabled={pageNumber <= 1}
        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Previous
      </button>
  
      
<div className="flex items-center gap-2">
  <span className="whitespace-nowrap rounded-lg bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700">
    {pageNumber} / {numPages || "…"}
  </span>

  <input
    type="number"
    min="1"
    max={numPages || 1}
    value={targetPage}
    onChange={(e) => setTargetPage(e.target.value)}
    className="w-16 rounded-lg border border-gray-300 px-2 py-2 text-center text-sm"
    aria-label="Go to page number"
  />

  <button
    type="button"
    onClick={() => {
      const page = Number(targetPage)

      if (page >= 1 && page <= numPages) {
        scrollToPdfPage(page)
      }
    }}
    disabled={!numPages}
    className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
  >
    Go
  </button>
</div>

  
      <button
        type="button"
        onClick={goToNextPage}
        disabled={pageNumber >= numPages}
        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next →
      </button>
    </div>
  </div>



{/* PDF Text Search */}
<div className="border-b border-gray-200 bg-white p-4">
  <form
    onSubmit={(e) => {
      e.preventDefault()
      handlePdfSearch()
    }}
    className="flex flex-col gap-3 sm:flex-row"
  >
    <input
      type="text"
      value={pdfSearch}
      onChange={(e) => setPdfSearch(e.target.value)}
      placeholder="Search text inside this PDF..."
      className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
    />

    <button
      type="submit"
      disabled={searching || !pdfSearch.trim()}
      className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
    >
      {searching ? "Searching..." : "Search PDF"}
    </button>

    <button
      type="button"
      onClick={() => {
        setPdfSearch("")
        setSearchResults([])
      }}
      className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
    >
      Clear
    </button>
  </form>

  {!searching && pdfSearch.trim() && searchResults.length === 0 && (
    <p className="mt-3 text-sm text-gray-500">
      No results yet. Click Search PDF to find matching text.
    </p>
  )}

  {searchResults.length > 0 && (
    <div className="mt-4 space-y-2">
      <p className="text-sm font-semibold text-gray-700">
        {searchResults.length} match(es) found
      </p>

      <div className="max-h-56 space-y-2 overflow-y-auto">
        {searchResults.map((result, index) => (
          <button
            key={`${result.pageNumber}-${index}`}
            type="button"
            onClick={() => scrollToPdfPage(result.pageNumber)}
            className="block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
          >
            <span className="text-xs font-bold text-indigo-700">
              Page {result.pageNumber}
            </span>
            <span className="mt-1 block text-sm text-gray-700">
              {result.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  )}
</div>



        {/* PDF Page */}
        <div
          ref={pdfViewerRef}
          className="h-[75vh] min-h-[400px] max-h-[800px] overflow-auto overscroll-contain bg-gray-100 p-3 sm:p-5"
        >

          <PdfDocument
            file={previewUrl}
            onLoadSuccess={handlePdfLoadSuccess}
            onLoadError={(error) => {
              console.error("PDF.js failed to load:", error)
            }}
            loading={
              <p className="p-6 text-center text-gray-500">
                Loading PDF...
              </p>
            }
            error={
              <p className="p-6 text-center text-red-600">
                Failed to display this PDF.
              </p>
            }
          >
            
         {Array.from({ length: numPages }, (_, index) => (
           <ScrollablePdfPage
              key={index + 1}
              pageNumber={index + 1}
              scale={scale}
              onPageVisible={handlePageVisible}
              pdfViewerRef={pdfViewerRef}
            />
         ))}

          </PdfDocument>
        </div>
      </div>
    ) : (
      <p className="text-sm text-gray-500">
        Loading PDF preview...
      </p>
    )}
  </div>
)}


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