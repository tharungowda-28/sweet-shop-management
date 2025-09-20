export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6">
      <h1 className="text-4xl font-extrabold text-gray-800">
        🍬 Welcome to SweetShop
      </h1>
      <p className="text-lg text-gray-600 max-w-md">
        Your one-stop shop for the sweetest treats! Browse our collection,
        purchase your favorites, and if you’re an admin, manage stock with ease.
      </p>
      <div className="space-x-4">
        <a
          href="/login"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Login
        </a>
        <a
          href="/register"
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Register
        </a>
      </div>
    </div>
  );
}
