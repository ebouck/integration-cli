const fetch = require("node-fetch");
const readPackage = require("./readPackage");
const compileCode = require("./compileCode");

module.exports = async function runTask(program, { taskName }) {
  const baseUrl = process.env.BASE_URL;
  const envName = process.env.ENV_NAME;
  const apiKey = process.env.API_KEY;

  const pkg = readPackage(program);
  const handler = compileCode(program, pkg.main);
  const handlerResult = await handler({ action: "run", taskName });

  const { statusCode, body } = handlerResult;

  const data = JSON.parse(body);

  const { logs } = data;

  const status = statusCode >= 300 ? "FAILURE" : "SUCCESS";

  const response = await fetch(`${baseUrl}/api/v1/envs/${envName}/runs`, {
    method: "POST",
    headers: {
      Authorization: `apiKey ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
      taskName,
      logs,
    }),
  });

  if (response.ok) {
    console.log("Uploaded run result");
  } else {
    console.log("Failed to upload run result");
  }

  return handlerResult;
};
