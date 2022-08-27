const readPackage = require("./readPackage");
const getCompiledCode = require("./getCompileCoded");
const getSubscribeList = require("./getSubscribeList");
const runInContext = require("./runInContext");

module.exports = async function subscribe(program) {
  // get code from previous deploy
  const pkg = readPackage(program);

  const compiledCode = getCompiledCode(program, pkg.main);
  // run in context
  const handler = runInContext(program, compiledCode);

  const subscribeList = await getSubscribeList(program);

  console.log("subscribeList", subscribeList);

  for (const subscriptionName of subscribeList.created) {
    const handlerResult = await handler({
      action: "subscribe",
      subscriptionName,
    });
  }

  for (const subscriptionName of subscribeList.changed) {
    const handlerResult = await handler({
      action: "subscribe",
      subscriptionName,
    });
  }

  // return handlerResult;

  return null;
};
