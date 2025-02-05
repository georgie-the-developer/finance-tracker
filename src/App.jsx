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
              <div className="finance-card">
                <div className="date">10/02/25</div>
                <div className="name">Nameaofijas dfdasfasdfasdf</div>
                <div className="sum">-$543</div>
                <div className="action-edit">Edit</div>
                <div className="action-delete">Delete</div>
                <div className="buttons-container">
                  <div className="btn-container">
                    <svg
                      className="edit-button"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      {/* <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 25 Fonticons, Inc.--> */}
                      <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
                    </svg>
                  </div>

                  <div className="btn-container">
                    <svg
                      className="delete-button"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      {/* <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 25 Fonticons, Inc.--> */}
                      <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="finance-card">
                <div className="date">10/02/25</div>
                <div className="name">Nameaofijas</div>
                <div className="sum">+$543</div>
                <div className="action-edit">Edit</div>
                <div className="action-delete">Delete</div>
              </div>
              <div className="finance-card">
                <div className="date">10/02/25</div>
                <div className="name">Nameaofijas</div>
                <div className="sum">+$543</div>
                <div className="action-edit">Edit</div>
                <div className="action-delete">Delete</div>
              </div>
              <div className="finance-card">
                <div className="date">10/02/25</div>
                <div className="name">
                  asdfahdsaffasdfdfsdfasfdsfdfaasdfasfddasf
                </div>
                <div className="sum">+$543</div>
                <div className="action-edit">Edit</div>
                <div className="action-delete">Delete</div>
              </div>
              <div className="finance-card">
                <div className="date">10/02/25</div>
                <div className="name">Nameaofijas</div>
                <div className="sum">+$543</div>
                <div className="action-edit">Edit</div>
                <div className="action-delete">Delete</div>
              </div>
              <div className="finance-card">
                <div className="date">10/02/25</div>
                <div className="name">Nameaofijas</div>
                <div className="sum">+$543</div>
                <div className="action-edit">Edit</div>
                <div className="action-delete">Delete</div>
              </div>
              <div className="finance-card">
                <div className="date">10/02/25</div>
                <div className="name">Nameaofijas</div>
                <div className="sum">+$543</div>
                <div className="action-edit">Edit</div>
                <div className="action-delete">Delete</div>
              </div>
              <div className="finance-card">
                <div className="date">10/02/25</div>
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
