import "../styles/App.css";

import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import moment from "moment";

const DatePicker = ({ setStartDate, setEndDate }) => {
  const [dateRange, setDateRange] = useState([
    dayjs(Date.now()).subtract(1, "month"),
    dayjs(Date.now()),
  ]);

  function isValidDate(dateString) {
    const dateFormat = "MM-DD-YYYY";
    return moment(dateString, dateFormat, true).isValid();
  }

  function isValidRange(start, end) {
    const startDate = dayjs(start, "MM-DD-YYYY");
    const endDate = dayjs(end, "MM-DD-YYYY");
    const diffDays = endDate.diff(startDate, "day");
    const diffMonths = endDate.diff(startDate, "month");
    return diffDays >= 1 && diffMonths <= 72;
  }

  const formatDate = (date) => {
    return date ? dayjs(date).format("MM-DD-YYYY") : null;
  };
  const handleInvalidDateRange = () => {};

  const handleDateChange = (newRange) => {
    setDateRange(newRange);
    let startDate = formatDate(newRange[0]);
    let endDate = formatDate(newRange[1]);
    if (isValidDate(startDate) && isValidDate(endDate)) {
      if (isValidRange(startDate, endDate)) {
        setStartDate(startDate);
        setEndDate(endDate);
        console.log("Valid date range");
      } else {
        console.log("Invalid date range");
        handleInvalidDateRange();
      }
    } else {
      console.log("Invalid date");
      //TODO: Signify Invalid date with message
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateRangePicker
          startText="Start Date"
          endText="End Date"
          value={dateRange}
          onChange={handleDateChange}
          disableOpenPicker
          sx={{
            width: "270px",
            "& .MuiInputBase-root": { height: 36 },
          }}
          renderInput={(startProps, endProps) => (
            <div>
              <TextField {...startProps} variant="outlined" />
              <TextField {...endProps} variant="outlined" />
            </div>
          )}
        />
      </LocalizationProvider>
    </div>
  );
};

export default DatePicker;
