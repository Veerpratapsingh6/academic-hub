function Comment({ name, text }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {name.charAt(0)}
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            {name}
          </h3>

          <p className="text-sm text-gray-500">
            Student
          </p>
        </div>

      </div>

      <p className="text-gray-600 mt-4">
        {text}
      </p>

    </div>
  )
}

export default Comment