import { useState, useEffect, useRef } from "react";
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
export default function BarChart({ sortRecords, records, filterBy }) {
  Chart.register(
    BarController,
    BarElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip
  );
  const [error, setError] = useState(null);
  const chartRef = useRef(null); // Create a ref for the chart canvas
  const chartInstance = useRef(null); // Keep track of the Chart instance
  const drawLineChart = (records, filterBy = "") => {
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
      value < 0 ? "rgba(255, 67, 67, 0.7)" : "rgb(75, 214, 96)"
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
  useEffect(() => {
    setError(<div className="chart-error">No records yet.</div>);
    if (records) {
      drawLineChart(records, filterBy);
      setError(null);
    }
    return () => chartInstance.current?.destroy();
  }, [records, filterBy]);
  return (
    <>
      {records && (
        <canvas className="bar-chart" ref={chartRef} id="bar-chart"></canvas>
      )}
      {error}
    </>
  );
}
