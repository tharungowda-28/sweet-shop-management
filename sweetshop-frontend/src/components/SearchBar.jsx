import { useState } from "react";

export default function SearchBar({ onSearch, initial }) {
  const [filters, setFilters] = useState(initial || {});

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-3 items-center"
    >
      <input
        name="name"
        placeholder="Name"
        value={filters.name || ""}
        onChange={handleChange}
        className="px-3 py-2 border rounded-lg flex-1"
      />
      <input
        name="category"
        placeholder="Category"
        value={filters.category || ""}
        onChange={handleChange}
        className="px-3 py-2 border rounded-lg flex-1"
      />
      <input
        name="min_price"
        placeholder="Min Price"
        type="number"
        value={filters.min_price || ""}
        onChange={handleChange}
        className="px-3 py-2 border rounded-lg w-28"
      />
      <input
        name="max_price"
        placeholder="Max Price"
        type="number"
        value={filters.max_price || ""}
        onChange={handleChange}
        className="px-3 py-2 border rounded-lg w-28"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}
