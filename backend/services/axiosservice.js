const axios = require("axios");

async function unsubscribe(urls) {
  for (const url of urls) {
    try {
      const response = await axios.get(url);
      console.log(`Unsubscribed from: ${url} - Status: ${response.status}`);
    } catch (error) {
      console.error(
        `Failed to unsubscribe from: ${url} - Error: ${error.message}`
      );
    }
  }
}

async function getCompanyName(website) {
  try {
    const response = await axios.get(
      `https://api.example.com/company?website=${website}`
    );
    return response.data.companyName;
  } catch (error) {
    console.error(
      `Failed to get company name for: ${website} - Error: ${error.message}`
    );
    return null;
  }
}

async function processEmails(emails) {
  const urls = emails.map((email) => email.url);
  await unsubscribe(urls);

  const companyNames = await Promise.all(
    emails.map((email) => getCompanyName(email.website))
  );

  return companyNames;
}

export { processEmails };
