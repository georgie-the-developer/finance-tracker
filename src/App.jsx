import { useState } from "react";

function App() {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("most-recent");
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

  return (
    <>
      <div className="main">
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
                  {/* <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
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
              <div className="finance-card">
                <div className="date">10/02/2025</div>
                <div className="name">Nameaofijas</div>
                <div className="sum">-$543</div>
                <div className="action-edit">Edit</div>
                <div className="action-delete">Delete</div>
              </div>
              <div className="finance-card">
                <div className="date">10/02/2025</div>
                <div className="name">Nameaofijas</div>
                <div className="sum">+$543</div>
                <div className="action-edit">Edit</div>
                <div className="action-delete">Delete</div>
              </div>
              <div className="finance-card">
                <div className="date">10/02/2025</div>
                <div className="name">Nameaofijas</div>
                <div className="sum">+$543</div>
                <div className="action-edit">Edit</div>
                <div className="action-delete">Delete</div>
              </div>
              <div className="finance-card">
                <div className="date">10/02/2025</div>
                <div className="name">
                  asdfahdsaffasdfdfsdfasfdsfdfaasdfasfddasf
                </div>
                <div className="sum">+$543</div>
                <div className="action-edit">Edit</div>
                <div className="action-delete">Delete</div>
              </div>
              <div className="finance-card">
                <div className="date">10/02/2025</div>
                <div className="name">Nameaofijas</div>
                <div className="sum">+$543</div>
                <div className="action-edit">Edit</div>
                <div className="action-delete">Delete</div>
              </div>
              <div className="finance-card">
                <div className="date">10/02/2025</div>
                <div className="name">Nameaofijas</div>
                <div className="sum">+$543</div>
                <div className="action-edit">Edit</div>
                <div className="action-delete">Delete</div>
              </div>
              <div className="finance-card">
                <div className="date">10/02/2025</div>
                <div className="name">Nameaofijas</div>
                <div className="sum">+$543</div>
                <div className="action-edit">Edit</div>
                <div className="action-delete">Delete</div>
              </div>
              <div className="finance-card">
                <div className="date">10/02/2025</div>
                <div className="name">Nameaofijas</div>
                <div className="sum">+$543</div>
                <div className="action-edit">Edit</div>
                <div className="action-delete">Delete</div>
              </div>
            </div>
          </div>
        </section>
        <button className="create-finance-record">Create</button>
      </div>
    </>
  );
}

export default App;
