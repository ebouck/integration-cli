const readPackage = require("./readPackage");
const getCompiledCode = require("./getCompileCoded");
const runInContext = require("./runInContext");
const uploadDeployResult = require("./uploadDeployResult");
const saveConsole = require("../src/saveConsole");
const restoreConsole = require("../src/restoreConsole");

module.exports = async function deploy(program) {
  const pkg = readPackage(program);
  const compiledCode = getCompiledCode(program, pkg.main);
  const handler = runInContext(program, compiledCode);
  const handlerResult = await handler({ action: "deploy" });

  const { statusCode, body } = handlerResult;

  const responseData = JSON.parse(body);

  const { logs } = responseData;

  const status = statusCode >= 300 ? "FAILURE" : "SUCCESS";

  await uploadDeployResult(program, {
    status,
    logs,
    compiledCode: compiledCode.toString("utf-8"),
  });

  return handlerResult;
};
