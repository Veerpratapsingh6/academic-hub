function Rating({ rating }) {
  return (
    <div className="flex items-center gap-1">

      <span className="text-yellow-500">
        ★
      </span>

      <span className="font-semibold text-gray-900">
        {rating}
      </span>

    </div>
  )
}

export default Rating