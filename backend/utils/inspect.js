const cheerio = require("cheerio");

function extractLinks(htmlString, options) {
  const $ = cheerio.load(htmlString);
  const result = [];

  $("a").each((index, element) => {
    const text = $(element).text().trim();
    const href = $(element).attr("href");
    if (options.includes(text)) {
      result.push([text, href]);
    }
  });

  return result;
}

module.exports = extractLinks;
