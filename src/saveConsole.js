module.exports = function saveConsole() {
  const { log, info, warn, error, debug } = console;

  return { log, info, warn, error, debug };
};
