export default function SweetCard({ sweet, onPurchase }) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{sweet.name}</h3>
      <p className="text-gray-600">Category: {sweet.category}</p>
      <p className="text-gray-600">Price: ₹{sweet.price}</p>
      <p
        className={`${
          sweet.quantity === 0 ? "text-red-600 font-medium" : "text-gray-600"
        }`}
      >
        Quantity: {sweet.quantity}
      </p>

      <button
        disabled={sweet.quantity === 0}
        onClick={() => onPurchase(sweet.id)}
        className={`mt-4 py-2 rounded-lg font-medium transition-colors ${
          sweet.quantity === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {sweet.quantity === 0 ? "Out of Stock" : "Purchase"}
      </button>
    </div>
  );
}
