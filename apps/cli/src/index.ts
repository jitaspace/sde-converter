import fs from "fs";
import * as path from "path";
import { program } from "@commander-js/extra-typings";
import convert from "@openapi-contrib/json-schema-to-openapi-schema";
import colors from "ansi-colors";
import * as cliProgress from "cli-progress";
import { js2schema } from "js2schema";

import { SdeInputFile, loadFile, sdeInputFiles } from "./inputs";

program
  .description("JitaSpace SDE parser")
  .option("-s, --sde-root <path>", "Path to the EVE SDE files", "./sde")
  .option("-o, --out <path>", "Path to the output directory", "./out");

program.parse();

const options = program.opts() as { sdeRoot: string; out: string };

console.log(`Options: ${JSON.stringify(options, null, 2)}`);

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

// Converts an array of objects in the format [obj1, obj2, obj3] to {[obj1.id]: obj1, [obj2.id]: obj2, [obj3.id]: obj3}
export function fromArrayOfObjectsToMap(
  array: Record<any, any>[],
  { path, idAttributeName }: SdeInputFile,
) {
  const map: Record<any, any> = {};

  array.forEach((item) => {
    if (!item.hasOwnProperty(idAttributeName)) {
      throw new Error(`⚠️ Missing ID ${idAttributeName} in ${path}`);
    }
    if (map.hasOwnProperty(item[idAttributeName])) {
      throw new Error(
        `⚠️ Duplicate ID ${item[idAttributeName]} found in ${path}`,
      );
    }
    return (map[item[idAttributeName]] = item);
  });
  return map;
}

// given a map of {key: obj, ...} returns the same map but with the key as an attribute of the object
export function addIdToItem(
  obj: Record<any, any>,
  { idAttributeName, idAttributeType }: SdeInputFile,
) {
  Object.keys(obj).forEach(
    (id) =>
      (obj[id][idAttributeName] =
        idAttributeType === "number" ? parseInt(id) : id),
  );
  return obj;
}

/*
export const mapToProperty = (
  array: Record<any, any>,
  { attributeName }: SdeInputFile,
) => {
  //console.log("type", typeof array);
  return array.map((item) => item[attributeName]);
};
*/

/*
export const removeDuplicates = (array) => {
  return [...new Set(array)];
};
*/

