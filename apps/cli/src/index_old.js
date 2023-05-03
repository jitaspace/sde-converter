import * as fs from "fs";
import * as path from "path";
import { program } from "commander";
import * as YAML from "js-yaml";

program
  .option("-s, --sde <path>", "Path to the EVE SDE files")
  .option("-o, --out <path>", "Path to the output directory")
  .option("-b, --base-url <url>", "Base URL for the SDE files");

// Filesystem path to the EVE SDE files
const SDE_ROOT = "./sde";
const OUTDIR = "./out";
const BASE_URL = "https://sde.jita.space/";

// Converts an array of objects in the format [obj1, obj2, obj3] to {[obj1.id]: obj1, [obj2.id]: obj2, [obj3.id]: obj3}
const fromArrayOfObjectsToMap = (
  array: object[],
  { path, idAttributeName },
) => {
  const map = {};
  array.forEach((item) => {
    if (map.hasOwnProperty(item[idAttributeName])) {
      console.log(`⚠️ Duplicate ID ${item[idAttributeName]} found in ${path}`);
      throw new Error(
        `⚠️ Duplicate ID ${item[idAttributeName]} found in ${path}`,
      );
    }
    return (map[item[idAttributeName]] = item);
  });
  return map;
};

// given a map of {key: obj, ...} returns the same map but with the key as an attribute of the object
const addIdToItem = (obj, { idAttributeName }) => {
  Object.keys(obj).forEach((id) => (obj[id][idAttributeName] = id));
  return obj;
};

const mapToProperty = (array, { attributeName }) => {
  console.log("type", typeof array);
  return array.map((item) => item[attributeName]);
};

/*
const removeDuplicates = (array) => {
    return [...new Set(array)]
}*/

