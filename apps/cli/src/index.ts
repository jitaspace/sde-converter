import fs from "node:fs";
import path from "node:path";
import { program } from "@commander-js/extra-typings";
import convert from "@openapi-contrib/json-schema-to-openapi-schema";
import { pascalCase } from "change-case";
import * as cliProgress from "cli-progress";
import { js2schema } from "js2schema";
import * as YAML from "js-yaml";

import { loadFile, sdeInputFiles } from "./inputs";

program
  .description("JitaSpace SDE parser")
  .option("-s, --sde-path <path>", "Path to the EVE SDE files", "./sde")
  .option("-o, --out-path <path>", "Path to the output directory", "./out");

program.parse();

const options = program.opts() as { sdePath: string; outPath: string };

Object.entries(options).forEach(([key, value]) => {
  console.log(`${key}\t: ${value}`);
});

const universe = {
  asteroid_belts: {},
  constellations: {},
  moons: {},
  planets: {},
  regions: {},
  solar_systems: {},
  stargates: {},
  stars: {},
};

const multibar = new cliProgress.MultiBar(
  {
    //clearOnComplete: false,
    //format: " {bar} {percentage}% | ETA: {eta}s | {value}/{total}",
    format: `{title} | {bar} | {value}/{total} | {duration_formatted}`,
    clearOnComplete: true,
    stopOnComplete: false,
    //noTTYOutput: true,
    //forceRedraw: true,
    emptyOnZero: true,
  },
  cliProgress.Presets.rect,
);

const totalProgress = multibar.create(
  Object.keys(sdeInputFiles).length + Object.keys(universe).length,
  0,
  {
    title: "Total Progress".padEnd(30),
  },
);
multibar.update();

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
    ...Object.values(sdeInputFiles).reduce((tags: Set<string>, file) => {
      file.schemaTags.forEach((tag) => tags.add(tag));
      return tags;
    }, new Set([])),
  ].map((tag) => ({ name: tag })),
  paths: {},
  components: {
    schemas: {},
  },
};

export async function generateCollectionFiles(
  filename: keyof typeof sdeInputFiles,
  sdeRoot: string,
  out: string,
) {
  const file = sdeInputFiles[filename];

  if (!file) {
    throw new Error(`File ${filename} not found in sdeInputFiles`);
  }

  const progress = multibar.create(0, 0, {
    title: `Generating ${file.outputPath}`.padEnd(30),
  });
  multibar.update();

  // Read file
  const data = loadFile(filename, sdeRoot);
  progress.setTotal(Object.keys(data).length);
  multibar.update();

  // TODO transformations?
  // data = file.transformations.reduce((data, transformation) => transformation(data, file), data)

  // create required directories
  const bundlesPath = path.join(
    out,
    "bundled",
    file.outputPath.includes("/")
      ? file.outputPath.slice(0, file.outputPath.lastIndexOf("/"))
      : file.outputPath,
  );
  const indexPath = path.join(out, "latest", `${file.outputPath}.json`);
  const collectionPath = path.join(out, "latest", file.outputPath);
  if (!fs.existsSync(bundlesPath)) {
    fs.mkdirSync(bundlesPath, { recursive: true });
  }
  if (!fs.existsSync(collectionPath)) {
    fs.mkdirSync(collectionPath, { recursive: true });
  }

  // Write bundled file
  const outPath = path.join(
    bundlesPath,
    `${file.outputPath.split("/").at(-1)}.json`,
  );
  fs.writeFileSync(outPath, JSON.stringify(data));

  // write index file
  const allIds = Object.keys(data).map((key) =>
    file.idAttributeType === "number" ? parseInt(key) : key,
  );
  fs.writeFileSync(indexPath, JSON.stringify(allIds));

  // write individual entry files
  if (!fs.existsSync(collectionPath)) {
    fs.mkdirSync(collectionPath, { recursive: true });
  }
  Object.entries(data).forEach(([key, value], index) => {
    if (index % 100 === 0) {
      multibar.update();
    }
    progress.increment();
    fs.writeFileSync(
      path.join(collectionPath, `${key}.json`),
      JSON.stringify(value),
    );
  });

  progress.stop();
  multibar.update();

  // write schema file
  const jsonSchema = js2schema(Object.values(data), {
    title: file.modelName,
    shouldConvertNumberString: true,
    typeResolvers: {},
  });
  const openApiSchema = await convert(jsonSchema);

  // @ts-expect-error
  Object.values(openApiSchema.items.properties ?? []).forEach(
    (property: any) => {
      delete property.description;
    },
  );

  // @ts-expect-error
  schema.components.schemas[file.modelName] = {
    // @ts-expect-error
    ...openApiSchema.items,
    description: file.modelDescription,
    "x-examples": {
      // random example
      example:
        data[
          // @ts-expect-error
          Object.keys(data)[
            Math.floor(Math.random() * Object.keys(data).length)
          ]
        ],
    },
  };

  // @ts-expect-error
  schema.paths[`/${file.outputPath}`] = {
    get: {
      tags: file.schemaTags,
      description: `Get all ${file.prettyModelName} IDs`,
      operationId: `get${file.modelName}Ids`,
      responses: {
        200: {
          description: `A list of all ${file.prettyModelName} IDs`,
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: file.idAttributeType,
                },
              },
            },
          },
        },
      },
    },
  };

  // @ts-expect-error
  schema.paths[`/${file.outputPath}/{${file.pathParameterName}}`] = {
    get: {
      tags: file.schemaTags,
      description: `Get ${file.prettyModelName} by its ID`,
      operationId: `get${file.modelName}ById`,
      parameters: [
        {
          name: file.pathParameterName,
          in: "path",
          description: `The ID of the ${file.prettyModelName} to get`,
          required: true,
          schema: {
            type: file.idAttributeType,
          },
        },
      ],
      responses: {
        200: {
          description: `The requested ${file.prettyModelName}`,
          content: {
            "application/json": {
              schema: {
                $ref: `#/components/schemas/${file.modelName}`,
              },
            },
          },
        },
        404: {
          description: `The requested ${file.prettyModelName} was not found`,
        },
      },
    },
  };

  multibar.remove(progress);
  multibar.update();
}