export async function generateCollectionFiles(
  filename: keyof typeof sdeInputFiles,
  sdeRoot: string,
  out: string,
) {
  const file = sdeInputFiles[filename];

  if (!file) {
    throw new Error(`File ${filename} not found in sdeInputFiles`);
  }

  const progress = new cliProgress.SingleBar({
    format: `Generating ${file.outputPath} | ${colors.cyan(
      "{bar}",
    )} | {percentage}% || {value}/{total} Files || {duration_formatted}`,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  // Read file
  const data = loadFile(filename, sdeRoot);
  progress.start(Object.keys(data).length, 0);

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
  Object.entries(data).forEach(([key, value]) => {
    progress.increment();
    fs.writeFileSync(
      path.join(collectionPath, `${key}.json`),
      JSON.stringify(value),
    );
  });

  progress.stop();

  // write schema file
  const jsonSchema = js2schema(Object.values(data), {
    title: file.modelName,
    shouldConvertNumberString: true,
    typeResolvers: {},
  });
  //console.log(JSON.stringify(jsonSchema2, null, 2));
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
}

/**
 * Step 1: parse the non-universe files (at bsd and fsd root directories)
 */
for (const file of Object.keys(sdeInputFiles)) {
  const outFilename = path.basename(file);
  //console.log("Generating " + outFilename);
  //console.time("generate " + outFilename);
  await generateCollectionFiles(file, options.sdeRoot, options.out);
  //console.timeEnd("generate " + outFilename);
}

// write the schema file
fs.writeFileSync(
  path.join(options.out, "latest", `swagger.json`),
  JSON.stringify(schema, null, 2),
);

/**
 * Step 2: parse the universe files and create consolidated metadata files
 */
/*
const universeNames = fs.readdirSync(path.join(SDE_ROOT, "fsd/universe"))

const universe = {
    asteroidBelts: {},
    constellations: {},
    moons: {},
    planets: {},
    regions: {},
    solarSystems: {},
    stargates: {},
    stars: {},
}

for (const universeName of universeNames) {
    console.time("parsing universe: " + universeName)
    const universePath = path.join(SDE_ROOT, "fsd/universe", universeName)
    const regionNames = fs.readdirSync(universePath)
    //console.log(universeName, regionNames)
    for (const regionName of regionNames) {
        //console.log('region', regionName)
        const regionPath = path.join(universePath, regionName)

        let region = YAML.load(fs.readFileSync(path.join(regionPath, "region.staticdata"), "utf8"), 'utf8')
        region.universeID = universeName
        //console.log(region)
        universe.regions[region.regionID] = region

        const constellationNames = fs.readdirSync(regionPath).filter(file => !file.endsWith(".staticdata"))
        for (const constellationName of constellationNames) {
            const constellationPath = path.join(regionPath, constellationName)

            let constellation = YAML.load(fs.readFileSync(path.join(constellationPath, "constellation.staticdata"), "utf8"), 'utf8')
            constellation.regionID = region.regionID

            universe.constellations[constellation.constellationID] = constellation

            const solarSystemNames = fs.readdirSync(constellationPath).filter(file => !file.endsWith(".staticdata"))
            for (const solarSystemName of solarSystemNames) {
                const solarSystemPath = path.join(constellationPath, solarSystemName)

                let solarSystem = YAML.load(fs.readFileSync(path.join(solarSystemPath, "solarsystem.staticdata"), "utf8"), 'utf8')
                solarSystem.constellationID = constellation.constellationID

                universe.solarSystems[solarSystem.solarSystemID] = solarSystem

                Object.keys(solarSystem.planets).forEach(planetID => {
                    const planet = solarSystem.planets[planetID]
                    planet.solarSystemID = solarSystem.solarSystemID
                    universe.planets[planetID] = planet

                    // moons
                    Object.keys(planet.moons ?? {}).forEach(moonID => {
                        const moon = planet.moons[moonID]
                        moon.planetID = planetID
                        universe.moons[moonID] = moon
                    })
                    planet.moons = Object.keys(planet.moons ?? {})

                    // asteroid belts
                    Object.keys(planet.asteroidBelts ?? {}).forEach(asteroidBeltID => {
                        universe.asteroidBelts[asteroidBeltID] = planet.asteroidBelts[asteroidBeltID]
                        universe.asteroidBelts[asteroidBeltID].planetID = planetID
                    })
                    planet.asteroidBelts = Object.keys(planet.asteroidBelts ?? {})
                })
                solarSystem.planets = Object.keys(solarSystem.planets)

                Object.keys(solarSystem.stargates ?? {}).forEach(stargateID => {
                    universe.stargates[stargateID] = solarSystem.stargates[stargateID]
                    universe.stargates[stargateID].solarSystemID = solarSystem.solarSystemID
                })
                solarSystem.stargates = Object.keys(solarSystem.stargates)

                if (solarSystem.star) {
                    universe.stars[solarSystem.star.id] = solarSystem.star
                    solarSystem.star = solarSystem.star.id
                }

            }
        }
    }
    console.timeEnd("parsing universe: " + universeName)
}

Object.keys(universe).forEach(key => {
    console.time("writing " + key + ".json")
    fs.writeFileSync(path.join(OUTDIR, key + ".json"), JSON.stringify(universe[key]))
    console.timeEnd("writing " + key + ".json")
})
*/
/**
 * Step 3: Create an index file
 */
/*
console.time("generating index.json")
const outputFilenames = [
    ...[...inputFiles, ...extraFiles].map(file => file.outFile ?? path.basename(file.path.replace(".yaml", ".json"))),
    ...Object.keys(universe).map(key => key + ".json")
]
outputFilenames.sort()

const index = {
    files: outputFilenames
        .map(name => ({
            name,
            size: fs.statSync(path.join(OUTDIR, name)).size,
            mtime: fs.statSync(path.join(OUTDIR, name)).mtime,
            url: BASE_URL + name,
        }))
        .reduce((obj, entry) => Object.assign(obj, {[entry.name]: entry}), {}),
    sdeTimestamp: fs.statSync(path.join(SDE_ROOT, inputFiles[0].path)).mtime,
    timestamp: new Date(),
}

fs.writeFileSync(path.join(OUTDIR, "index.json"), JSON.stringify(index, null, 2))
console.timeEnd("generating index.json")
*/
