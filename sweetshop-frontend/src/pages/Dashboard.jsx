import { useEffect, useState } from "react";
import SweetCard from "../components/SweetCard";
import SearchBar from "../components/SearchBar";
import API from "../services/api";

export default function Dashboard() {
  const [sweets, setSweets] = useState([]); // 👈 empty array instead of undefined
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const fetchSweets = async (query = {}) => {
    setLoading(true);
    try {
      const res = await API.get("/api/sweets/search/", { params: query });
      setSweets(res.data || []); // 👈 fallback to empty array
    } catch {
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
      fetchSweets(filters);
    } catch {
      alert("Purchase failed!");
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sweets && sweets.length > 0 ? (
            sweets.map((s) => (
              <SweetCard key={s.id} sweet={s} onPurchase={handlePurchase} />
            ))
          ) : (
            <p className="text-gray-600">No sweets found.</p>
          )}
        </div>
      )}
    </div>
  );
}
