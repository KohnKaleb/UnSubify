import Button from "@mui/material/Button";
import "../styles/App.css";
const AuthBtn = ({ setAuthentication, getSession }) => {
  const handleAuth = () => {
    let n = 5; // minutes until timeout

    const authWindow = window.open(
      "http://localhost:3001/auth",
      "_blank",
      "width=500,height=600"
    );

    const messageListener = async (event) => {
      if (!event.data) return;
      console.log("Message received:", event.data);
      let rev;
      try {
        rev = JSON.parse(event.data);
      } catch (error) {
        console.log("ERR: ", error);
        return;
      }

      window.removeEventListener("message", messageListener);
      setAuthentication(rev);
      clearTimeout(timeoutId);
      if (rev.success) {
        await getSession();
      }
    };

    window.addEventListener("message", messageListener);

    const timeoutId = setTimeout(() => {
      window.removeEventListener("message", messageListener);
      authWindow.close();
      console.log("Authentication timed out");
    }, 60000 * n); // n seconds timeout, here it is set to 10 seconds
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
        gap: "16px",
      }}
    >
      <Button onClick={handleAuth} variant="contained" color="primary">
        Authenticate
      </Button>
    </div>
  );
};

export default AuthBtn;
