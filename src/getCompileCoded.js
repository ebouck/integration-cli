const fs = require("fs");

module.exports = function compileCode(program, main) {
  return fs.readFileSync(main);
};
