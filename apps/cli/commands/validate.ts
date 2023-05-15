import { createCommand } from "@commander-js/extra-typings";

import { getWorkingDirectory } from "../lib/cli";
import { globalProgress } from "../lib/progress";
import { getEveRefDataDirectoryContents } from "../utils/everef";

export default createCommand("validate").action(async (options) => {
  console.log("work dir is:", getWorkingDirectory());
  const contents = await getEveRefDataDirectoryContents(
    "https://data.everef.net/ccp/sde/",
  );
  console.log(contents);

  globalProgress.stop();
});
