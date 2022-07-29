#!/usr/bin/env node

require("dotenv").config();
const { program } = require("commander");
const nodemon = require("nodemon");
const Pusher = require("pusher-js");
const readPackage = require("../src/readPackage");
const compileCode = require("../src/compileCode");
const getPusherCredentials = require("../src/getPusherCredentials");
const runTask = require("../src/runTask");
const saveConsole = require("../src/saveConsole");
const restoreConsole = require("../src/restoreConsole");

program
  .name("integration")
  .description("CLI for bigidea integration dev environment");
// program.showHelpAfterError();

program
  .command("dev")
  .description("Automatically compile and deploy on changes to source")
  .action(async () => {
    const credentials = await getPusherCredentials(program);

    const pusher = new Pusher(credentials.pusherKey, {
      cluster: credentials.pusherCluster,
    });

    const subscription = pusher.subscribe(`user=${credentials.userId}`);

    const handleRunLocal = async (props) => {
      console.log("in handleRunLocal");
      console.log("props", props);
      // const sc = saveConsole();

      await runTask(program, { taskName: props.taskName, data: props.data });

      // restoreConsole(sc);
    };
    subscription.bind("runLocal", handleRunLocal);

    nodemon({
      ignoreRoot: [".git"],
      watch: ["src", "node_modules/@bigidea/integration-connectors/dist"],
      ext: "js,ts",
      execMap: {
        js: "npm run build",
      },
    });

    nodemon.on("exit", async () => {
      // const sc = saveConsole();

      const pkg = readPackage(program);
      const handler = compileCode(program, pkg.main);
      await handler({ action: "deploy" });

      // restoreConsole(sc);
    });
  });

program
  .command("deploy")
  .description("Deploy the integrations to the dev environment")
  .action(async () => {
    // const sc = saveConsole();

    const pkg = readPackage(program);
    const handler = compileCode(program, pkg.main);
    await handler({ action: "deploy" });

    // restoreConsole(sc);
  });

program
  .command("run")
  .description("Run a task")
  .argument("<name>", "Name of task to run")
  .action(async (taskName) => {
    // const sc = saveConsole();

    await runTask(program, { taskName });

    // restoreConsole(sc);
  });

program.option("-p, --print");

program.parse();
