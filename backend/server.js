import express from "express";
import cors from "cors";
import opn from "open";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import { processEmails } from "./services/axiosservice.js";
import { oAuth2Client, oAuth2Url } from "./config/oauthclient.js";
import { getUsersEmail } from "./services/gapiservice.js";
import { genImapConfig } from "./config/imapconfig.js";
import { getSubscriptions } from "./utils/inspect.js";
import {
  saveSession,
  deleteSession,
  getSession,
} from "./services/redisservice.js";
import { getEmails } from "./services/imapservice.js";

const app = express();

// middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend origin
    credentials: true, // Allow credentials
  })
);
app.use(cookieParser({ sameSite: "lax" }));
app.use((req, res, next) => {
  if (!req.cookies.sessionID) {
    const uniqueID = uuidv4();
    res.cookie("sessionID", uniqueID, {
      httpOnly: true, // prevent client-side access
      secure: false, // set to true if using HTTPS
      sameSite: "lax", // set lax for cross-domain
    });
    console.log(`New session ID assigned: ${uniqueID}`);
  } else {
    console.log(`Existing session ID: ${req.cookies.sessionID}`);
  }
  next();
});

// authenticate for email and access_token
app.get("/auth", (req, res) => {
  console.log("AUTHING");
  if (!req.cookies.sessionID) {
    console.log("No cookie set");
    res.status(401).json({ error: "No cookie set" });
    return;
  }
  try {
    const url = oAuth2Url(req.cookies.sessionID);
    opn(url, { wait: false });
    res.status(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// store token for later session requests
app.get("/oauth2callback", async (req, res) => {
  try {
    let code = req.query.code;
    let { tokens } = await oAuth2Client.getToken(code); // exchange for tokens
    console.log("Tokens received:", tokens);
    oAuth2Client.setCredentials(tokens);

    let userEmail = await getUsersEmail(oAuth2Client);
    let accessToken = tokens.access_token;
    let sessionID = req.query.state;

    const imapConfig = genImapConfig(userEmail, accessToken);
    await saveSession(sessionID, imapConfig);

    res
      .status(200)
      .send("\n\n\n\nAuthentication successful, you can close this tab");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/get-session", async (req, res) => {
  const sessionID = req.cookies.sessionID;
  if (!sessionID) {
    res.status(404).send("Unauthorized");
    return;
  }
  console.log("Retrieving session:", sessionID);
  try {
    const session = await getSession(sessionID);
    console.log("Session retrieved:", session);
    if (session) {
      console.log("Session found: ", session);
      res.status(200).send("Authorized");
    } else {
      console.log("Session not found: ", session);
      res.status(404).send("Unauthorized");
    }
  } catch (error) {
    console.log("Error retrieving session:", error);
    res.status(500).send("Error retrieving session");
  }
});

app.get("/subs", async (req, res) => {
  console.log("Fetching emails");
  const sessionID = req.cookies.sessionID;
  if (!sessionID) {
    res.status(401).json({ error: "No cookie set" });
    return;
  }
  try {
    const session = await getSession(sessionID);
    if (!session) {
      res.status(401).json({ error: "Session not found" });
      return;
    }
    console.log("Session found:", session);
    const emails = await getEmails(120, session);
    console.log("Emails fetched:", emails.length);

    const json = getSubscriptions(emails);
    console.log("Emails fetched:", json);
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
