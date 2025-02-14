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
        records.filter(
          (record) =>
            record.name.toLowerCase().includes(searchTerm) ||
            new Date(record.date)
              .toLocaleString("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                timeZone: "Europe/London",
              })
              .toLowerCase()
              .includes(searchTerm)
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
          placeholder="Search a record by name or date..."
          onChange={searchRecords}
          value={search}
        />
      </div>
    </div>
  );
}