const inputFiles = [
  {
    path: "bsd/invFlags.yaml",
    idAttributeName: "flagID",
    transformations: [fromArrayOfObjectsToMap],
    index: "inventory/flags",
  },
  {
    path: "bsd/invItems.yaml",
    idAttributeName: "itemID",
    transformations: [fromArrayOfObjectsToMap],
    index: "inventory/items",
  },
  {
    path: "bsd/invNames.yaml",
    idAttributeName: "itemID",
    transformations: [fromArrayOfObjectsToMap],
    index: "inventory/names",
  },
  {
    path: "bsd/invPositions.yaml",
    idAttributeName: "itemID",
    transformations: [fromArrayOfObjectsToMap],
    index: "inventory/positions",
  },
  {
    path: "bsd/invUniqueNames.yaml",
    idAttributeName: "itemID",
    transformations: [fromArrayOfObjectsToMap],
    index: "inventory/unique_names",
  },
  {
    path: "bsd/staStations.yaml",
    idAttributeName: "stationID",
    transformations: [fromArrayOfObjectsToMap],
    index: "stations",
  },
  {
    path: "fsd/agents.yaml",
    idAttributeName: "characterID",
    transformations: [addIdToItem],
    index: "agents",
  },
  {
    path: "fsd/agentsInSpace.yaml",
    idAttributeName: "characterID",
    transformations: [addIdToItem],
    index: "agents_in_space",
  },
  {
    path: "fsd/ancestries.yaml",
    idAttributeName: "ancestryID",
    transformations: [addIdToItem],
    index: "ancestries",
  },
  {
    path: "fsd/bloodlines.yaml",
    idAttributeName: "bloodlineID",
    transformations: [addIdToItem],
    index: "bloodlines",
  },
  {
    path: "fsd/blueprints.yaml",
    idAttributeName: "blueprintTypeID",
    transformations: [],
    index: "blueprints",
  },
  {
    path: "fsd/categoryIDs.yaml",
    idAttributeName: "categoryID",
    transformations: [addIdToItem],
    index: "categories",
  },
  {
    path: "fsd/certificates.yaml",
    idAttributeName: "certificateID",
    transformations: [addIdToItem],
    index: "certificates",
  },
  {
    path: "fsd/characterAttributes.yaml",
    idAttributeName: "characterAttributeID",
    transformations: [addIdToItem],
    index: "character_attributes",
  },
  {
    path: "fsd/contrabandTypes.yaml",
    idAttributeName: "typeID",
    transformations: [addIdToItem],
    index: "contraband_types",
  },
  {
    path: "fsd/controlTowerResources.yaml",
    idAttributeName: "typeID",
    transformations: [addIdToItem],
    index: "control_tower_resources",
  },
  {
    path: "fsd/corporationActivities.yaml",
    idAttributeName: "corporationActivityID",
    transformations: [addIdToItem],
    index: "corporation_activities",
  },
  {
    path: "fsd/dogmaAttributeCategories.yaml",
    idAttributeName: "attributeID",
    transformations: [addIdToItem],
    index: "dogma/attribute_categories",
  },
  {
    path: "fsd/dogmaAttributes.yaml",
    idAttributeName: "attributeID",
    transformations: [],
    index: "dogma/attributes",
  },
  {
    path: "fsd/dogmaEffects.yaml",
    idAttributeName: "attributeID",
    transformations: [],
    index: "dogma/effects",
  },
  {
    path: "fsd/factions.yaml",
    idAttributeName: "factionID",
    transformations: [addIdToItem],
    index: "factions",
  },
  {
    path: "fsd/graphicIDs.yaml",
    idAttributeName: "graphicID",
    transformations: [addIdToItem],
    index: "graphics",
  },
  {
    path: "fsd/groupIDs.yaml",
    idAttributeName: "groupID",
    transformations: [addIdToItem],
    index: "groups",
  },
  {
    path: "fsd/iconIDs.yaml",
    idAttributeName: "iconID",
    transformations: [addIdToItem],
    index: "icons",
  },
  {
    path: "fsd/landmarks/landmarks.staticdata",
    idAttributeName: "landmarkID",
    transformations: [addIdToItem],
    outFile: "landmarks.json",
    index: "landmarks",
  },
  {
    path: "fsd/marketGroups.yaml",
    idAttributeName: "marketGroupID",
    transformations: [addIdToItem],
    index: "market_groups",
  },
  {
    path: "fsd/metaGroups.yaml",
    idAttributeName: "metaGroupID",
    transformations: [addIdToItem],
    index: "meta_groups",
  },
  {
    path: "fsd/npcCorporationDivisions.yaml",
    idAttributeName: "npcCorporationDivisionID",
    transformations: [addIdToItem],
    index: "npc_corporation_divisions",
  },
  {
    path: "fsd/npcCorporations.yaml",
    idAttributeName: "corporationID",
    transformations: [addIdToItem],
    index: "npc_corporations",
  },
  {
    path: "fsd/planetSchematics.yaml",
    idAttributeName: "planetSchematicID",
    transformations: [addIdToItem],
    index: "planet_schematics",
  },
  {
    path: "fsd/races.yaml",
    idAttributeName: "raceID",
    transformations: [addIdToItem],
    index: "races",
  },
  {
    path: "fsd/researchAgents.yaml",
    idAttributeName: "characterID",
    transformations: [addIdToItem],
    index: "research_agents",
  },
  {
    path: "fsd/skinLicenses.yaml",
    idAttributeName: "licenseTypeID",
    transformations: [],
    index: "skin_licenses",
  },
  {
    path: "fsd/skinMaterials.yaml",
    idAttributeName: "skinMaterialID",
    transformations: [],
    index: "skin_materials",
  },
  {
    path: "fsd/stationOperations.yaml",
    idAttributeName: "stationOperationID",
    transformations: [addIdToItem],
    index: "station_operations",
  },
  {
    path: "fsd/stationServices.yaml",
    idAttributeName: "stationServiceID",
    transformations: [addIdToItem],
    index: "station_services",
  },
  {
    path: "fsd/tournamentRuleSets.yaml",
    idAttributeName: "ruleSetID",
    transformations: [fromArrayOfObjectsToMap],
    index: "tournament_rule_sets",
  },
  {
    path: "fsd/translationLanguages.yaml",
    idAttributeName: "translationLanguageID",
    transformations: [],
    index: "translation_languages",
  },
  {
    path: "fsd/typeDogma.yaml",
    idAttributeName: "typeID",
    transformations: [addIdToItem],
    index: "type_dogma",
  },
  {
    path: "fsd/typeIDs.yaml",
    idAttributeName: "typeID",
    transformations: [addIdToItem],
    index: "types",
  },
  {
    path: "fsd/typeMaterials.yaml",
    idAttributeName: "typeID",
    transformations: [addIdToItem],
    index: "type_materials",
  },
];

const extraFiles = [
  {
    path: "fsd/typeIDs.yaml",
    transformations: [
      (obj) => {
        const result = {};
        Object.keys(obj).forEach((typeId) => {
          const variationParentTypeID = obj[typeId]["variationParentTypeID"];
          if (variationParentTypeID) {
            result[typeId] = { variationParentTypeID };
            result[variationParentTypeID] = {
              variations: [
                ...(result[variationParentTypeID]?.variations ?? []),
                typeId,
              ],
            };
          }
        });
        return result;
      },
    ],
    idAttributeName: "typeID",
    attribute: "typeID",
    outFile: "typeVariations.json",
    index: "type_variations",
  },
];

/**
 * Step 1: parse the non-universe files (at bsd and fsd root directories)
 */
