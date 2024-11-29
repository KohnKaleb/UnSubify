import "./styles/App.css";
import "./styles/Opaque.css";
import SubscriptionList from "./components/SubscriptionList";
import DatePicker from "./components/DatePicker";
import { useEffect, useState } from "react";
import AuthBtn from "./components/AuthBtn";
import FilterBtn from "./components/FilterBtn";
import PieChartComponent from "./components/PieChartComponent";

function App() {
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    maxLength: 50,
  });

  const [authentication, setAuthentication] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [data, setData] = useState([]);

  function isValidAndAhead(timestampMs) {
    try {
      const timestamp = Number(timestampMs);
      if (isNaN(timestamp)) {
        return false;
      }
      const now = Date.now();
      return timestamp > now;
    } catch (error) {
      return false;
    }
  }

  const getSession = async () => {
    const response = await fetch(`http://localhost:3001/get-session`, {
      method: "GET",
      credentials: "include",
    });

    let authStatus = await response.json();
    if (!authStatus) return;
    setAuthentication(authStatus.expiration);
  };

  useEffect(() => {
    getSession();
  }, []);

  const appMode = isValidAndAhead(authentication)
    ? "clear-mode"
    : "opaque-mode";

  return (
    <div className="container">
      <div className="auth-btn">
        <AuthBtn
          setAuthentication={setAuthentication}
          getSession={getSession}
        />
      </div>
      <span className="pie-chart">
        <PieChartComponent data={data} />
      </span>
      <span className={appMode}>
        <h1 className="title-header">Unsubify</h1>
        <DatePicker
          setStartDate={(date) => setFilters({ ...filters, startDate: date })}
          setEndDate={(date) => setFilters({ ...filters, endDate: date })}
        />
        <FilterBtn
          setSubscriptions={setSubscriptions}
          authentication={authentication}
          filters={filters}
          setData={setData}
        />
        <SubscriptionList
          subscriptions={subscriptions}
          authentication={authentication}
        />
      </span>
    </div>
  );
}

export default App;
