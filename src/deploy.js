const fetch = require("node-fetch");
const readPackage = require("./readPackage");
const compileCode = require("./compileCode");
const saveConsole = require("../src/saveConsole");
const restoreConsole = require("../src/restoreConsole");

module.exports = async function deploy(program) {
  const baseUrl = process.env.BASE_URL;
  const envName = process.env.ENV_NAME;
  const apiKey = process.env.API_KEY;

  const pkg = readPackage(program);
  const handler = compileCode(program, pkg.main);
  const handlerResult = await handler({ action: "deploy" });

  const { statusCode, body } = handlerResult;

  const responseData = JSON.parse(body);

  const { logs } = responseData;

  const status = statusCode >= 300 ? "FAILURE" : "SUCCESS";

  const response = await fetch(`${baseUrl}/api/v1/envs/${envName}/deploys`, {
    method: "POST",
    headers: {
      Authorization: `apiKey ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
      logs,
    }),
  });

  if (response.ok) {
    console.log("Uploaded deploy result");
  } else {
    console.log("Failed to upload deploy result");
  }

  return handlerResult;
};
