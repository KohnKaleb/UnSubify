import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';

const DatePicker = (setStartDate, setEndDate) => {
    const [dateRange, setDateRange] = useState([null, null]);

    const handleDateChange = (newValue) => {
        setDateRange(newValue);
        setStartDate(newValue[0]);
        setEndDate(newValue[1]);
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
                    <TextField {...startProps}
                        size="small"
                     />
                    <TextField {...endProps}
                        size="small"
                     />
                </>
                )}
            />
        </LocalizationProvider>
    );
};

export default DatePicker;