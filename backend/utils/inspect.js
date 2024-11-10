import * as cheerio from "cheerio";
const options = ["unsubscribe", "click here", "manage preferences"];
function isSubscribed(htmlString) {
  let rtn = "";
  const $ = cheerio.load(htmlString);
  $("a").each((index, element) => {
    const text = $(element).text().trim().toLowerCase();
    const href = $(element).attr("href");
    if (options.includes(text)) {
      rtn = href;
      return;
    }
  });
  return rtn;
}

function getSubscriptions(emails) {
  let found = 0;
  let subbed = [];
  var hyperlink;
  for (let email of emails) {
    if ((hyperlink = isSubscribed(email.html))) {
      //adding hyperlink to json email obj
      email.hyperlink = hyperlink;
      subbed.push(email);

      console.log("found:", found++);
    } else {
      console.log("not found");
    }
  }
  return subbed;
}
export { getSubscriptions };
