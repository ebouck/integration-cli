const fetch = require("node-fetch");

module.exports = async function getMostRecentDeploy(program) {
  const baseUrl = process.env.BASE_URL;
  const envName = process.env.ENV_NAME;
  const apiKey = process.env.API_KEY;

  const response = await fetch(
    `${baseUrl}/api/v1/envs/${envName}/deploys/most-recent-code`,
    {
      method: "GET",
      headers: {
        Authorization: `apiKey ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.ok) {
    console.log("Retrieved most recent deploy");
    const data = await response.json();
    const { compiledCode } = data;
    return compiledCode;
  } else {
    console.log("Most recent deploy not found");
    return null;
  }
};
