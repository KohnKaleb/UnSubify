import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";

const DatePicker = ({ setStartDate, setEndDate }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const formatDate = (date) => {
    return date ? dayjs(date).format("MM-DD-YYYY") : null;
  };
  const handleDateChange = (newValue) => {
    console.log("New date range: ", newValue);
    setDateRange(newValue);
    setStartDate(formatDate(newValue[0]));
    setEndDate(formatDate(newValue[1]));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangePicker
        startText="Start Date"
        endText="End Date"
        value={dateRange}
        onChange={handleDateChange}
        renderInput={(startProps, endProps) => (
          <>
            <TextField {...startProps} />
            <TextField {...endProps} />
          </>
        )}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
