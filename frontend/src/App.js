import "./App.css";
import EmailList from "./components/EmailList";
import DatePicker from "./components/DatePicker";

import { useState } from "react";
function App() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [maxLength, setMaxLength] = useState(50);
  return (
    <div className="App">
      <h1>Unsubscribe from Emails</h1>
      <DatePicker setStartDate={setStartDate} setEndDate={setEndDate} />
      <EmailList
        maxLength={maxLength}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}

export default App;
