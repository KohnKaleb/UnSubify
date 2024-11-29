import * as cheerio from "cheerio";

const options = ["unsubscribe", "click here", "manage preferences"];

// Check if email is subscribed and return the hyperlink
function isSubscribed(htmlString) {
  let rtn = "";
  const $ = cheerio.load(htmlString);
  $("a").each((_, element) => {
    const text = $(element).text().trim().toLowerCase();
    const href = $(element).attr("href");
    if (options.includes(text)) {
      rtn = href;
      return;
    }
  });
  return rtn;
}

function extractName(email) {
  if (email.includes("<")) {
    return email.split("<")[0].trim().replace(/"/g, "");
  }
  return email.trim();
}

function getSubscriptions(emails) {
  let found = 0;
  let subscriptions = [];
  var hyperlink;
  const marked = new Set();

  for (let email of emails) {
    console.log("Email from:", email.headers.from);
    let name = extractName(String(email.headers.from));
    let html = email.html;
    if ((hyperlink = isSubscribed(html))) {
      found++;
      if (marked.has(name)) {
        continue;
      }
      marked.add(name);
      let sub = { name: name, hyperLink: hyperlink };
      subscriptions.push(sub);
    } else {
      console.log("not found");
    }
  }
  console.log("Subscriptions found:", subscriptions.length);

  return {
    subscriptions: subscriptions,
    totalSorted: emails.length,
    totalFound: found,
  };
}
export { getSubscriptions };
