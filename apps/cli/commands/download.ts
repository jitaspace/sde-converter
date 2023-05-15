import { createCommand } from "@commander-js/extra-typings";

import { globalProgress } from "../lib/progress";
import { ensureSdePresentAndExtracted } from "../utils/sde";

export default createCommand("download").action(async (options) => {
  await ensureSdePresentAndExtracted();

  globalProgress.stop();
});
