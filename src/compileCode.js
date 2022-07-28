const fs = require("fs");
const vm = require("node:vm");

module.exports = function compileCode(program, main) {
  console.log("compiling code");

  const code = fs.readFileSync(main);

  const context = {
    exports: {},
    require,
    URL,
    URLSearchParams,
    TextDecoder,
    global,
    console,
    process,
  };
  vm.createContext(context);

  const script = new vm.Script(code.toString());

  script.runInContext(context);

  // console.log = originalConsole.log;

  if (!context.exports.handler) {
    program.error("Can't find export 'handler'");
  }

  return context.exports.handler;
};
