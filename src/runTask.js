const fetch = require("node-fetch");
const readPackage = require("./readPackage");
const getCompiledCode = require("./getCompileCoded");
const runInContext = require("./runInContext");
const saveConsole = require("../src/saveConsole");
const restoreConsole = require("../src/restoreConsole");

module.exports = async function runTask(
  program,
  { taskName, data, deliveryId }
) {
  const baseUrl = process.env.BASE_URL;
  const envName = process.env.ENV_NAME;
  const apiKey = process.env.API_KEY;

  const pkg = readPackage(program);

  const compiledCode = getCompiledCode(program, pkg.main);
  const handler = runInContext(program, compiledCode);

  const handlerResult = await handler({
    action: "run",
    taskName,
    data,
  });

  const { statusCode, body } = handlerResult;

  const responseData = JSON.parse(body);

  const { logs } = responseData;

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
      deliveryId,
    }),
  });

  if (response.ok) {
    console.log("Uploaded run result");
  } else {
    console.log("Failed to upload run result");
  }

  return handlerResult;
};
