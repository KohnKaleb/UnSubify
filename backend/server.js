import { startImapConnection } from './services/imapservice.js';
import express from 'express';

const app = express();

app.get("/", (req, res) => {
  startImapConnection();
  res.send("Hello, World!");
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

