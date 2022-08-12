const getMostRecentDeploy = require("./getMostRecentDeploy");
const runInContext = require("./runInContext");

module.exports = async function undeploy(program) {
  // get code from previous deploy
  const compiledCodeStr = await getMostRecentDeploy(program);
  if (compiledCodeStr) {
    const compiledCode = Buffer.from(compiledCodeStr, "utf-8");
    // run in context
    const handler = runInContext(program, compiledCode);
    // call handler with action undeploy
    const handlerResult = await handler({ action: "undeploy" });

    console.log("handlerResult", handlerResult);

    return handlerResult;
  }

  return null;
};
