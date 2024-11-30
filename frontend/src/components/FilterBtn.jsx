import Button from "@mui/material/Button";
import "../styles/Opaque.css";
import RefreshIcon from "@mui/icons-material/Refresh";

const FilterBtn = ({ setSubscriptions, authentication, filters, setData }) => {
  const fetchEmails = async () => {
    const queryParams = new URLSearchParams(filters);
    console.log("Query params:", queryParams.toString());
    const response = await fetch(
      `http://localhost:3001/subs?${queryParams.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();
    console.log("Data fetched:", data);
    if (data && data.subscriptions && !data["error"]) {
      setSubscriptions(data["subscriptions"]);
      delete data["subscriptions"];
      setData(data);
      console.log("Data set:", data);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Button
        onClick={fetchEmails}
        variant="contained"
        color="secondary"
        startIcon={<RefreshIcon />}
      >
        Fetch
      </Button>
    </div>
  );
};

export default FilterBtn;
