import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";

const EmailList = ({ maxLength, startDate, endDate }) => {
  const [emails, setEmails] = useState([]);
  const [checked, setChecked] = useState([0]);

  const fetchEmails = async () => {
    console.log("FETCHINGG");
    try {
      let queryParams = [];

      if (maxLength) {
        console.log("max length", maxLength);
        queryParams.push(`max=${maxLength}`);
      }
      if (startDate) {
        console.log("start date", startDate);
        queryParams.push(`startDate=${startDate}`);
      }
      if (endDate) {
        console.log("end date", endDate);
        queryParams.push(`endDate=${endDate}`);
      }

      const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
      console.log("query string", queryString);
      const response = await fetch(
        `http://localhost:3001/emails${queryString}`
      );
      const data = await response.json();

      setEmails(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch emails:", error);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleSelectAll = () => {
    const allChecked = emails.map((email, index) => index);
    setChecked(allChecked);
  };

  const handleDeselectAll = () => {
    setChecked([]);
  };

  return (
    <>
      <div>
        <Button onClick={handleSelectAll} variant="contained" color="primary">
          Select All
        </Button>
        <Button
          onClick={fetchEmails}
          variant="contained"
          color="secondary"
          startIcon={<RefreshIcon />}
          style={{
            marginLeft: "15px",
            marginRight: "15px",
            fontSize: "15px",
          }}
        >
          Refresh
        </Button>
        <Button onClick={handleDeselectAll} variant="contained" color="primary">
          Deselect All
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {emails.map((email, index) => {
            const labelId = `checkbox-list-label-${index}`;

            return (
              <>
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    role={undefined}
                    onClick={handleToggle(index)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.indexOf(index) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={email.headers.from} />
                  </ListItemButton>
                </ListItem>
              </>
            );
          })}
        </List>
      </div>
    </>
  );
};

export default EmailList;
