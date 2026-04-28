const { execSync } = require("child_process");
const path = require("path");

process.chdir(__dirname);
const args = process.argv.slice(2).join(" ");
execSync(`node node_modules/@remotion/cli/remotion-cli.js ${args}`, {
  cwd: __dirname,
  stdio: "inherit",
  env: { ...process.env },
});
