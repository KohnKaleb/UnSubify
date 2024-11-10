import { getEmails } from "./services/imapservice.js";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/emails", async (req, res) => {
  console.log("fetching emails");
  const { max, startDate, endDate } = req.query;

  console.log("max", max);
  console.log("startDate", startDate);
  console.log("endDate", endDate);
  const emails = await getEmails(max, startDate, endDate);
  res.json(emails);
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
