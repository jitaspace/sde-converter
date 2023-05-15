/**
 * Information about the collections to be made available in the OpenAPI spec.
 * A collection is a pair of endpoints:
 * - GET /collection — returns a list of all the IDs available in the collection
 * - GET /collection/{id} — returns a single item from the collection
 * Pagination is not supported, as the collections are expected to be small and static.
 */
import { sdeInputFiles } from "../sources/sde";
import { SdeUniverseSource } from "../sources/sde_universe";

export type SdeCollection = {
  datasource:
    | {
        type: "sde";
        name: keyof typeof sdeInputFiles;
      }
    | {
        type: "sde-universe";
        name: SdeUniverseSource;
      }
    | {
        type: "hoboleaks";
        filename: string;
      }
    | {
        type: "custom";
        generator: () => Promise<Record<string, any>>;
      };
  idAttribute: string;
  model: {
    name: string;
    description?: string;
  };
  tags: string[];
};

export const collections: Record<string, SdeCollection> = {
  "/inventory/flags": {
    datasource: {
      type: "sde",
      name: "bsd/invFlags.yaml",
    },
    idAttribute: "flagID",
    model: {
      name: "InventoryCategory",
    },
    tags: ["Inventory"],
  },
  "/inventory/items": {
    datasource: {
      type: "sde",
      name: "bsd/invItems.yaml",
    },
    idAttribute: "itemID",
    model: {
      name: "InventoryItem",
    },
    tags: ["Inventory"],
  },
  "/inventory/names": {
    datasource: {
      type: "sde",
      name: "bsd/invNames.yaml",
    },
    idAttribute: "itemID",
    model: {
      name: "InventoryName",
    },
    tags: ["Inventory"],
  },
  "/inventory/positions": {
    datasource: {
      type: "sde",
      name: "bsd/invPositions.yaml",
    },
    idAttribute: "itemID",
    model: {
      name: "InventoryPosition",
    },
    tags: ["Inventory"],
  },
  "/inventory/unique_names": {
    datasource: {
      type: "sde",
      name: "bsd/invUniqueNames.yaml",
    },
    idAttribute: "itemID",
    model: {
      name: "InventoryUniqueName",
    },
    tags: ["Inventory"],
  },
  "/universe/stations": {
    datasource: {
      type: "sde",
      name: "bsd/staStations.yaml",
    },
    idAttribute: "stationID",
    model: {
      name: "Station",
    },
    tags: ["Universe"],
  },
  "/characters/agents": {
    datasource: {
      type: "sde",
      name: "fsd/agents.yaml",
    },
    idAttribute: "characterID",
    model: {
      name: "Agent",
    },
    tags: ["Character"],
  },
  "/characters/agents_in_space": {
    datasource: {
      type: "sde",
      name: "fsd/agentsInSpace.yaml",
    },
    idAttribute: "characterID",
    model: {
      name: "AgentInSpace",
    },
    tags: ["Character"],
  },
  "/universe/ancestries": {
    datasource: {
      type: "sde",
      name: "fsd/ancestries.yaml",
    },
    idAttribute: "ancestryID",
    model: {
      name: "Ancestry",
    },
    tags: ["Universe"],
  },
  "/universe/bloodlines": {
    datasource: {
      type: "sde",
      name: "fsd/bloodlines.yaml",
    },
    idAttribute: "bloodlineID",
    model: {
      name: "Bloodline",
    },
    tags: ["Universe"],
  },
  "/universe/blueprints": {
    datasource: {
      type: "sde",
      name: "fsd/blueprints.yaml",
    },
    idAttribute: "blueprintTypeID",
    model: {
      name: "Blueprint",
    },
    tags: ["Universe"],
  },
  "/universe/categories": {
    datasource: {
      type: "sde",
      name: "fsd/categoryIDs.yaml",
    },
    idAttribute: "categoryID",
    model: {
      name: "Category",
    },
    tags: ["Universe"],
  },
  "/universe/certificates": {
    datasource: {
      type: "sde",
      name: "fsd/certificates.yaml",
    },
    idAttribute: "certificateID",
    model: {
      name: "Certificate",
    },
    tags: ["Universe"],
  },
  "/characters/attributes": {
    datasource: {
      type: "sde",
      name: "fsd/characterAttributes.yaml",
    },
    idAttribute: "attributeID",
    model: {
      name: "CharacterAttribute",
    },
    tags: ["Character"],
  },
  "/universe/contraband_types": {
    datasource: {
      type: "sde",
      name: "fsd/contrabandTypes.yaml",
    },
    idAttribute: "typeID",
    model: {
      name: "ContrabandType",
    },
    tags: ["Universe"],
  },
  "/universe/control_tower_resources": {
    datasource: {
      type: "sde",
      name: "fsd/controlTowerResources.yaml",
    },
    idAttribute: "typeID",
    model: {
      name: "ControlTowerResource",
    },
    tags: ["Universe"],
  },
  "/corporations/activities": {
    datasource: {
      type: "sde",
      name: "fsd/corporationActivities.yaml",
    },
    idAttribute: "corporationActivityID",
    model: {
      name: "CorporationActivity",
    },
    tags: ["Corporation"],
  },
  "/dogma/attribute_categories": {
    datasource: {
      type: "sde",
      name: "fsd/dogmaAttributeCategories.yaml",
    },
    idAttribute: "attributeID",
    model: {
      name: "DogmaAttributeCategory",
    },
    tags: ["Dogma"],
  },
  "/dogma/attributes": {
    datasource: {
      type: "sde",
      name: "fsd/dogmaAttributes.yaml",
    },
    idAttribute: "attributeID",
    model: {
      name: "DogmaAttribute",
    },
    tags: ["Dogma"],
  },
  "/dogma/effects": {
    datasource: {
      type: "sde",
      name: "fsd/dogmaEffects.yaml",
    },
    idAttribute: "effectID",
    model: {
      name: "DogmaEffect",
    },
    tags: ["Dogma"],
  },
  "/universe/factions": {
    datasource: {
      type: "sde",
      name: "fsd/factions.yaml",
    },
    idAttribute: "factionID",
    model: {
      name: "Faction",
    },
    tags: ["Universe"],
  },
  "/universe/graphics": {
    datasource: {
      type: "sde",
      name: "fsd/graphicIDs.yaml",
    },
    idAttribute: "graphicID",
    model: {
      name: "Graphic",
    },
    tags: ["Universe"],
  },
  "/universe/groups": {
    datasource: {
      type: "sde",
      name: "fsd/groupIDs.yaml",
    },
    idAttribute: "groupID",
    model: {
      name: "Group",
    },
    tags: ["Universe"],
  },
  "/universe/icons": {
    datasource: {
      type: "sde",
      name: "fsd/iconIDs.yaml",
    },
    idAttribute: "iconID",
    model: {
      name: "Icon",
    },
    tags: ["Universe"],
  },
  "/universe/landmarks": {
    datasource: {
      type: "sde",
      name: "fsd/landmarks/landmarks.staticdata",
    },
    idAttribute: "landmarkID",
    model: {
      name: "Landmark",
    },
    tags: ["Universe"],
  },
  "/markets/groups": {
    datasource: {
      type: "sde",
      name: "fsd/marketGroups.yaml",
    },
    idAttribute: "marketGroupID",
    model: {
      name: "MarketGroup",
    },
    tags: ["Market"],
  },
  "/universe/meta_groups": {
    datasource: {
      type: "sde",
      name: "fsd/metaGroups.yaml",
    },
    idAttribute: "metaGroupID",
    model: {
      name: "MetaGroup",
    },
    tags: ["Universe"],
  },
  "/corporations/npc_corporation_divisions": {
    datasource: {
      type: "sde",
      name: "fsd/npcCorporationDivisions.yaml",
    },
    idAttribute: "npcCorporationDivisionID",
    model: {
      name: "NPCCorporationDivision",
    },
    tags: ["Corporation"],
  },
  "/corporations/npc_corporations": {
    datasource: {
      type: "sde",
      name: "fsd/npcCorporations.yaml",
    },
    idAttribute: "corporationID",
    model: {
      name: "NPCCorporation",
    },
    tags: ["Corporation"],
  },
  "/universe/planet_schematics": {
    datasource: {
      type: "sde",
      name: "fsd/planetSchematics.yaml",
    },
    idAttribute: "planetSchematicID",
    model: {
      name: "PlanetSchematic",
    },
    tags: ["Planetary_Interaction"],
  },
  "/universe/races": {
    datasource: {
      type: "sde",
      name: "fsd/races.yaml",
    },
    idAttribute: "raceID",
    model: {
      name: "Race",
    },
    tags: ["Universe"],
  },
  "/characters/research_agents": {
    datasource: {
      type: "sde",
      name: "fsd/researchAgents.yaml",
    },
    idAttribute: "characterID",
    model: {
      name: "ResearchAgent",
    },
    tags: ["Character"],
  },
  "/universe/skin_licenses": {
    datasource: {
      type: "sde",
      name: "fsd/skinLicenses.yaml",
    },
    idAttribute: "licenseTypeID",
    model: {
      name: "SkinLicense",
    },
    tags: ["Universe"],
  },
  "/universe/skin_materials": {
    datasource: {
      type: "sde",
      name: "fsd/skinMaterials.yaml",
    },
    idAttribute: "skinMaterialID",
    model: {
      name: "SkinMaterial",
    },
    tags: ["Universe"],
  },
  "/universe/station_operations": {
    datasource: {
      type: "sde",
      name: "fsd/stationOperations.yaml",
    },
    idAttribute: "stationOperationID",
    model: {
      name: "StationOperation",
    },
    tags: ["Universe"],
  },
  "/universe/station_services": {
    datasource: {
      type: "sde",
      name: "fsd/stationServices.yaml",
    },
    idAttribute: "stationServiceID",
    model: {
      name: "StationService",
    },
    tags: ["Universe"],
  },
  "/universe/tournament_rule_sets": {
    datasource: {
      type: "sde",
      name: "fsd/tournamentRuleSets.yaml",
    },
    idAttribute: "ruleSetID",
    model: {
      name: "TournamentRuleSet",
    },
    tags: ["Universe"],
  },
  "/universe/translation_languages": {
    datasource: {
      type: "sde",
      name: "fsd/translationLanguages.yaml",
    },
    idAttribute: "translationLanguageID",
    model: {
      name: "TranslationLanguage",
    },
    tags: ["Universe"],
  },
  "/dogma/types": {
    datasource: {
      type: "sde",
      name: "fsd/typeDogma.yaml",
    },
    idAttribute: "typeID",
    model: {
      name: "TypeDogma",
    },
    tags: ["Dogma"],
  },
  "/universe/types": {
    datasource: {
      type: "sde",
      name: "fsd/typeIDs.yaml",
    },
    idAttribute: "typeID",
    model: {
      name: "Type",
    },
    tags: ["Universe"],
  },
  "/universe/type_materials": {
    datasource: {
      type: "sde",
      name: "fsd/typeMaterials.yaml",
    },
    idAttribute: "typeID",
    model: {
      name: "TypeMaterial",
    },
    tags: ["Universe"],
  },
  "/universe/asteroid_belts": {
    datasource: {
      type: "sde-universe",
      name: "asteroidBelts",
    },
    idAttribute: "asteroidBeltID",
    model: {
      name: "AsteroidBelt",
    },
    tags: ["Universe"],
  },
  "/universe/constellations": {
    datasource: {
      type: "sde-universe",
      name: "constellations",
    },
    idAttribute: "constellationID",
    model: {
      name: "Constellation",
    },
    tags: ["Universe"],
  },
  "/universe/moons": {
    datasource: {
      type: "sde-universe",
      name: "moons",
    },
    idAttribute: "moonID",
    model: {
      name: "Moon",
    },
    tags: ["Universe"],
  },
  "/universe/planets": {
    datasource: {
      type: "sde-universe",
      name: "planets",
    },
    idAttribute: "planetID",
    model: {
      name: "Planet",
    },
    tags: ["Universe"],
  },
  "/universe/regions": {
    datasource: {
      type: "sde-universe",
      name: "regions",
    },
    idAttribute: "regionID",
    model: {
      name: "Region",
    },
    tags: ["Universe"],
  },
  "/universe/solar_systems": {
    datasource: {
      type: "sde-universe",
      name: "solarSystems",
    },
    idAttribute: "solarSystemID",
    model: {
      name: "SolarSystem",
    },
    tags: ["Universe"],
  },
  "/universe/stargates": {
    datasource: {
      type: "sde-universe",
      name: "stargates",
    },
    idAttribute: "stargateID",
    model: {
      name: "Stargate",
    },
    tags: ["Universe"],
  },
  "/universe/stars": {
    datasource: {
      type: "sde-universe",
      name: "stars",
    },
    idAttribute: "starID",
    model: {
      name: "Star",
    },
    tags: ["Universe"],
  },
  "/characters/agent_types": {
    datasource: {
      type: "hoboleaks",
      filename: "agenttypes.json",
    },
    idAttribute: "agentTypeID",
    model: {
      name: "AgentType",
    },
    tags: ["Character"],
  },
  "/dogma/units": {
    datasource: {
      type: "hoboleaks",
      filename: "dogmaunits.json",
    },
    idAttribute: "unitID",
    model: {
      name: "DogmaUnit",
    },
    tags: ["Dogma"],
  },
  "/wallet/accounting_entry_types": {
    datasource: {
      type: "hoboleaks",
      filename: "accountingentrytypes.json",
    },
    idAttribute: "accountEntryTypeID",
    model: {
      name: "AccountingEntryType",
    },
    tags: ["Wallet"],
  },
  "/universe/repackaged_volumes": {
    datasource: {
      type: "hoboleaks",
      filename: "repackagedvolumes.json",
    },
    idAttribute: "typeID",
    model: {
      name: "RepackagedVolume",
    },
    tags: ["Universe"],
  },
  "/dogma/dynamic_attributes": {
    datasource: {
      type: "hoboleaks",
      filename: "dynamicitemattributes.json",
    },
    idAttribute: "attributeID",
    model: {
      name: "DynamicAttribute",
    },
    tags: ["Dogma"],
  },
  "/dogma/dbuffs": {
    datasource: {
      type: "hoboleaks",
      filename: "dbuffs.json",
    },
    idAttribute: "dbuffID",
    model: {
      name: "DBuff",
    },
    tags: ["Dogma"],
  },
  "/universe/clone_states": {
    datasource: {
      type: "hoboleaks",
      filename: "clonestates.json",
    },
    idAttribute: "raceID",
    model: {
      name: "CloneState",
    },
    tags: ["Universe"],
  },
  "/universe/skins": {
    datasource: {
      type: "hoboleaks",
      filename: "skins.json",
    },
    idAttribute: "skinID",
    model: {
      name: "Skin",
    },
    tags: ["Universe"],
  },
  "/universe/skin_material_names": {
    datasource: {
      type: "hoboleaks",
      filename: "skinmaterialnames.json",
    },
    idAttribute: "skinMaterialID",
    model: {
      name: "SkinMaterialName",
    },
    tags: ["Universe"],
  },
  "/universe/graphic_material_sets": {
    datasource: {
      type: "hoboleaks",
      filename: "graphicmaterialsets.json",
    },
    idAttribute: "graphicMaterialSetID",
    model: {
      name: "GraphicMaterialSet",
    },
    tags: ["Universe"],
  },
  "/industry/activities": {
    datasource: {
      type: "hoboleaks",
      filename: "industryactivities.json",
    },
    idAttribute: "activityID",
    model: {
      name: "IndustryActivity",
    },
    tags: ["Industry"],
  },
  "/industry/assembly_lines": {
    datasource: {
      type: "hoboleaks",
      filename: "industryassemblylines.json",
    },
    idAttribute: "assemblyLineTypeID",
    model: {
      name: "IndustryAssemblyLine",
    },
    tags: ["Industry"],
  },
  "/industry/installation_types": {
    datasource: {
      type: "hoboleaks",
      filename: "industryinstallationtypes.json",
    },
    idAttribute: "typeID",
    model: {
      name: "IndustryInstallationType",
    },
    tags: ["Industry"],
  },
  "/industry/modifier_sources": {
    datasource: {
      type: "hoboleaks",
      filename: "industrymodifiersources.json",
    },
    idAttribute: "typeID",
    model: {
      name: "IndustryModifierSource",
    },
    tags: ["Industry"],
  },
  "/industry/target_filters": {
    datasource: {
      type: "hoboleaks",
      filename: "industrytargetfilters.json",
    },
    idAttribute: "targetTypeFilterID",
    model: {
      name: "IndustryTargetFilter",
    },
    tags: ["Industry"],
  },
  "/universe/compressible_types": {
    datasource: {
      type: "hoboleaks",
      filename: "compressibletypes.json",
    },
    idAttribute: "typeID",
    model: {
      name: "CompressibleType",
    },
    tags: ["Universe"],
  },
};
