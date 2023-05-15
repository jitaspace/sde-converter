import * as fs from "node:fs";
import * as path from "node:path";
import { createCommand } from "@commander-js/extra-typings";

import { collections } from "../config/collections";
import { TITLE_WIDTH, getWorkingDirectory } from "../lib/cli";
import { globalProgress } from "../lib/progress";
import { generateCollectionFiles } from "../utils/collections";
import { ensureSdePresentAndExtracted } from "../utils/sde";

export const SDE_PATH = "sde";
export const OUT_PATH = "dist";

export default createCommand("generate").action(async (options) => {
  await ensureSdePresentAndExtracted();

  const totalProgress = globalProgress.create(
    Object.keys(collections).length,
    0,
    {
      title: "Total Progress".padEnd(TITLE_WIDTH),
    },
  );
  globalProgress.update();

  const schema = {
    openapi: "3.0.0",
    info: {
      title: "EVE Static Data Export",
      description: "An OpenAPI for the SDE",
      version: "0.1",
      contact: {
        name: "Joao Neto",
        url: "https://www.jita.space/contact",
      },
    },
    servers: [
      {
        url: "https://sde.jita.space/latest",
        description: "Latest version of the SDE",
      },
    ],
    tags: [
      ...Object.values(collections).reduce((tags: Set<string>, file) => {
        file.tags.forEach((tag) => tags.add(tag));
        return tags;
      }, new Set<string>([])),
    ].map((tag) => ({ name: tag })),
    paths: {},
    components: {
      schemas: {},
    },
  };

  globalProgress.log(`Writing files to ${path.join(getWorkingDirectory())}`);

  for (const [collectionName, collectionMetadata] of Object.entries(
    collections,
  )) {
    await generateCollectionFiles(collectionName, schema);
    totalProgress.increment();
    globalProgress.update();
  }

  // write the schema file
  await fs.promises.writeFile(
    path.join(getWorkingDirectory(), "latest", `swagger.json`),
    JSON.stringify(schema, null, 2),
  );

  totalProgress.stop();
  globalProgress.stop();
});
