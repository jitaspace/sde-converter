import { createCommand } from "@commander-js/extra-typings";

import { getWorkingDirectory } from "../lib/cli";

export default createCommand("validate").action((options) => {
  console.log("work dir is:", getWorkingDirectory());
});
