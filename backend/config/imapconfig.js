function genImapConfig(email, accessToken) {
  const xoauth2String = `user=${userEmail}\x01auth=Bearer ${accessToken}\x01\x01`;
  const xoauth2Base64 = Buffer.from(xoauth2String).toString("base64");
  return {
    user: email,
    xoauth2: xoauth2Base64,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
  };
}

export { genImapConfig };
