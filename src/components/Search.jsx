import { useState, useEffect } from "react";

export default function Search({ records, setFilteredRecords, indicator }) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch("");
    setFilteredRecords(records); // Reset filtered records when `indicator` changes
  }, [indicator]);

  const searchRecords = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);

    if (searchTerm) {
      setFilteredRecords(
        records.filter((record) =>
          record.name.toLowerCase().includes(searchTerm)
        )
      );
    } else {
      setFilteredRecords([...records]); // Ensure state change for re-render
    }
  };

  return (
    <div className="search-container">
      <div className="input-container">
        <input
          type="text"
          className="input-container__input"
          placeholder="Search a record by name..."
          onChange={searchRecords}
          value={search}
        />
      </div>
    </div>
  );
}
