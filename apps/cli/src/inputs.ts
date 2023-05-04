import fs from "fs";
import path from "path";
import * as YAML from "js-yaml";

export type SdeInputFile = {
  // The relative path to the file, from the SDE root
  path: string;
  // The name of the attribute that will be used as the ID
  idAttributeName: string;
  // The type of the ID attribute
  idAttributeType: "string" | "number";
  // List of transformations to apply to the data upon loading it
  transformations: ((data: any, file: SdeInputFile) => any)[];
  // The index to write the data to
  outputPath: string;
  // The name of the model in the API spec
  modelName: string;
  // The pretty name of the model in the API spec
  prettyModelName: string;
  // The description of the model in the API spec
  modelDescription: string;
  // the name of the id attribute in the path parameter in the API spec
  pathParameterName: string;
  // the set of tags to add to the models and paths in the API spec
  schemaTags: string[];
};

export const sdeInputFiles: Record<string, SdeInputFile> = {
  "bsd/invFlags.yaml": {
    path: "bsd/invFlags.yaml",
    idAttributeName: "flagID",
    idAttributeType: "number",
    transformations: [fromArrayOfObjectsToMap],
    outputPath: "inventory/flags",
    modelName: "InventoryFlag",
    prettyModelName: "Inventory Flag",
    modelDescription: "An inventory flag",
    pathParameterName: "flag_id",
    schemaTags: ["Inventory"],
  },
  "bsd/invItems.yaml": {
    path: "bsd/invItems.yaml",
    idAttributeName: "itemID",
    idAttributeType: "number",
    transformations: [fromArrayOfObjectsToMap],
    outputPath: "inventory/items",
    modelName: "InventoryItem",
    prettyModelName: "Inventory Item",
    modelDescription: "An inventory item",
    pathParameterName: "item_id",
    schemaTags: ["Inventory"],
  },
  "bsd/invNames.yaml": {
    path: "bsd/invNames.yaml",
    idAttributeName: "itemID",
    idAttributeType: "number",
    transformations: [fromArrayOfObjectsToMap],
    outputPath: "inventory/names",
    modelName: "InventoryName",
    prettyModelName: "Inventory Name",
    modelDescription: "An inventory name",
    pathParameterName: "item_id",
    schemaTags: ["Inventory"],
  },
  "bsd/invPositions.yaml": {
    path: "bsd/invPositions.yaml",
    idAttributeName: "itemID",
    idAttributeType: "number",
    transformations: [fromArrayOfObjectsToMap],
    outputPath: "inventory/positions",
    modelName: "InventoryPosition",
    prettyModelName: "Inventory Position",
    modelDescription: "An inventory position",
    pathParameterName: "item_id",
    schemaTags: ["Inventory"],
  },
  "bsd/invUniqueNames.yaml": {
    path: "bsd/invUniqueNames.yaml",
    idAttributeName: "itemID",
    idAttributeType: "number",
    transformations: [fromArrayOfObjectsToMap],
    outputPath: "inventory/unique_names",
    modelName: "InventoryUniqueName",
    prettyModelName: "Inventory Unique Name",
    modelDescription: "An inventory unique name",
    pathParameterName: "item_id",
    schemaTags: ["Inventory"],
  },
  "bsd/staStations.yaml": {
    path: "bsd/staStations.yaml",
    idAttributeName: "stationID",
    idAttributeType: "number",
    transformations: [fromArrayOfObjectsToMap],
    outputPath: "stations",
    modelName: "Station",
    prettyModelName: "Station",
    modelDescription: "Information about a station",
    pathParameterName: "station_id",
    schemaTags: ["Universe"],
  },
  "fsd/agents.yaml": {
    path: "fsd/agents.yaml",
    idAttributeName: "characterID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "agents",
    modelName: "Agent",
    prettyModelName: "Agent",
    modelDescription: "Information about an agent",
    pathParameterName: "character_id",
    schemaTags: ["Character"],
  },
  "fsd/agentsInSpace.yaml": {
    path: "fsd/agentsInSpace.yaml",
    idAttributeName: "characterID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "agents_in_space",
    modelName: "AgentInSpace",
    prettyModelName: "Agent In Space",
    modelDescription: "Information about an agent in space",
    pathParameterName: "character_id",
    schemaTags: ["Character"],
  },
  "fsd/ancestries.yaml": {
    path: "fsd/ancestries.yaml",
    idAttributeName: "ancestryID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "ancestries",
    modelName: "Ancestry",
    prettyModelName: "Ancestry",
    modelDescription: "Information about an ancestry",
    pathParameterName: "ancestry_id",
    schemaTags: ["Universe"],
  },
  "fsd/bloodlines.yaml": {
    path: "fsd/bloodlines.yaml",
    idAttributeName: "bloodlineID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "bloodlines",
    modelName: "Bloodline",
    prettyModelName: "Bloodline",
    modelDescription: "Information about a bloodline",
    pathParameterName: "bloodline_id",
    schemaTags: ["Universe"],
  },
  "fsd/blueprints.yaml": {
    path: "fsd/blueprints.yaml",
    idAttributeName: "blueprintTypeID",
    idAttributeType: "number",
    transformations: [],
    outputPath: "blueprints",
    modelName: "Blueprint",
    prettyModelName: "Blueprint",
    modelDescription: "Information about a blueprint",
    pathParameterName: "type_id",
    schemaTags: ["Universe"],
  },
  "fsd/categoryIDs.yaml": {
    path: "fsd/categoryIDs.yaml",
    idAttributeName: "categoryID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "categories",
    modelName: "Category",
    prettyModelName: "Category",
    modelDescription: "Information about a category",
    pathParameterName: "category_id",
    schemaTags: ["Universe"],
  },
  "fsd/certificates.yaml": {
    path: "fsd/certificates.yaml",
    idAttributeName: "certificateID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "certificates",
    modelName: "Certificate",
    prettyModelName: "Certificate",
    modelDescription: "Information about a certificate",
    pathParameterName: "certificate_id",
    schemaTags: ["Universe"],
  },
  "fsd/characterAttributes.yaml": {
    path: "fsd/characterAttributes.yaml",
    idAttributeName: "attributeID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "character_attributes",
    modelName: "CharacterAttribute",
    prettyModelName: "Character Attribute",
    modelDescription: "Information about a character attribute",
    pathParameterName: "character_attribute_id",
    schemaTags: ["Character"],
  },
  "fsd/contrabandTypes.yaml": {
    path: "fsd/contrabandTypes.yaml",
    idAttributeName: "typeID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "contraband_types",
    modelName: "ContrabandType",
    prettyModelName: "Contraband Type",
    modelDescription: "Information about a contraband type",
    pathParameterName: "type_id",
    schemaTags: ["Universe"],
  },
  "fsd/controlTowerResources.yaml": {
    path: "fsd/controlTowerResources.yaml",
    idAttributeName: "typeID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "control_tower_resources",
    modelName: "ControlTowerResource",
    prettyModelName: "Control Tower Resource",
    modelDescription: "Information about a control tower resource",
    pathParameterName: "type_id",
    schemaTags: ["Universe"],
  },
  "fsd/corporationActivities.yaml": {
    path: "fsd/corporationActivities.yaml",
    idAttributeName: "corporationActivityID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "corporation_activities",
    modelName: "CorporationActivity",
    prettyModelName: "Corporation Activity",
    modelDescription: "Information about a corporation activity",
    pathParameterName: "corporation_activity_id",
    schemaTags: ["Corporation"],
  },
  "fsd/dogmaAttributeCategories.yaml": {
    path: "fsd/dogmaAttributeCategories.yaml",
    idAttributeName: "attributeID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "dogma/attribute_categories",
    modelName: "DogmaAttributeCategory",
    prettyModelName: "Dogma Attribute Category",
    modelDescription: "Information about a dogma attribute category",
    pathParameterName: "attribute_id",
    schemaTags: ["Dogma"],
  },
  "fsd/dogmaAttributes.yaml": {
    path: "fsd/dogmaAttributes.yaml",
    idAttributeName: "attributeID",
    idAttributeType: "number",
    transformations: [],
    outputPath: "dogma/attributes",
    modelName: "DogmaAttribute",
    prettyModelName: "Dogma Attribute",
    modelDescription: "Information about a dogma attribute",
    pathParameterName: "attribute_id",
    schemaTags: ["Dogma"],
  },
  "fsd/dogmaEffects.yaml": {
    path: "fsd/dogmaEffects.yaml",
    idAttributeName: "effectID",
    idAttributeType: "number",
    transformations: [],
    outputPath: "dogma/effects",
    modelName: "DogmaEffect",
    prettyModelName: "Dogma Effect",
    modelDescription: "Information about a dogma effect",
    pathParameterName: "effect_id",
    schemaTags: ["Dogma"],
  },
  "fsd/factions.yaml": {
    path: "fsd/factions.yaml",
    idAttributeName: "factionID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "factions",
    modelName: "Faction",
    prettyModelName: "Faction",
    modelDescription: "Information about a faction",
    pathParameterName: "faction_id",
    schemaTags: ["Universe"],
  },
  "fsd/graphicIDs.yaml": {
    path: "fsd/graphicIDs.yaml",
    idAttributeName: "graphicID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "graphics",
    modelName: "Graphic",
    prettyModelName: "Graphic",
    modelDescription: "Information about a graphic",
    pathParameterName: "graphic_id",
    schemaTags: ["Universe"],
  },
  "fsd/groupIDs.yaml": {
    path: "fsd/groupIDs.yaml",
    idAttributeName: "groupID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "groups",
    modelName: "Group",
    prettyModelName: "Group",
    modelDescription: "Information about a group",
    pathParameterName: "group_id",
    schemaTags: ["Universe"],
  },
  "fsd/iconIDs.yaml": {
    path: "fsd/iconIDs.yaml",
    idAttributeName: "iconID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "icons",
    modelName: "Icon",
    prettyModelName: "Icon",
    modelDescription: "Information about an icon",
    pathParameterName: "icon_id",
    schemaTags: ["Universe"],
  },
  "fsd/landmarks/landmarks.staticdata": {
    path: "fsd/landmarks/landmarks.staticdata",
    idAttributeName: "landmarkID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "landmarks",
    modelName: "Landmark",
    prettyModelName: "Landmark",
    modelDescription: "Information about a landmark",
    pathParameterName: "landmark_id",
    schemaTags: ["Universe"],
  },
  "fsd/marketGroups.yaml": {
    path: "fsd/marketGroups.yaml",
    idAttributeName: "marketGroupID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "market_groups",
    modelName: "MarketGroup",
    prettyModelName: "Market Group",
    modelDescription: "Information about a market group",
    pathParameterName: "market_group_id",
    schemaTags: ["Market"],
  },
  "fsd/metaGroups.yaml": {
    path: "fsd/metaGroups.yaml",
    idAttributeName: "metaGroupID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "meta_groups",
    modelName: "MetaGroup",
    prettyModelName: "Meta Group",
    modelDescription: "Information about a meta group",
    pathParameterName: "meta_group_id",
    schemaTags: ["Universe"],
  },
  "fsd/npcCorporationDivisions.yaml": {
    path: "fsd/npcCorporationDivisions.yaml",
    idAttributeName: "npcCorporationDivisionID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "npc_corporation_divisions",
    modelName: "NPCCorporationDivision",
    prettyModelName: "NPC Corporation Division",
    modelDescription: "Information about an NPC corporation division",
    pathParameterName: "npc_corporation_division_id",
    schemaTags: ["Corporation"],
  },
  "fsd/npcCorporations.yaml": {
    path: "fsd/npcCorporations.yaml",
    idAttributeName: "corporationID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "npc_corporations",
    modelName: "NPCCorporation",
    prettyModelName: "NPC Corporation",
    modelDescription: "Information about an NPC corporation",
    pathParameterName: "corporation_id",
    schemaTags: ["Corporation"],
  },
  "fsd/planetSchematics.yaml": {
    path: "fsd/planetSchematics.yaml",
    idAttributeName: "planetSchematicID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "planet_schematics",
    modelName: "PlanetSchematic",
    prettyModelName: "Planet Schematic",
    modelDescription: "Information about a planet schematic",
    pathParameterName: "planet_schematic_id",
    schemaTags: ["Planetary Interaction"],
  },
  "fsd/races.yaml": {
    path: "fsd/races.yaml",
    idAttributeName: "raceID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "races",
    modelName: "Race",
    prettyModelName: "Race",
    modelDescription: "Information about a race",
    pathParameterName: "race_id",
    schemaTags: ["Universe"],
  },
  "fsd/researchAgents.yaml": {
    path: "fsd/researchAgents.yaml",
    idAttributeName: "characterID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "research_agents",
    modelName: "ResearchAgent",
    prettyModelName: "Research Agent",
    modelDescription: "Information about a research agent",
    pathParameterName: "character_id",
    schemaTags: ["Character"],
  },
  "fsd/skinLicenses.yaml": {
    path: "fsd/skinLicenses.yaml",
    idAttributeName: "licenseTypeID",
    idAttributeType: "number",
    transformations: [],
    outputPath: "skin_licenses",
    modelName: "SkinLicense",
    prettyModelName: "Skin License",
    modelDescription: "Information about a skin license",
    pathParameterName: "type_id",
    schemaTags: ["Universe"],
  },
  "fsd/skinMaterials.yaml": {
    path: "fsd/skinMaterials.yaml",
    idAttributeName: "skinMaterialID",
    idAttributeType: "number",
    transformations: [],
    outputPath: "skin_materials",
    modelName: "SkinMaterial",
    prettyModelName: "Skin Material",
    modelDescription: "Information about a skin material",
    pathParameterName: "skin_material_id",
    schemaTags: ["Universe"],
  },
  "fsd/stationOperations.yaml": {
    path: "fsd/stationOperations.yaml",
    idAttributeName: "stationOperationID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "station_operations",
    modelName: "StationOperation",
    prettyModelName: "Station Operation",
    modelDescription: "Information about a station operation",
    pathParameterName: "station_operation_id",
    schemaTags: ["Universe"],
  },
  "fsd/stationServices.yaml": {
    path: "fsd/stationServices.yaml",
    idAttributeName: "stationServiceID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "station_services",
    modelName: "StationService",
    prettyModelName: "Station Service",
    modelDescription: "Information about a station service",
    pathParameterName: "station_service_id",
    schemaTags: ["Universe"],
  },
  "fsd/tournamentRuleSets.yaml": {
    path: "fsd/tournamentRuleSets.yaml",
    idAttributeName: "ruleSetID",
    idAttributeType: "string",
    transformations: [fromArrayOfObjectsToMap],
    outputPath: "tournament_rule_sets",
    modelName: "TournamentRuleSet",
    prettyModelName: "Tournament Rule Set",
    modelDescription: "Information about a tournament rule set",
    pathParameterName: "rule_set_id",
    schemaTags: ["Universe"],
  },
  "fsd/translationLanguages.yaml": {
    path: "fsd/translationLanguages.yaml",
    idAttributeName: "translationLanguageID",
    idAttributeType: "string",
    transformations: [],
    outputPath: "translation_languages",
    modelName: "TranslationLanguage",
    prettyModelName: "Translation Language",
    modelDescription: "Information about a translation language",
    pathParameterName: "language_id",
    schemaTags: ["Universe"],
  },
  "fsd/typeDogma.yaml": {
    path: "fsd/typeDogma.yaml",
    idAttributeName: "typeID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "type_dogma",
    modelName: "TypeDogma",
    prettyModelName: "Type Dogma",
    modelDescription: "Information about a type dogma",
    pathParameterName: "type_id",
    schemaTags: ["Universe"],
  },
  "fsd/typeIDs.yaml": {
    path: "fsd/typeIDs.yaml",
    idAttributeName: "typeID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "types",
    modelName: "Type",
    prettyModelName: "Type",
    modelDescription: "Information about a type",
    pathParameterName: "type_id",
    schemaTags: ["Universe"],
  },
  "fsd/typeMaterials.yaml": {
    path: "fsd/typeMaterials.yaml",
    idAttributeName: "typeID",
    idAttributeType: "number",
    transformations: [addIdToItem],
    outputPath: "type_materials",
    modelName: "TypeMaterial",
    prettyModelName: "Type Material",
    modelDescription: "Information about a type material",
    pathParameterName: "type_id",
    schemaTags: ["Universe"],
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

export function loadFile(
  filename: keyof typeof sdeInputFiles,
  sdeRoot: string,
): Record<string, any> {
  const file = sdeInputFiles[filename];

  if (!file) {
    throw new Error(`File ${filename} not found in sdeInputFiles`);
  }

  // Read file
  const filePath = path.join(sdeRoot, file.path);
  let data: any = YAML.load(fs.readFileSync(filePath, "utf8"));

  // Apply transformations
  for (const transformation of file.transformations) {
    data = transformation(data, file);
  }

  return data;
}
