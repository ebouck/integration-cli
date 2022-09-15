const getPreviouslyDeployedCode = require("./getPreviouslyDeployedCode");
const getUnsubscribeList = require("./getUnsubscribeList");
const runInContext = require("./runInContext");

module.exports = async function unsubscribe(program) {
  // get code from previous deploy
  const compiledCodeStr = await getPreviouslyDeployedCode(program);
  if (compiledCodeStr) {
    const compiledCode = Buffer.from(compiledCodeStr, "utf-8");
    // const compiledCode = compiledCodeStr;
    // run in context
    const handler = runInContext(program, compiledCode);

    const unsubscribeList = await getUnsubscribeList(program);

    console.log("unsubscribeList", unsubscribeList);

    for (const subscriptionName of unsubscribeList.removed) {
      const handlerResult = await handler({
        action: "unsubscribe",
        subscriptionName,
        removed: true,
      });
    }

    for (const subscriptionName of unsubscribeList.changed) {
      const handlerResult = await handler({
        action: "unsubscribe",
        subscriptionName,
        removed: false,
      });
    }

    // return handlerResult;
  }

  return null;
};
