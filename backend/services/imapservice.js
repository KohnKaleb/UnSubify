import Imap from "node-imap";
import moment from "moment";
function isValidDate(dateString) {
  const dateFormat = "MM-DD-YYYY";
  return moment(dateString, dateFormat, true).isValid();
}
async function getEmails(imapConfig, size = 100, from, to) {
  if (!isValidDate(from)) {
    from = "11-18-2000";
  }
  if (!isValidDate(to)) {
    to = "11-19-2024";
  }
  const before = to;
  const n = size;
  const since = from;
  const imap = new Imap(imapConfig);
  const isConnected = () =>
    imap.state === "authenticated" || imap.state === "ready";

  function openInbox(cb) {
    imap.openBox("INBOX", true, cb);
  }

  function fetchFilterEmails() {
    return new Promise((resolve, reject) => {
      let searchCriteria = ["UNANSWERED"];
      console.log("since", moment(since).format("DD-MMM-YYYY"));
      console.log("before", moment(before).format("DD-MMM-YYYY"));
      if (since)
        searchCriteria.push(["SINCE", moment(since).format("DD-MMM-YYYY")]);
      if (before)
        searchCriteria.push(["BEFORE", moment(before).format("DD-MMM-YYYY")]);
      imap.search(searchCriteria, (err, results) => {
        if (err) return reject(err);
        console.log("Results:", results.length);
        const filteredEmails = results.slice(-1 * size);

        const fetch = imap.fetch(filteredEmails, {
          bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "TEXT"],
          struct: true,
        });

        const emails = [];

        fetch.on("message", (msg, seqno) => {
          let emailData = {
            html: "",
            name: "",
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

              emailData.name = emailData.from;
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

  function startImapConnection() {
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
                const emails = await fetchFilterEmails(n, since);
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
  try {
    const emails = await startImapConnection(size, since, to);
    console.log("EV$", emails);
    return emails;
  } catch (error) {
    console.error("Error fetching emails:", error);
  }
}

export { getEmails };
