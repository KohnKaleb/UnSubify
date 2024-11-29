import "../styles/Opaque.css";
import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const SubscriptionList = ({ subscriptions, authentication }) => {
  const [checked, setChecked] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const buttonClass = authentication <= 0 ? "opaque" : "App";

  const handleToggle = (value) => () => {
    if (!subscriptions) return;
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
    if (!subscriptions) return;
    const allChecked = subscriptions.map((sub, index) => index);
    setChecked(allChecked);
  };

  const handleDeselectAll = () => {
    if (!subscriptions) return;
    setChecked([]);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "25px",
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          size="small"
          InputLabelProps={{
            style: { textAlign: "center", width: "100%" },
          }}
        />

        <div
          style={
            filteredSubscriptions.length === 0
              ? {
                  display: "flex",
                  width: "100%",
                  maxWidth: 360,
                  height: 420,
                  overflow: "auto",
                  outline: "2px solid black",
                  justifyContent: "center",
                  alignItems: "center",
                }
              : {
                  display: "flex",
                  width: "100%",
                  maxWidth: 360,
                  height: 420,
                  overflow: "auto",
                  outline: "2px solid black",
                }
          }
        >
          {filteredSubscriptions.length === 0 ? (
            <p>No subscriptions available</p>
          ) : (
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                filter: authentication <= 0 ? "blur(5px)" : "none",
              }}
            >
              {filteredSubscriptions.map((sub, index) => {
                const labelId = `checkbox-list-label-${index}`;

                return (
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
                          sx={{ p: 0 }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={sub.name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Button
            onClick={handleSelectAll}
            variant="contained"
            color="primary"
            className={buttonClass}
            style={{
              fontSize: 10,
              width: 109,
            }}
          >
            Select All
          </Button>

          <Button
            onClick={handleDeselectAll}
            variant="contained"
            color="primary"
            className={buttonClass}
            style={{
              marginLeft: 25,
              fontSize: 10,
              width: 109,
            }}
          >
            Deselect All
          </Button>
        </div>
      </div>
    </>
  );
};

export default SubscriptionList;
