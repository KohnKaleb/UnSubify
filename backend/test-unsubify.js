import { processEmails } from "./services/axiosservice.js";
let link = "https://www.google.com";
let res = processEmails([
  {
    hyperlink: link,
  },
]);
