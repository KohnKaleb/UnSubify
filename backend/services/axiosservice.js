import axios from "axios";

async function unsubscribe(url) {
  try {
    const response = await axios.get(url);
    console.log(`Unsubscribed from: ${url} - Status: ${response.status}`);
    return response.status;
  } catch (error) {
    console.log(`Failed to unsubscribe from: ${url} - Error: ${error.message}`);
    return 500;
  }
}

function simplifyCompanyName(companyName) {
  return companyName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function extractCompanyName(url) {
  const hostname = new URL(url).hostname;
  const parts = hostname.split(".");
  let companyName = parts.length > 2 ? parts[1] : parts[0];
  return simplifyCompanyName(companyName);
}
async function processEmails(emails) {
  let results = [];
  for (let email of emails) {
    let result = await unsubscribe(email.hyperlink);
    let company = extractCompanyName(email.hyperlink);
    if (result == 200) {
      results.push((true, company));
    } else {
      results.push((false, company));
    }
  }
  return results;
}

export { processEmails };
