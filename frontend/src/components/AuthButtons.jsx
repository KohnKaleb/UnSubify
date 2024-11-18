import React, { useState } from "react";

const AuthButtons = () => {
  const [sessionInfo, setSessionInfo] = useState("");

  // Function to trigger the /auth route
  const handleAuth = async () => {
    // Redirect the browser to the /auth route to initiate the Google OAuth flow
    await fetch("http://localhost:3001/auth", {
      method: "GET", // or 'POST', 'PUT', etc.
      credentials: "include", // include cookies in the request
    });
  };

  // Function to fetch session information from the /get-session route
  const isAuthorized = async () => {
    let res = await fetch("http://localhost:3001/get-session", {
      method: "GET",
      credentials: "include",
    });
    setSessionInfo(await res.text());
  };

  return (
    <div>
      <h1>Google OAuth Authentication</h1>
      <button onClick={() => handleAuth()}>Start Authentication</button>
      <button onClick={() => isAuthorized()}>Check Session</button>
      <div>{sessionInfo && <p>Session Info: {sessionInfo}</p>}</div>
    </div>
  );
};

export default AuthButtons;
