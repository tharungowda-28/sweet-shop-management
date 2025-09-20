import { useEffect, useState } from "react";
import SweetCard from "../components/SweetCard";
import SearchBar from "../components/SearchBar";
import API from "../services/api";

export default function Dashboard() {
  const [sweets, setSweets] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState("");

  // Fetch sweets from API
  const fetchSweets = async (query = {}) => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/api/sweets/search/", { params: query });
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setSweets(data);
    } catch (err) {
      console.error("Failed to fetch sweets:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError("Unauthorized. Please log in to view sweets.");
      } else {
        setError("Failed to load sweets.");
      }
      setSweets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleSearch = (filters) => {
    setFilters(filters);
    fetchSweets(filters);
  };

  const handlePurchase = async (id) => {
    try {
      await API.post(`/api/sweets/${id}/purchase/`);
      fetchSweets(filters); // refresh after purchase
    } catch (err) {
      console.error("Purchase failed:", err.response?.data || err.message);
      alert(
        "Purchase failed: " + (err.response?.data?.detail || err.message)
      );
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">🍬 Sweet Dashboard</h2>

      <div className="bg-white shadow-md rounded-lg p-4">
        <SearchBar onSearch={handleSearch} initial={filters} />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading sweets...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : sweets.length === 0 ? (
        <p className="text-center text-gray-600">No sweets found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sweets.map((s) => (
            <SweetCard key={s.id} sweet={s} onPurchase={handlePurchase} />
          ))}
        </div>
      )}
    </div>
  );
}
