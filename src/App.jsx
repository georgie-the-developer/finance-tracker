import { useState, useId, Suspense, useEffect } from "react";
import FinanceCard from "./components/FinanceCard";
import RecordEditor from "./components/RecordEditor";
import config from "./config.json";
function App() {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("most-recent");
  const [recordEditorOpen, setRecordEditorOpen] = useState(false);
  const [recordEditorData, setRecordEditorData] = useState({
    id: "",
    key: useId(),
    name: "",
    sum: "",
    date: "",
  });
  const [records, setRecords] = useState(
    JSON.parse(localStorage.getItem(config.RECORDS_STORAGE_NAME)) ?? []
  );
  //Used to update records whenever a new one is added without a reload
  const [indicator, setIndicator] = useState(0);
  useEffect(() => {
    const storedRecords = localStorage.getItem(config.RECORDS_STORAGE_NAME);
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }
  }, [indicator]);
  const changeSortState = (val) => {
    setSortBy(val);
    setIsSortOpen(false);
  };
  const getSortByHumanized = () => {
    switch (sortBy) {
      case "most-recent":
        return "Most recent";
      case "oldest":
        return "Oldest";
      case "sum-desc":
        return "Sum of money, desc.";
      case "sum-asc":
        return "Sum of money, asc.";
      default:
        return "Most recent";
    }
  };
  const sortRecords = (a, b, sortBy) => {
    switch (sortBy) {
      case "most-recent":
        return b.date - a.date || b.id - a.id;
      case "oldest":
        return a.date - b.date || a.id - b.id;
      case "sum-desc":
        return b.sum - a.sum;
      case "sum-asc":
        return a.sum - b.sum;
      default:
        return b.date - a.date || b.id - a.id;
    }
  };
  const editRecord = (id, name, sum, date) => {
    setRecordEditorData({ id: id, name: name, sum: sum, date: date });
    setRecordEditorOpen(true);
    setIndicator((prevVal) => prevVal + 1);
  };
  const deleteRecord = (id) => {
    let records =
      JSON.parse(localStorage.getItem(config.RECORDS_STORAGE_NAME)) ?? [];
    let newRecords = records.filter((record) => {
      return record.id !== id;
    });
    localStorage.setItem(
      config.RECORDS_STORAGE_NAME,
      JSON.stringify(newRecords)
    );
    setIndicator((prevVal) => prevVal + 1);
  };
  const openRecordEditor = (name = "", sum = "", date = "") => {
    setRecordEditorOpen(true);
    setRecordEditorData({
      name: name,
      sum: sum,
      date: date || Date.now(),
    });
  };
  const closeRecordEditor = () => {
    setRecordEditorOpen(false);
    setRecordEditorData({
      name: "",
      sum: "",
      date: "",
    });
  };
  const anyAlertOpen = () => {
    if (recordEditorOpen) {
      return true;
    }
  };
  return (
    <>
      <div className={"main" + (anyAlertOpen() ? " no-scroll" : "")}>
        <div className="bg-overlay"></div>
        <section className="hero">
          <div className="hero-card">
            <div className="hero-heading">
              <div className="balance-heading">
                Your balance is:
                <span className="balance-value"> $balanceValue</span>
              </div>
              <select name="" id="" className="filter-dropdown">
                <option value="all-time">All time</option>
                <option value="today">Today</option>
                <option value="last-week">Last week</option>
                <option value="last-month">Last month</option>
                <option value="last-year">Last year</option>
              </select>
            </div>
            <div className="chart-container">
              <div className="line-chart"></div>
            </div>
          </div>
        </section>
        <section className="finance-records">
          <div className="finance-records__container">
            <div className="sort-container">
              <div className="sort-current-value">{getSortByHumanized()}</div>
              <div className="sort-dropdown">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  onClick={() => setIsSortOpen((prevValue) => !prevValue)}
                >
                  {/* <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 25 Fonticons, Inc.--> */}
                  <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8L32 224c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8l256 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" />
                </svg>
                {isSortOpen && (
                  <ul className="dropdown-list">
                    <li onClick={() => changeSortState("most-recent")}>
                      Most recent
                    </li>
                    <li onClick={() => changeSortState("oldest")}>Oldest</li>
                    <li onClick={() => changeSortState("sum-desc")}>
                      Sum of money (desc.)
                    </li>
                    <li onClick={() => changeSortState("sum-asc")}>
                      Sum of money (asc.)
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div className="finance-cards-container">
              <Suspense fallback={<div className="loading">Loading ...</div>}>
                {records
                  .sort((a, b) => sortRecords(a, b, sortBy))
                  .map((record) => {
                    return (
                      <FinanceCard
                        key={record.id}
                        id={record.id}
                        date={record.date}
                        name={record.name}
                        sum={record.sum}
                        editRecord={editRecord}
                        deleteRecord={deleteRecord}
                      />
                    );
                  })}
              </Suspense>
            </div>
          </div>
        </section>
        <div className={"editor-alert" + (recordEditorOpen ? " open" : "")}>
          <>
            <div
              className="editor-alert-overlay"
              onClick={() => closeRecordEditor()}
            ></div>
            <RecordEditor
              key={recordEditorData.key}
              id={recordEditorData.id}
              name={recordEditorData.name}
              sum={recordEditorData.sum}
              date={recordEditorData.date}
              setIndicator={setIndicator}
              closeAlert={closeRecordEditor}
            />
          </>
        </div>
        <div
          className="create-finance-record"
          onClick={() => openRecordEditor()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            {/* <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
          </svg>
        </div>
      </div>
    </>
  );
}

export default App;
