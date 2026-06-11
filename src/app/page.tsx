export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          BuySmart AI
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">
              Category
            </label>
            <select className="w-full border rounded p-2">
              <option>Phone</option>
              <option>Laptop</option>
              <option>TV</option>
              <option>Headphones</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Budget
            </label>
            <input
              type="number"
              placeholder="Enter budget"
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Country
            </label>
            <select className="w-full border rounded p-2">
              <option>USA</option>
              <option>India</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Priority
            </label>
            <select className="w-full border rounded p-2">
              <option>Best Price</option>
              <option>Best Battery</option>
              <option>Best Performance</option>
              <option>Best Value</option>
            </select>
          </div>

          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Get Recommendations
          </button>
        </div>
      </div>
    </main>
  );
}
