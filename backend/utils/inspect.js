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
  return email.trim().replace(/^['"]+|['"]+$/g, "");
}

function getSubscriptions(emails) {
  let found = 0;
  let subscriptions = {};
  let hyperlink;
  const marked = new Set();

  for (let email of emails) {
    console.log("Email from:", email.headers.from);
    let name = extractName(String(email.headers.from));
    let html = email.html;
    if ((hyperlink = isSubscribed(html))) {
      found++;
      if (marked.has(name)) {
        subscriptions[String(name)].value++;
      } else {
        marked.add(String(name));
        subscriptions[String(name)] = {
          name: String(name),
          value: 1,
          hyperLink: hyperlink,
        };
      }
    } else {
      console.log("not found");
    }
  }
  console.log(subscriptions);
  let totalEmails = emails.length;
  let totalSubs = Object.keys(subscriptions).length;
  let other = { name: "other", value: totalEmails - totalSubs };

  console.log("ENTRIES: ", Object.entries(subscriptions));
  return {
    pieChart: Object.values(subscriptions).concat(other),
    subscriptions: Object.entries(subscriptions),
    stats: { totalEmails: totalEmails, totalSubs: totalSubs },
  };
}
export { getSubscriptions };
