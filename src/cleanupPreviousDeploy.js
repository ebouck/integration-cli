const getMostRecentDeploy = require("./getMostRecentDeploy");
const runInContext = require("./runInContext");

module.exports = async function cleanupPreviousDeploy(program) {
  // get code from previous deploy
  const compiledCodeStr = await getMostRecentDeploy(program);
  if (compiledCodeStr) {
    const compiledCode = Buffer.from(compiledCodeStr, "utf-8");
    // const compiledCode = compiledCodeStr;
    // run in context
    const handler = runInContext(program, compiledCode);
    // call handler with action undeploy
    const handlerResult = await handler({ action: "cleanup" });

    console.log("handlerResult", handlerResult);

    return handlerResult;
  }

  return null;
};
