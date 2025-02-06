import { useState } from "react";
import FinanceCard from "./components/FinanceCard";
import RecordEditor from "./components/RecordEditor";
function App() {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("most-recent");
  const [recordEditorOpen, setRecordEditorOpen] = useState(false);
  const [recordEditorData, setRecordEditorData] = useState({
    name: "",
    sum: "",
    date: "",
  });
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
              <FinanceCard date="11/02/25" name="Name dsafhfasdf" sum={-567} />
              <FinanceCard date="10/02/25" name="Name dsafhfasdf" sum={567} />
              <FinanceCard date="10/02/25" name="Namedsafhfasdf" sum={-567} />
              <FinanceCard
                date="9/02/25"
                name="Name dsafhfasdffdsa"
                sum={567}
              />
              <FinanceCard
                date="7/02/25"
                name="Name dsafhfasdfasdf"
                sum={567}
              />
              <FinanceCard date="5/02/25" name="Ndsafhfa" sum={567} />
              <FinanceCard date="5/02/25" name="Ndsafhfa" sum={567} />
              <FinanceCard date="5/02/25" name="Ndsafhfa" sum={567} />
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
              name={recordEditorData.name}
              sum={recordEditorData.sum}
              date={recordEditorData.date}
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
