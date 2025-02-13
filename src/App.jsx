import { lazy, useState, useId, Suspense, useEffect, useRef } from "react";
import FinanceCard from "./components/FinanceCard";
import RecordEditor from "./components/RecordEditor";
import BarChart from "./components/BarChart";
import config from "./config.json";
import Loading from "./components/Loading";
import Search from "./components/Search";
function App() {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("most-recent");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterBy, setFilterBy] = useState("all");

  const [recordEditorOpen, setRecordEditorOpen] = useState(false);
  const [recordEditorData, setRecordEditorData] = useState({
    id: "",
    key: useId(),
    name: "",
    sum: "",
    date: "",
  });
  const [records, setRecords] = useState(null);
  //Filtered records to enable searching
  const [filteredRecords, setFilteredRecords] = useState(null);
  //Overall balance
  const [overallBalance, setOverallBalance] = useState(
    JSON.parse(localStorage.getItem(config.BALANCE_VALUE_STORAGE_NAME)) ?? 0
  );
  //Theme component
  const [theme, setTheme] = useState(
    localStorage.getItem(config.THEME_VALUE_LOCATION_NAME) ?? ""
  );

  const calculateOverallBalance = (records) => {
    if (!records) {
      setOverallBalance(0);
      return;
    }
    let total = 0;
    for (let record of records) {
      total += Number(record.sum);
    }
    setOverallBalance(total);
  };
  //Used to update records whenever a new one is added without a reload
  const [indicator, setIndicator] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const storedRecords =
        JSON.parse(localStorage.getItem(config.RECORDS_STORAGE_NAME)) ?? [];
      setRecords(storedRecords);
      setFilteredRecords(storedRecords);
    }, 1000); // Simulate lazy load

    return () => clearTimeout(timeout); // Cleanup
  }, [indicator]);
  useEffect(() => {
    calculateOverallBalance(records);
  }, [records]);
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
  const changeFilterState = (val) => {
    setFilterBy(val);
    setIsFilterOpen(false);
  };
  const getFilterByHumanized = () => {
    switch (filterBy) {
      case "all":
        return "All";
      case "this-week":
        return "This week";
      case "this-month":
        return "This month";
      case "this-year":
        return "This year";
      default:
        return "All";
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
  const getRecords = (records, filteredRecords) => {
    // Loading when records == null
    if (!records) return <Loading />;
    // Message in case records == []
    if (records.length == 0)
      return <div className="no-cards">Nothing here yet...</div>;
    // Shouldnt happen though, because filtered records should be equal to records after each reload
    if (!filteredRecords) return <div>Failed to set filtered records</div>;
    // Message in case search didn't give any results
    if (filteredRecords.length == 0)
      return <div className="no-cards">No records follow such name patten</div>;

    //Now that everything is successful, return filtered records
    return filteredRecords
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
      });
  };
  return (
    <>
      <div className={"main " + theme + (anyAlertOpen() ? " no-scroll" : "")}>
        <div className="bg-overlay"></div>
        <div className="header">
          {theme == "dark-theme" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              onClick={() => {
                setTheme("");
                localStorage.removeItem(config.THEME_VALUE_LOCATION_NAME);
              }}
            >
              {/* <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
              <path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              onClick={() => {
                setTheme("dark-theme");
                localStorage.setItem(
                  config.THEME_VALUE_LOCATION_NAME,
                  "dark-theme"
                );
              }}
            >
              {/* <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
              <path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
            </svg>
          )}
        </div>
        <section className="hero">
          <div className="hero-card">
            <div className="hero-heading">
              <div className="balance-heading">
                Your balance is:
                <span
                  className={
                    "balance-value" +
                    (overallBalance < 0 ? " --balance-red" : "") +
                    (overallBalance > 0 ? " --balance-green" : "")
                  }
                >
                  {" "}
                  {overallBalance < 0
                    ? "-$" + Math.abs(overallBalance)
                    : "$" + overallBalance}
                </span>
              </div>
              <div className="filter-container">
                <div
                  className={"sort-overlay" + (isFilterOpen ? " open" : "")}
                  onClick={() => setIsFilterOpen(false)}
                ></div>
                <div className="filter-dropdown">
                  <div
                    className="filter-button"
                    onClick={() => setIsFilterOpen((prevValue) => !prevValue)}
                  >
                    <div className="filter-current-value">
                      {getFilterByHumanized()}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      {/* <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
                      <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                    </svg>
                  </div>
                  {isFilterOpen && (
                    <>
                      <ul className="dropdown-list">
                        <li onClick={() => changeFilterState("all")}>All</li>
                        <li onClick={() => changeFilterState("this-week")}>
                          This week
                        </li>
                        <li onClick={() => changeFilterState("this-month")}>
                          This month
                        </li>
                        <li onClick={() => changeFilterState("this-year")}>
                          This year
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="chart-container">
              <BarChart
                sortRecords={sortRecords}
                records={records}
                filterBy={filterBy}
              />
            </div>
          </div>
        </section>
        <section className="finance-records">
          <div className="finance-records__container">
            <div className="sort-container">
              <div className="sort-current-value">{getSortByHumanized()}</div>
              <div
                className={"sort-overlay" + (isSortOpen ? " open" : "")}
                onClick={() => setIsSortOpen(false)}
              ></div>
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
            <Search
              key={useId()}
              records={records}
              filteredRecords={filteredRecords}
              setFilteredRecords={setFilteredRecords}
              indicator={indicator}
            />
            <div className="finance-cards-container">
              {
                // Much cleaner now. I suppose You will agree that reading a function is much
                // more comfortable than reading html/jsx inside the return statement
                getRecords(records, filteredRecords)
              }
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
