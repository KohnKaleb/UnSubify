import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";

const EmailList = ({ maxLength, startDate, endDate, spacing }) => {
  const [emails, setEmails] = useState([]);
  const [checked, setChecked] = useState([0]);

  const fetchEmails = (startDate = null, endDate = null) => {
    return new Promise(async (resolve, reject) => {
      try {
        const queryParams = [];
        if (startDate) {
          queryParams.push(`startDate=${null}`);
        }
        if (endDate) {
          queryParams.push(`endDate=${null}`);
        }

        const queryString = queryParams.length
          ? `?${queryParams.join("&")}`
          : "";
        console.log("Query string:", queryString);

        const response = await fetch(`http://localhost:3001/subs`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Query string:", queryString);
        const data = await response.json();
        setEmails(data["subscriptions"]);
        resolve(data);
      } catch (error) {
        console.error("Failed to fetch emails:", error);
      }
    });
  };

  // useEffect(() => {
  //   fetchEmails();
  // }, []);

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
      <div
        style={{
          marginBottom: spacing,
        }}
      >
        <div style={{ margin: spacing }}>
          <Button
            onClick={fetchEmails}
            variant="contained"
            color="secondary"
            startIcon={<RefreshIcon />}
            style={{
              marginLeft: spacing,
              marginRight: spacing,
              fontSize: spacing,
            }}
          >
            Refresh
          </Button>
        </div>
        <Button
          onClick={handleSelectAll}
          variant="contained"
          color="primary"
          style={{
            marginLeft: spacing,
            marginRight: spacing,
            fontSize: spacing,
            width: 190,
          }}
        >
          Select All
        </Button>

        <Button
          onClick={handleDeselectAll}
          variant="contained"
          color="primary"
          style={{
            marginLeft: spacing,
            marginRight: spacing,
            fontSize: spacing,
            width: 190,
          }}
        >
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
                    <ListItemText id={labelId} primary={email.name} />
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
