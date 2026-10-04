function SearchBar({ search, setSearch }) {
  return (
    <div className="mb-8">

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search documents..."
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
      />

    </div>
  )
}

export default SearchBar