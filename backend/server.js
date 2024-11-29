import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v4 as uuid } from "uuid";
import { processEmails } from "./services/axiosservice.js";
import { oAuth2Client, oAuth2Url } from "./config/oauthclient.js";
import { getUsersEmail } from "./services/gapiservice.js";
import { getSubscriptions } from "./utils/inspect.js";
import { getEmails } from "./services/imapservice.js";
import {
  saveSession,
  getSessionKey,
  getSessionExpiry,
} from "./services/redisservice.js";

const app = express();

// middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser({ sameSite: "lax" }));

// store session ID in cookie
app.use((req, res, next) => {
  if (!req.cookies.sessionID) {
    const uniqueID = uuid();
    res.cookie("sessionID", uniqueID, {
      httpOnly: true, // prevent client-side access
      secure: false, // set to true if using HTTPS
      sameSite: "lax", // set lax for cross-domain
      maxAge: 24 * 60 * 60 * 1000, // 1 dçay in milliseconds
    });
  }
  next();
});

app.get("/auth", async (req, res) => {
  console.log("AUTHING");
  try {
    // stores session ID in state for access in callback
    const url = oAuth2Url(req.cookies.sessionID);
    res.redirect(url);
    console.log("Redirecting to:", url);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// store token for later session requests
app.get("/oauth2callback", async (req, res) => {
  try {
    let code = req.query.code;
    let { tokens } = await oAuth2Client.getToken(code);
    console.log("Tokens received:", tokens);
    oAuth2Client.setCredentials(tokens);
    const userEmail = await getUsersEmail(oAuth2Client);
    let sessionID = req.query.state;
    await saveSession(sessionID, userEmail, tokens);
    // send message to parent window
    res.send(`
    <script>
    window.opener.postMessage('{"success": true }', '*');
    window.close();
    </script>
  `);
  } catch (error) {
    console.error("Auth Malfunction -> ", error);
    res.send(`
    <script>
    window.opener.postMessage('{"success": false }', '*');
    window.close();
    </script>
  `);
  }
});

app.get("/get-session", async (req, res) => {
  const sessionID = req.cookies.sessionID;
  if (!sessionID) {
    res.json(null);
    return;
  }
  try {
    const expiration = await getSessionExpiry(sessionID);
    if (expiration) {
      res.json({ expiration: expiration });
    } else {
      res.json(null);
    }
  } catch (error) {
    console.log("Error retrieving session:", error);
    res.status(500).send("Error retrieving session");
  }
});

app.get("/subs", async (req, res) => {
  const { startDate, endDate, maxLength } = req.query;
  console.log("Fetching emails");
  const sessionID = req.cookies.sessionID;
  if (!sessionID) {
    res.status(401).json({ error: "No cookie set" });
    return;
  }
  try {
    const imapConfig = JSON.parse(await getSessionKey(sessionID));

    console.log("Session-Key:", imapConfig);
    if (!imapConfig) {
      res.status(401).json({ error: "Session not found" });
      return;
    }
    console.log("Fetching emails");
    const emails = await getEmails(
      imapConfig,
      parseInt(maxLength),
      startDate,
      endDate
    );
    console.log("Emails fetched:", emails.length);
    const json = getSubscriptions(emails);
    console.log("Total sub emails:", json.totalFound);
    res.json(json);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// unsubscribe from list of email hyperlink pairs
app.post("/unsubify", async (req, res) => {
  const { subs } = req.query;
  const results = await processEmails(emails);
  res.json(results);
});
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
