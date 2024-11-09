import Imap from 'node-imap';
import { imapConfig } from '../config/imapconfig.js';

const imap = new Imap(imapConfig);

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

function fetchLast50Emails() {
    return new Promise((resolve, reject) => {
      imap.search(['ALL'], (err, results) => {
        if (err) return reject(err);
  
        const last50Emails = results.slice(-50);
        const fetch = imap.fetch(last50Emails, {
          bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
          struct: true,
        });
  
        const emails = [];
  
        fetch.on('message', (msg, seqno) => {
          let emailData = {
            html: '',
            headers: {}
          };
  
          msg.on('body', (stream, info) => {
            let buffer = '';
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });
  
            stream.once('end', () => {
              if (info.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)') {
                emailData.headers = Imap.parseHeader(buffer);
              } else if (info.which === 'TEXT') {
                emailData.html = buffer;
              }
            });
          });
  
          msg.once('attributes', (attrs) => {
            emailData.attributes = attrs;
          });
  
          msg.once('end', () => {
            emails.push(emailData);
          });
        });
  
        fetch.once('error', (err) => reject(err));
        fetch.once('end', () => resolve(emails));
      });
    });
  }  

function startImapConnection() {
  imap.once('ready', async function () {
    try {
      openInbox(async (err) => {
        if (err) throw err;

        const emails = await fetchLast50Emails();
        console.log('Fetched emails:', emails);

        imap.end();
      });
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  });

  imap.once('error', function (err) {
    console.error('IMAP Connection Error:', err);
  });

  imap.once('end', function () {
    console.log('Connection ended');
  });

  imap.connect();
}

function fetchEmailsOnStart() {
    startImapConnection(async () => {
      const emails = await fetchLast50Emails();
      console.log('Fetched emails:', emails);
    });
  }

export { fetchLast50Emails, startImapConnection, fetchEmailsOnStart };
