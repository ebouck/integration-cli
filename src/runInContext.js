const fs = require("fs");
const vm = require("node:vm");

module.exports = function compileCode(program, code) {
  const context = {
    exports: {},
    require,
    URL,
    URLSearchParams,
    TextDecoder,
    global,
    console,
    process,
    Buffer,
    clearTimeout,
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
