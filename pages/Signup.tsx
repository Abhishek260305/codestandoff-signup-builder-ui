export default function Signup() {
  return (
    <div className="p-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-yellow-800 mb-4">Sign Up</h2>
        <form className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="your@email.com"
            />
          </div>
          <div className="bg-white p-4 rounded shadow">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

