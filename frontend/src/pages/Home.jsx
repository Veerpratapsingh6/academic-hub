function Home() {
  return (
    <div>

      {/* Hero Section */}
      <section className="bg-white rounded-2xl p-5 md:p-8 border border-gray-200">

        <p className="text-blue-600 font-semibold mb-2">
          WELCOME TO ACADEMIC HUB
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Learn. Share. Grow.
        </h1>

        <p className="mt-4 max-w-2xl text-gray-600 leading-7">
          Academic Hub is a platform where students can discover,
          organize and share useful academic resources.
        </p>

      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500">
            Resources
          </p>

          <h2 className="text-3xl font-bold mt-2">
            1,250+
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500">
            Students
          </p>

          <h2 className="text-3xl font-bold mt-2">
            500+
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500">
            Departments
          </p>

          <h2 className="text-3xl font-bold mt-2">
            10+
          </h2>
        </div>

      </section>

    </div>
  )
}

export default Home