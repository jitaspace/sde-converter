import * as fs from "node:fs";
import * as path from "node:path";
import { createCommand } from "@commander-js/extra-typings";

import {
  LOCAL_SDE_FILENAME,
  SDE_CHECKSUM_URL,
  SDE_DOWNLOAD_URL,
} from "../config/constants";
import { getWorkingDirectory } from "../lib/cli";
import { globalProgress } from "../lib/progress";
import { downloadFile } from "../utils/download";
import { mkdir, sdeZipChecksum, unzipSde } from "../utils/fs";

export default createCommand("download").action(async (options) => {
  // download latest checksum
  const checksumResponse = await fetch(SDE_CHECKSUM_URL);
  const latestChecksum = (await checksumResponse.text()).trim();

  // check if the SDE file is present and is valid (checksum)
  const localSdePath = path.resolve(getWorkingDirectory(), LOCAL_SDE_FILENAME);
  if (fs.existsSync(localSdePath)) {
    globalProgress.log("SDE file present. Checking checksum...");

    // calculate current checksum
    const currentChecksum = await sdeZipChecksum(localSdePath);

    console.log("latest checksum:", latestChecksum);
    console.log("zip checksum", currentChecksum);

    if (latestChecksum === currentChecksum) {
      globalProgress.log("SDE file is up to date!");
    } else {
      globalProgress.log("SDE file is outdated. Downloading new one...");
      await downloadFile(
        SDE_DOWNLOAD_URL,
        getWorkingDirectory(),
        LOCAL_SDE_FILENAME,
      );
    }
  } else {
    await downloadFile(
      SDE_DOWNLOAD_URL,
      getWorkingDirectory(),
      LOCAL_SDE_FILENAME,
    );
  }

  // at this point, we are guaranteed to have the up-to-date sde.zip file!
  // we now have to extract it!
  mkdir(path.resolve(getWorkingDirectory(), "sde"));
  await unzipSde(
    path.resolve(getWorkingDirectory(), "sde.zip"),
    getWorkingDirectory(),
  );
});
