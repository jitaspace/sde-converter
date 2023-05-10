import {program} from "@commander-js/extra-typings";

import download from "../commands/download";
import generate from "../commands/generate";
import validate from "../commands/validate";
import packageJson from "../package.json" assert {type: "json"}

program
  .name("sde-converter")
  .version(packageJson.version)
  .description("JitaSpace SDE parser")
    .option("-w, --workDir <path>", "Working directory", "./sde-workdir");

[download, generate, validate].forEach((command) => {
  program.addCommand(command);
});

export function parse() {
  program.parse();
}

export function getWorkingDirectory() {
  return (program.opts() as {workDir: string}).workDir;
}
