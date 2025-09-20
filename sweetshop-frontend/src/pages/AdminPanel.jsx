import { useState, useEffect } from "react";
import API from "../services/api";

export default function AdminPanel() {
  const [sweets, setSweets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch sweets from API
  const fetchSweets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/api/sweets/");
      // Handle paginated or array response
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setSweets(data);
    } catch (err) {
      console.error("Failed to fetch sweets", err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError("Unauthorized. Please log in as admin.");
      } else {
        setError("Failed to fetch sweets.");
      }
      setSweets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  // Form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new sweet
  const handleAdd = async (e) => {
    e.preventDefault();
    const { name, category, price, quantity } = form;

    // Basic validation
    if (!name || !category || !price || !quantity) {
      alert("All fields are required");
      return;
    }

    try {
      await API.post("/api/sweets/", {
        name,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
      });
      setForm({ name: "", category: "", price: "", quantity: "" });
      fetchSweets();
    } catch (err) {
      console.error("Add sweet error:", err.response?.data || err.message);
      alert("Failed to add sweet");
    }
  };

  // Delete sweet
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sweet?")) return;
    try {
      await API.delete(`/api/sweets/${id}/`);
      fetchSweets();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert("Failed to delete sweet");
    }
  };

  // Restock sweet
  const handleRestock = async (id) => {
    const qty = prompt("Enter restock quantity:");
    const amount = parseInt(qty, 10);
    if (!amount || amount <= 0) return alert("Invalid quantity");

    try {
      await API.post(`/api/sweets/${id}/restock/`, { amount });
      fetchSweets();
    } catch (err) {
      console.error("Restock error:", err.response?.data || err.message);
      alert(
        "Failed to restock: " +
          (err.response?.data?.detail || err.message)
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-800">👨‍💼 Admin Panel</h2>

      {/* Add Sweet Form */}
      <form
        onSubmit={handleAdd}
        className="bg-white shadow-lg rounded-xl p-6 space-y-4"
      >
        <h3 className="text-xl font-semibold text-gray-700">Add New Sweet</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="px-3 py-2 border rounded-lg"
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="px-3 py-2 border rounded-lg"
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="px-3 py-2 border rounded-lg"
          />
          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            className="px-3 py-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Add Sweet
        </button>
      </form>

      {/* Sweet Table */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Manage Sweets
        </h3>

        {loading ? (
          <p className="text-gray-500">Loading sweets...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : sweets.length === 0 ? (
          <p className="text-gray-500">No sweets available</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Category</th>
                <th className="border px-4 py-2 text-left">Price</th>
                <th className="border px-4 py-2 text-left">Quantity</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sweets.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{s.name}</td>
                  <td className="border px-4 py-2">{s.category}</td>
                  <td className="border px-4 py-2">₹{s.price}</td>
                  <td className="border px-4 py-2">{s.quantity}</td>
                  <td className="border px-4 py-2 flex space-x-2 justify-center">
                    <button
                      onClick={() => handleRestock(s.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Restock
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
