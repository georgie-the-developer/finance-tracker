import { useState } from "react";
import config from "../config.json";
export default function RecordEditor({
  name: initialName,
  sum: initialSum,
  date: initialDate,
  setIndicator,
  closeAlert,
}) {
  const [name, setName] = useState(initialName);
  const [sum, setSum] = useState(initialSum);
  const [date, setDate] = useState(
    initialDate != ""
      ? new Date(initialDate).toISOString().split("T")[0]
      : new Date(Date.now()).toISOString().split("T")[0]
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    let retrievedVals = localStorage.getItem(config.RECORDS_STORAGE_NAME);
    let records = JSON.parse(retrievedVals);
    if (!records) {
      records = [];
    }
    let id = Date.now();
    console.log(new Date(new Date(date).getTime()).toISOString().split("T")[0]);
    let dateToSet = new Date(date).getTime();
    records.push({ id: id, date: dateToSet, name: name, sum: sum });
    localStorage.setItem(config.RECORDS_STORAGE_NAME, JSON.stringify(records));
    setIndicator((prevVal) => prevVal + 1);
    closeAlert();
  };
  return (
    <form className="editor-form" onSubmit={handleSubmit}>
      <div className="inputs-container">
        <div className="input-group">
          <label className="input-group__label" htmlFor="finance-record-name">
            Name
          </label>
          <input
            className="input-group__input"
            type="text"
            id="finance-record-name"
            name="finance-record-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="<15 characters for better readability..."
            required
          />
        </div>
        <div className="input-group">
          <label className="input-group__label" htmlFor="finance-record-sum">
            Sum of money
          </label>
          <input
            className="input-group__input"
            type="number"
            id="finance-record-sum"
            name="finance-record-sum"
            value={sum}
            onChange={(e) => setSum(e.target.value)}
            placeholder="Sum of money (can be negative)"
            max={100000}
            required
          />
        </div>
        <div className="input-group">
          <label className="input-group__label" htmlFor="finance-record-date">
            Date (optional, default is current date)
          </label>
          <input
            className="input-group__input"
            type="date"
            id="finance-record-date"
            name="finance-record-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="submit-container">
        <button className="submit">Create</button>
      </div>
    </form>
  );
}
