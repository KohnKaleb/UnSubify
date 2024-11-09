import { getEmails } from './services/imapservice.js';
import express from 'express';

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get('/emails', async (req, res) => {
    const emails = await getEmails();
    res.json(emails);
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

