import Imap from "node-imap";
import { getSubscriptions } from "../utils/inspect.js";
import { imapConfig } from "../config/imapconfig.js";

const imap = new Imap(imapConfig);

function openInbox(cb) {
  imap.openBox("INBOX", true, cb);
}

const isConnected = () =>
  imap.state === "authenticated" || imap.state === "ready";

/**  n - number of emails to fetch,
 *   range - date range to fetch emails from,
 *   returns a promise that resolves with an array of emails
 */

function fetchFilterEmails(n, since = null, before = null) {
  return new Promise((resolve, reject) => {
    let searchCriteria = ["UNANSWERED"];

    if (since) searchCriteria.push(["SINCE", since]);
    if (before) searchCriteria.push(["BEFORE", before]);
    imap.search(searchCriteria, (err, results) => {
      if (err) return reject(err);

      const filteredEmails = results.slice(-1 * n);

      const fetch = imap.fetch(filteredEmails, {
        bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "TEXT"],
        struct: true,
      });

      const emails = [];

      fetch.on("message", (msg, seqno) => {
        let emailData = {
          html: "",
          headers: {},
        };

        msg.on("body", (stream, info) => {
          let buffer = "";
          stream.on("data", (chunk) => {
            buffer += chunk.toString("utf8");
          });

          stream.once("end", () => {
            if (info.which === "HEADER.FIELDS (FROM TO SUBJECT DATE)") {
              emailData.headers = Imap.parseHeader(buffer);
            } else if (info.which === "TEXT") {
              emailData.html = buffer;
            }
          });
        });

        msg.once("attributes", (attrs) => {
          emailData.attributes = attrs;
        });

        msg.once("end", () => {
          emails.push(emailData);
        });
      });

      fetch.once("error", (err) => reject(err));
      fetch.once("end", () => resolve(emails));
    });
  });
}

function startImapConnection(size, from, to) {
  return new Promise((resolve, reject) => {
    if (!isConnected()) {
      imap.once("ready", async function () {
        try {
          openInbox(async (err) => {
            if (err) {
              reject("Error opening inbox: " + err);
              return;
            }

            try {
              const emails = await fetchFilterEmails(size, from, to);
              resolve(emails);
            } catch (error) {
              reject("Error fetching emails: " + error);
            } finally {
              imap.end(); // Close the connection after fetching
            }
          });
        } catch (error) {
          reject("Error during IMAP connection setup: " + error);
        }
      });

      imap.once("error", (err) => {
        console.error("IMAP Connection Error:", err);
        reject("IMAP connection failed: " + err);
      });

      imap.once("end", () => {
        console.log("IMAP connection ended");
      });

      imap.connect();
    } else {
      resolve("Already connected");
    }
  });
}

async function getEmails(size, from, to) {
  try {
    const emails = await startImapConnection(size, from, to);
    return emails;
  } catch (error) {
    console.error("Error fetching emails:", error);
  }
}

export { fetchFilterEmails, startImapConnection, getEmails };
