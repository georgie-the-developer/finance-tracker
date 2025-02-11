import { useState, useId, Suspense, useEffect, useRef } from "react";
import FinanceCard from "./components/FinanceCard";
import RecordEditor from "./components/RecordEditor";
import config from "./config.json";
import {
  Chart,
  BarController,
  BarElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
} from "chart.js";
function App() {
  //Register value types used in chart draw
  Chart.register(
    BarController,
    BarElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip
  );
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
  const [records, setRecords] = useState(
    JSON.parse(localStorage.getItem(config.RECORDS_STORAGE_NAME)) ?? []
  );
  //Overall balance
  const [overallBalance, setOverallBalance] = useState(
    JSON.parse(localStorage.getItem(config.BALANCE_VALUE_STORAGE_NAME)) ?? 0
  );
  const chartRef = useRef(null); // Create a ref for the chart canvas
  const chartInstance = useRef(null); // Keep track of the Chart instance
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
  //Alert for confirming a deletion of a record
  useEffect(() => {
    const storedRecords = localStorage.getItem(config.RECORDS_STORAGE_NAME);
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }
  }, [indicator]);
  useEffect(() => {
    calculateOverallBalance(records);
  }, [records]);
  useEffect(() => {
    //A case where records are empty is not handled in any way
    //so, this can be maid into a component
    drawLineChart(records, filterBy);
  }, [records, filterBy]);
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
  // Function that is called to draw a chart in bar-chart canvas
  const drawLineChart = (records, filterBy) => {
    if (!records) return;
    //Get chart's ref or fail
    if (!chartRef.current) return;
    //If older Chart instance is in use, remove it
    if (chartInstance.current) chartInstance.current.destroy();

    /* Custom functions for inner use */

    // Get a start of a first day of the current...

    // ...week...
    const getStartOfWeekTimestamp = () => {
      const now = new Date();
      const dayOfWeek = now.getUTCDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
      const startOfWeek = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - dayOfWeek
        )
      );
      return startOfWeek.getTime();
    };

    // ...month...
    const getStartOfMonthTimestamp = () => {
      const now = new Date();
      const startOfMonth = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
      );
      return startOfMonth.getTime();
    };

    // ...year...
    const getStartOfYearTimestamp = () => {
      const now = new Date();
      const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
      return startOfYear.getTime();
    };
    // ...as a timestamp

    // Get month name based on a number. Months start with 0 as Jan.
    const getShortMonthName = (monthNumber) => {
      return new Date(
        Date.UTC(today.getFullYear(), monthNumber + 1, 1)
      ).toLocaleString("default", { month: "short" });
    };

    let startDate = 0;
    let labels;
    let today = new Date();

    /* Filter flag (startDate) setup and labels specification */

    switch (filterBy) {
      case "this-week":
        startDate = getStartOfWeekTimestamp();
        labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        break;
      case "this-month":
        startDate = getStartOfMonthTimestamp();
        let daysCount = new Date(
          today.getUTCFullYear(),
          today.getUTCMonth() + 1,
          0
        ).getDate();
        if (!daysCount) return;
        let month = today.getUTCMonth() + 1;
        labels = Array.from({ length: daysCount }, (_, i) => {
          let d = i + 1;
          return d + "/" + month;
        });
        break;
      case "this-year":
        startDate = getStartOfYearTimestamp();
        labels = Array.from({ length: 12 }, (_, i) => {
          return getShortMonthName(i);
        });
        break;
      // "all" case is handled as default, so it has been removed for avoiding code duplication
      default:
        let mostRecent = records.sort((a, b) =>
          sortRecords(a, b, "most-recent")
        );
        let newestYear = new Date(mostRecent[0].date).getFullYear();
        let oldestYear = new Date(
          mostRecent[mostRecent.length - 1].date
        ).getFullYear();
        labels = Array.from({ length: newestYear - oldestYear + 1 }, (_, i) => {
          return oldestYear + i;
        });
        break;
    }

    /* Record filtering logic */
    const filterRecordsByStartDate = (records, startDate = 0) => {
      if (!records) return;
      let filteredRecords = records
        .filter((record) => {
          return record.date > startDate;
        })
        // For proper from-left-to-right charting
        .sort((a, b) => sortRecords(a, b, "oldest"));
      return filteredRecords;
    };

    /* Aggregating data */
    const aggregatedData = labels.map((label) => {
      let filteredRecords = filterRecordsByStartDate(records, startDate);
      let sum = filteredRecords
        .filter((record) => {
          let date = new Date(record.date);
          switch (filterBy) {
            case "this-week":
              return (
                date.toLocaleDateString("default", { weekday: "short" }) ===
                label
              );
            case "this-month":
              return `${date.getUTCDate()}/${date.getUTCMonth() + 1}` === label;
            case "this-year":
              return (
                date.toLocaleString("default", { month: "short" }) === label
              );
            default:
              return date.getFullYear() === label;
          }
        })
        .reduce((acc, record) => acc + Number(record.sum), 0);
      return sum;
    });

    /* Finally, the chart paint */
    const backgroundColors = aggregatedData.map((value) =>
      value < 0 ? "rgba(255, 67, 67, 0.7)" : "rgba(115, 255, 136, 0.7)"
    );
    const data = {
      labels: labels,
      datasets: [
        {
          label: "Sum",
          data: aggregatedData,
          backgroundColor: backgroundColors,
          borderColor: "rgba(0, 0, 0, 0.1)",
          borderWidth: 1,
        },
      ],
    };
    const config = {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
      },
    };
    chartInstance.current = new Chart(chartRef.current, config);
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
              <canvas
                className="bar-chart"
                ref={chartRef}
                id="bar-chart"
              ></canvas>
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
            <div className="finance-cards-container">
              <Suspense fallback={<div className="loading">Loading ...</div>}>
                {records.length != 0 ? (
                  records
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
                    })
                ) : (
                  <div className="no-cards">Nothing here yet...</div>
                )}
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
