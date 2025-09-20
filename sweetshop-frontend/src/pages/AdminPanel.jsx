import { useState, useEffect } from "react";
import API from "../services/api";

export default function AdminPanel() {
  const [sweets, setSweets] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", price: "", quantity: "" });

  const fetchSweets = async () => {
    try {
      const res = await API.get("/api/sweets/");
      setSweets(res.data);
    } catch {
      alert("Failed to fetch sweets");
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/sweets/", form);
      setForm({ name: "", category: "", price: "", quantity: "" });
      fetchSweets();
    } catch {
      alert("Failed to add sweet");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sweet?")) return;
    try {
      await API.delete(`/api/sweets/${id}/`);
      fetchSweets();
    } catch {
      alert("Failed to delete");
    }
  };

  const handleRestock = async (id) => {
    const qty = prompt("Enter restock quantity:");
    if (!qty) return;
    try {
      await API.post(`/api/sweets/${id}/restock/`, { quantity: qty });
      fetchSweets();
    } catch {
      alert("Failed to restock");
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
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Manage Sweets</h3>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Category</th>
              <th className="border px-4 py-2 text-left">Price</th>
              <th className="border px-4 py-2 text-left">Quantity</th>
              <th className="border px-4 py-2">Actions</th>
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
      </div>
    </div>
  );
}
