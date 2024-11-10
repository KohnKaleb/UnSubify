import { getEmails } from "./services/imapservice.js";
import { processEmails } from "./services/axiosservice.js";
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

app.post("/unsubify", async (req, res) => {
  console.log("unsubscribing emails");
  const { emails } = req.query;
  const results = await processEmails(emails);
  console.log(results);
  res.json(results);
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