/**
 * Step 1: parse the non-universe files (at bsd and fsd root directories)
 */
for (const file of Object.keys(sdeInputFiles)) {
  await generateCollectionFiles(file, options.sdePath, options.outPath);
  totalProgress.increment();
  multibar.update();
}

/**
 * Step 2: parse the universe files and create consolidated metadata files
 */
totalProgress.increment();
totalProgress.update({ title: "Universe collections".padEnd(30) });
multibar.update();

const universeNames = fs.readdirSync(
  path.join(options.sdePath, "fsd/universe"),
);
for (const universeName of universeNames) {
  const universePath = path.join(options.sdePath, "fsd/universe", universeName);
  const regionNames = fs.readdirSync(universePath);
  const universeProgress = multibar.create(regionNames.length, 0, {
    title: `Parsing ${universeName} regions`.padEnd(30),
  });
  multibar.update();
  for (const regionName of regionNames) {
    const regionPath = path.join(universePath, regionName);

    let region = YAML.load(
      fs.readFileSync(path.join(regionPath, "region.staticdata"), "utf8"),
    );
    // @ts-expect-error
    region.universeID = universeName;
    // @ts-expect-error
    universe.regions[region.regionID] = region;

    const constellationNames = fs
      .readdirSync(regionPath)
      .filter((file) => !file.endsWith(".staticdata"));
    for (const constellationName of constellationNames) {
      const constellationPath = path.join(regionPath, constellationName);

      let constellation = YAML.load(
        fs.readFileSync(
          path.join(constellationPath, "constellation.staticdata"),
          "utf8",
        ),
      );
      // @ts-expect-error
      constellation.regionID = region.regionID;

      // @ts-expect-error
      universe.constellations[constellation.constellationID] = constellation;

      const solarSystemNames = fs
        .readdirSync(constellationPath)
        .filter((file) => !file.endsWith(".staticdata"));
      for (const solarSystemName of solarSystemNames) {
        const solarSystemPath = path.join(constellationPath, solarSystemName);

        let solarSystem = YAML.load(
          fs.readFileSync(
            path.join(solarSystemPath, "solarsystem.staticdata"),
            "utf8",
          ),
        );
        // @ts-expect-error
        solarSystem.constellationID = constellation.constellationID;

        // @ts-expect-error
        universe.solar_systems[solarSystem.solarSystemID] = solarSystem;

        // @ts-expect-error
        Object.keys(solarSystem.planets).forEach((planetID) => {
          // @ts-expect-error
          const planet = solarSystem.planets[planetID];
          // @ts-expect-error
          planet.solarSystemID = solarSystem.solarSystemID;
          // @ts-expect-error
          universe.planets[planetID] = planet;

          // moons
          Object.keys(planet.moons ?? {}).forEach((moonID) => {
            const moon = planet.moons[moonID];
            moon.planetID = planetID;
            // @ts-expect-error
            universe.moons[moonID] = moon;
          });
          planet.moons = Object.keys(planet.moons ?? {});

          // asteroid belts
          Object.keys(planet.asteroidBelts ?? {}).forEach((asteroidBeltID) => {
            // @ts-expect-error
            universe.asteroid_belts[asteroidBeltID] =
              planet.asteroidBelts[asteroidBeltID];
            // @ts-expect-error
            universe.asteroid_belts[asteroidBeltID].planetID = planetID;
          });
          planet.asteroidBelts = Object.keys(planet.asteroidBelts ?? {});
        });
        // @ts-expect-error
        solarSystem.planets = Object.keys(solarSystem.planets);

        // @ts-expect-error
        Object.keys(solarSystem.stargates ?? {}).forEach((stargateID) => {
          // @ts-expect-error
          universe.stargates[stargateID] = solarSystem.stargates[stargateID];
          // @ts-expect-error
          universe.stargates[stargateID].solarSystemID =
            // @ts-expect-error
            solarSystem.solarSystemID;
        });
        // @ts-expect-error
        solarSystem.stargates = Object.keys(solarSystem.stargates);

        // @ts-expect-error
        if (solarSystem.star) {
          // @ts-expect-error
          universe.stars[solarSystem.star.id] = solarSystem.star;
          // @ts-expect-error
          solarSystem.star = solarSystem.star.id;
        }
      }
    }
    universeProgress.increment();
    multibar.update();
  }
  totalProgress.increment();
  multibar.remove(universeProgress);
  multibar.update();
}

