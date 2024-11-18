import * as cheerio from "cheerio";

const options = ["unsubscribe", "click here", "manage preferences"];

// Check if email is subscribed and return the hyperlink
function isSubscribed(htmlString) {
  let rtn = "";
  const $ = cheerio.load(htmlString);
  $("a").each((_, element) => {
    console.log("Checking for subscription");
    const text = $(element).text().trim().toLowerCase();
    const href = $(element).attr("href");
    if (options.includes(text)) {
      console.log("Found subscription:", href);
      rtn = href;
      return;
    }
  });
  console.log("Found subscription:", rtn);
  return rtn;
}

function getSubscriptions(emails) {
  let found = 0;
  let subscriptions = [];
  var hyperlink;
  const marked = new Set();
  console.log("Emails to process:", emails.length);
  for (let email of emails) {
    console.log("Processing email");
    let name = email.from.value[0].name;
    let html = email.html;
    if ((hyperlink = isSubscribed(html))) {
      found++;
      if (marked.has(name)) continue;
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
