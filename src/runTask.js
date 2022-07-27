const readPackage = require("./readPackage");
const compileCode = require("./compileCode");

module.exports = async function runTask(program, { taskName }) {
  const pkg = readPackage(program);
  const handler = compileCode(program, pkg.main);
  return await handler({ action: "run", taskName });
};
