#!/usr/bin/env node

require("dotenv").config();
const { program } = require("commander");
const nodemon = require("nodemon");

const readPackage = require("../src/readPackage");
const compileCode = require("../src/compileCode");

program.name("somecode").description("CLI for somecode dev environment");
// program.showHelpAfterError();

program
  .command("dev")
  .description("Automatically compile and deploy on changes to source")
  .action(async () => {
    console.log("calling nodemon");
    nodemon({
      ignoreRoot: [".git"],
      watch: ["src", "node_modules/@bigidea/integration-connectors/dist"],
      ext: "js,ts",
      execMap: {
        js: "npm run build",
      },
    });

    nodemon.on("exit", async () => {
      console.log("ready to deploy");
      const pkg = readPackage(program);
      const handler = compileCode(program, pkg.main);
      await handler({ action: "deploy" });
    });
  });

program
  .command("deploy")
  .description("Deploy the integrations to the dev environment")
  .action(async () => {
    console.log("starting to debug");
    const pkg = readPackage(program);
    const handler = compileCode(program, pkg.main);
    await handler({ action: "deploy" });
  });

program
  .command("run")
  .description("Run a task")
  .argument("<name>", "Name of task to run")
  .action(async (taskName) => {
    console.log("starting to debug");
    const pkg = readPackage(program);
    const handler = compileCode(program, pkg.main);
    await handler({ action: "run", taskName });
  });

program.option("-p, --print");

program.parse();