await Promise.all(
  Object.keys(universe).map(async (_key) => {
    // ugly hack to get around typescript complaining about the key being a string
    const key = _key as keyof typeof universe;

    const progress = multibar.create(Object.keys(universe[key]).length, 0, {
      title: `Generating ${key}`.padEnd(30),
    });
    multibar.update();

    // create required directories
    const collectionPath = path.join(
      options.outPath,
      "latest",
      "universe",
      key,
    );
    if (!fs.existsSync(collectionPath)) {
      fs.mkdirSync(collectionPath, { recursive: true });
    }

    // write index file
    const allIds = Object.keys(universe[key]).map((id) => parseInt(id));
    const indexPath = path.join(
      options.outPath,
      "latest",
      "universe",
      `${key}.json`,
    );
    await fs.promises.writeFile(indexPath, JSON.stringify(allIds));

    Object.entries(universe[key]).forEach(([key, value], index) => {
      if (index % 100 === 0) {
        multibar.update();
      }
      progress.increment();

      fs.writeFileSync(
        path.join(collectionPath, `${key}.json`),
        JSON.stringify(value),
      );
    });

    // write schema
    const pathArgumentName = `${key.slice(0, -1)}_id`;
    const modelName = pascalCase(key.slice(0, -1));

    const jsonSchema = js2schema(Object.values(universe[key]), {
      title: modelName,
      shouldConvertNumberString: true,
      typeResolvers: {},
    });
    const openApiSchema = await convert(jsonSchema);

    // @ts-expect-error
    Object.values(openApiSchema.items.properties ?? []).forEach(
      (property: any) => {
        delete property.description;
      },
    );

    // @ts-expect-error
    schema.components.schemas[modelName] = {
      // @ts-expect-error
      ...openApiSchema.items,
      description: `Represents a ${modelName}`,
    };

    // @ts-expect-error
    schema.paths[`/universe/${key}`] = {
      get: {
        tags: ["Universe"],
        description: `Get all ${modelName} IDs`,
        operationId: `get${modelName}Ids`,
        responses: {
          200: {
            description: `A list of all ${modelName} IDs`,
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "integer",
                  },
                },
              },
            },
          },
        },
      },
    };

    // @ts-expect-error
    schema.paths[`/universe/${key}/{${pathArgumentName}}`] = {
      get: {
        tags: ["Universe"],
        description: `Get ${modelName} by its ID`,
        operationId: `get${modelName}ById`,
        parameters: [
          {
            name: `${pathArgumentName}`,
            in: "path",
            description: `The ID of the ${modelName} to get`,
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: `The requested ${modelName}`,
            content: {
              "application/json": {
                schema: {
                  $ref: `#/components/schemas/${modelName}`,
                },
              },
            },
          },
          404: {
            description: `The requested ${modelName} was not found`,
          },
        },
      },
    };

    progress.stop();
    multibar.remove(progress);
    multibar.update();
  }),
);

// write the schema file
await fs.promises.writeFile(
  path.join(options.outPath, "latest", `swagger.json`),
  JSON.stringify(schema, null, 2),
);

totalProgress.stop();
multibar.stop();