for (const file of [...inputFiles, ...extraFiles]) {
  const outFilename =
    file.outFile ?? path.basename(file.path.replace(".yaml", ".json"));
  console.time("generating " + outFilename);

  // Read file
  const filePath = path.join(SDE_ROOT, file.path);
  let data = YAML.load(fs.readFileSync(filePath, "utf8"), "utf8");

  console.log("read:", Object.keys(data).slice(0, 10));

  // Apply transformations
  for (const transformation of file.transformations) {
    data = transformation(data, file);
  }

  // Write monolith file
  const outPath = path.join(OUTDIR, outFilename);
  fs.writeFileSync(outPath, JSON.stringify(data));

  // Write index and individual files
  if (file.index) {
    const indexPath = path.join(OUTDIR, file.index);
    // create required directories
    if (!fs.existsSync(indexPath)) {
      fs.mkdirSync(indexPath, { recursive: true });
    }
    // write index file
    fs.writeFileSync(
      path.join(OUTDIR, `${file.index}.json`),
      JSON.stringify(Object.keys(data)),
    );
    // write individual entry files
    Object.entries(data).forEach(([key, value]) => {
      fs.writeFileSync(
        path.join(indexPath, `${key}.json`),
        JSON.stringify(value),
      );
    });
  }

  console.timeEnd("generating " + outFilename);

  process.exit();
}

/**
 * Step 2: parse the universe files and create consolidated metadata files
 */
const universeNames = fs.readdirSync(path.join(SDE_ROOT, "fsd/universe"));

const universe = {
  asteroidBelts: {},
  constellations: {},
  moons: {},
  planets: {},
  regions: {},
  solarSystems: {},
  stargates: {},
  stars: {},
};

for (const universeName of universeNames) {
  console.time("parsing universe: " + universeName);
  const universePath = path.join(SDE_ROOT, "fsd/universe", universeName);
  const regionNames = fs.readdirSync(universePath);
  //console.log(universeName, regionNames)
  for (const regionName of regionNames) {
    //console.log('region', regionName)
    const regionPath = path.join(universePath, regionName);

    let region = YAML.load(
      fs.readFileSync(path.join(regionPath, "region.staticdata"), "utf8"),
      "utf8",
    );
    region.universeID = universeName;
    //console.log(region)
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
        "utf8",
      );
      constellation.regionID = region.regionID;

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
          "utf8",
        );
        solarSystem.constellationID = constellation.constellationID;

        universe.solarSystems[solarSystem.solarSystemID] = solarSystem;

        Object.keys(solarSystem.planets).forEach((planetID) => {
          const planet = solarSystem.planets[planetID];
          planet.solarSystemID = solarSystem.solarSystemID;
          universe.planets[planetID] = planet;

          // moons
          Object.keys(planet.moons ?? {}).forEach((moonID) => {
            const moon = planet.moons[moonID];
            moon.planetID = planetID;
            universe.moons[moonID] = moon;
          });
          planet.moons = Object.keys(planet.moons ?? {});

          // asteroid belts
          Object.keys(planet.asteroidBelts ?? {}).forEach((asteroidBeltID) => {
            universe.asteroidBelts[asteroidBeltID] =
              planet.asteroidBelts[asteroidBeltID];
            universe.asteroidBelts[asteroidBeltID].planetID = planetID;
          });
          planet.asteroidBelts = Object.keys(planet.asteroidBelts ?? {});
        });
        solarSystem.planets = Object.keys(solarSystem.planets);

        Object.keys(solarSystem.stargates ?? {}).forEach((stargateID) => {
          universe.stargates[stargateID] = solarSystem.stargates[stargateID];
          universe.stargates[stargateID].solarSystemID =
            solarSystem.solarSystemID;
        });
        solarSystem.stargates = Object.keys(solarSystem.stargates);

        if (solarSystem.star) {
          universe.stars[solarSystem.star.id] = solarSystem.star;
          solarSystem.star = solarSystem.star.id;
        }
      }
    }
  }
  console.timeEnd("parsing universe: " + universeName);
}

Object.keys(universe).forEach((key) => {
  console.time("writing " + key + ".json");
  fs.writeFileSync(
    path.join(OUTDIR, key + ".json"),
    JSON.stringify(universe[key]),
  );
  console.timeEnd("writing " + key + ".json");
});

/**
 * Step 3: Create an index file
 */
console.time("generating index.json");
const outputFilenames = [
  ...[...inputFiles, ...extraFiles].map(
    (file) =>
      file.outFile ?? path.basename(file.path.replace(".yaml", ".json")),
  ),
  ...Object.keys(universe).map((key) => key + ".json"),
];
outputFilenames.sort();

const index = {
  files: outputFilenames
    .map((name) => ({
      name,
      size: fs.statSync(path.join(OUTDIR, name)).size,
      mtime: fs.statSync(path.join(OUTDIR, name)).mtime,
      url: BASE_URL + name,
    }))
    .reduce((obj, entry) => Object.assign(obj, { [entry.name]: entry }), {}),
  sdeTimestamp: fs.statSync(path.join(SDE_ROOT, inputFiles[0].path)).mtime,
  timestamp: new Date(),
};

fs.writeFileSync(
  path.join(OUTDIR, "index.json"),
  JSON.stringify(index, null, 2),
);
console.timeEnd("generating index.json");
