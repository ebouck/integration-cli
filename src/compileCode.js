const fs = require("fs");
const vm = require("node:vm");

module.exports = function compileCode(program, main) {
  const code = fs.readFileSync(main);

  const context = {
    exports: {},
    require,
    URL,
    URLSearchParams,
    global,
    console,
    process,
  };
  vm.createContext(context);

  const script = new vm.Script(code.toString());

  script.runInContext(context);

  if (!context.exports.handler) {
    program.error("Can't find export 'handler'");
  }

  return context.exports.handler;
};
