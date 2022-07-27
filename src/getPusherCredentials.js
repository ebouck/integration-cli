const fetch = require("node-fetch");

module.exports = async function getPusherCredentials(program) {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    program.error("Missing BASE_URL env variable");
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    program.error("Missing API_KEY env variable");
  }

  const response = await fetch(`${baseUrl}/api/v1/realtime/credentials`, {
    headers: {
      Authorization: `apiKey ${apiKey}`,
    },
  });

  const data = await response.json();

  console.log("data", data);

  return data;
};
