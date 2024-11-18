import Imap from "node-imap";
import { simpleParser } from "mailparser";

async function getEmails(n, config) {
  return new Promise((resolve, reject) => {
    console.log("Getting last emails: ", n);
    const imap = new Imap(config);
    console.log("Imap created");

    imap.once("ready", function () {
      console.log("Imap ready");
      imap.openBox("INBOX", true, function (err, box) {
        if (err) {
          reject(err);
          return;
        }

        console.log("Box opened:", box);

        const fetchOptions = {
          bodies: "",
          struct: true,
          markSeen: false,
        };

        const start = Math.max(box.messages.total - n, 1);
        const fetch = imap.seq.fetch(
          `${start}:${box.messages.total}`,
          fetchOptions
        );

        const emails = [];

        fetch.on("message", function (msg) {
          msg.on("body", function (stream) {
            simpleParser(stream, (err, parsed) => {
              if (err) {
                reject(err);
                return;
              }
              emails.push(parsed);
            });
          });
        });

        fetch.once("error", function (err) {
          reject(err);
        });

        fetch.once("end", function () {
          imap.end();
          console.log("Emails fetched:", emails.length);
          resolve(emails);
        });
      });
    });

    imap.once("error", function (err) {
      reject(err);
    });

    imap.connect();
  });
}

export { getEmails };
