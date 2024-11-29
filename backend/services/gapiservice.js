import { google } from "googleapis";

const isOAuth2Initialized = (oAuth2Client) => {
  const credentials = oAuth2Client.credentials;
  return (
    credentials &&
    credentials.access_token &&
    credentials.expiry_date &&
    Date.now() < credentials.expiry_date
  );
};

async function getUsersEmail(oAuth2Client) {
  if (!isOAuth2Initialized(oAuth2Client)) return null;
  const gmailClient = google.gmail({ version: "v1", auth: oAuth2Client });
  const res = await gmailClient.users.getProfile({
    userId: "me",
  });
  return res.data.emailAddress;
}

export { getUsersEmail };
