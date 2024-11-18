import { fileURLToPath } from "url";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REDIRECT_URI = "http://localhost:3001/oauth2callback";
const credentialsPath = path.join(__dirname, "credentials.json");
const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://mail.google.com/",
];

const oAuth2Client = new google.auth.OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  REDIRECT_URI
);

const oAuth2Url = (sessionID) =>
  oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    state: sessionID,
  });

export { oAuth2Client, oAuth2Url };
