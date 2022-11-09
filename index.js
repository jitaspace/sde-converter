const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml')

// Filesystem path to the EVE SDE files
const SDE_ROOT = "/Users/joaomlneto/Downloads/sde"

// Converts an array of objects in the format [obj1, obj2, obj3] to {[obj1.id]: obj1, [obj2.id]: obj2, [obj3.id]: obj3}
const fromArrayOfObjectsToMap = (array, {path, idAttributeName}) => {
    const map = {}
    array.forEach((item) => {
        if(map.hasOwnProperty(item[idAttributeName])) {
            console.log(`⚠️ Duplicate ID ${item[idAttributeName]} found in ${path}`)
            throw new Error(`⚠️ Duplicate ID ${item[idAttributeName]} found in ${path}`)
        }
        return map[item[idAttributeName]] = item
    })
    return map
}

// given a map of {key: obj, ...} returns the same map but with the key as an attribute of the object
const addIdToItem = (array, {idAttributeName}) => {
    Object.keys(array).forEach(id => array[id][idAttributeName] = id)
    return array
}

const files = [
    {
        path: "bsd/invFlags.yaml",
        idAttributeName: "flagID",
        transformations: [fromArrayOfObjectsToMap]
    },
    {
        path: "bsd/invItems.yaml",
        idAttributeName: "itemID",
        transformations: [fromArrayOfObjectsToMap]
    },
    {
        path: "bsd/invNames.yaml",
        idAttributeName: "itemID",
        transformations: [fromArrayOfObjectsToMap]
    },
    {
        path: "bsd/invPositions.yaml",
        idAttributeName: "itemID",
        transformations: [fromArrayOfObjectsToMap]
    },
    {
        path: "bsd/invUniqueNames.yaml",
        idAttributeName: "itemID",
        transformations: [fromArrayOfObjectsToMap]
    },
    {
        path: "bsd/staStations.yaml",
        idAttributeName: "stationID",
        transformations: [fromArrayOfObjectsToMap]
    },
    {
        path: "fsd/agents.yaml",
        idAttributeName: "characterID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/agentsInSpace.yaml",
        idAttributeName: "characterID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/ancestries.yaml",
        idAttributeName: "ancestryID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/bloodlines.yaml",
        idAttributeName: "bloodlineID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/blueprints.yaml",
        idAttributeName: "blueprintTypeID",
        transformations: []
    },
    {
        path: "fsd/categoryIDs.yaml",
        idAttributeName: "categoryID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/certificates.yaml",
        idAttributeName: "certificateID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/characterAttributes.yaml",
        idAttributeName: "characterAttributeID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/contrabandTypes.yaml",
        idAttributeName: "typeID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/controlTowerResources.yaml",
        idAttributeName: "typeID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/corporationActivities.yaml",
        idAttributeName: "corporationActivityID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/dogmaAttributeCategories.yaml",
        idAttributeName: "attributeID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/dogmaAttributes.yaml",
        idAttributeName: "attributeID",
        transformations: []
    },
    {
        path: "fsd/dogmaEffects.yaml",
        idAttributeName: "attributeID",
        transformations: []
    },
    {
        path: "fsd/factions.yaml",
        idAttributeName: "factionID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/graphicIDs.yaml",
        idAttributeName: "graphicID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/groupIDs.yaml",
        idAttributeName: "groupID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/iconIDs.yaml",
        idAttributeName: "iconID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/landmarks/landmarks.staticdata",
        idAttributeName: "landmarkID",
        transformations: [addIdToItem],
        outFile: "fsd/landmarks/landmarks.json"
    },
    {
        path: "fsd/marketGroups.yaml",
        idAttributeName: "marketGroupID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/metaGroups.yaml",
        idAttributeName: "metaGroupID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/npcCorporationDivisions.yaml",
        idAttributeName: "npcCorporationDivisionID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/npcCorporations.yaml",
        idAttributeName: "corporationID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/planetSchematics.yaml",
        idAttributeName: "planetSchematicID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/races.yaml",
        idAttributeName: "raceID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/researchAgents.yaml",
        idAttributeName: "characterID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/skinLicenses.yaml",
        idAttributeName: "licenseTypeID",
        transformations: []
    },
    {
        path: "fsd/skinMaterials.yaml",
        idAttributeName: "skinMaterialID",
        transformations: []
    },
    {
        path: "fsd/stationOperations.yaml",
        idAttributeName: "stationOperationID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/stationServices.yaml",
        idAttributeName: "stationServiceID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/tournamentRuleSets.yaml",
        idAttributeName: "ruleSetID",
        transformations: [fromArrayOfObjectsToMap]
    },
    {
        path: "fsd/translationLanguages.yaml",
        idAttributeName: "translationLanguageID",
        transformations: []
    },
    {
        path: "fsd/typeDogma.yaml",
        idAttributeName: "typeID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/typeIDs.yaml",
        idAttributeName: "typeID",
        transformations: [addIdToItem]
    },
    {
        path: "fsd/typeMaterials.yaml",
        idAttributeName: "typeID",
        transformations: [addIdToItem]
    },
]

/*
for (const file of files) {
    console.time(file.path)

    // Read file
    const filePath = path.join(SDE_ROOT, file.path)
    let data = YAML.load(fs.readFileSync(filePath, "utf8"), 'utf8')

    // Apply transformations
    for (const transformation of file.transformations) {
        data = transformation(data, file)
    }

    // Write file
    const outPath = path.join(SDE_ROOT, file.outFile ?? file.path.replace(".yaml", ".json"))
    fs.writeFileSync(outPath, JSON.stringify(data))

    console.timeEnd(file.path)
}*/

const universeNames = fs.readdirSync(path.join(SDE_ROOT, "fsd/universe"))

let regions = {}
let constellations = {}
let solarSystems = {}
let planets = {}
let moons = {}
let asteroidBelts = {}
let stars = {}
let stargates = {}

for (const universeName of universeNames) {
    console.time("Universe: " + universeName)
    const universePath = path.join(SDE_ROOT, "fsd/universe", universeName)
    const regionNames = fs.readdirSync(universePath)
    //console.log(universeName, regionNames)
    for (const regionName of regionNames) {
        //console.log('region', regionName)
        const regionPath = path.join(universePath, regionName)

        let region = YAML.load(fs.readFileSync(path.join(regionPath, "region.staticdata"), "utf8"), 'utf8')
        region.universeID = universeName
        //console.log(region)
        regions[region.regionID] = region

        const constellationNames = fs.readdirSync(regionPath).filter(file => !file.endsWith(".staticdata"))
        for (const constellationName of constellationNames) {
            const constellationPath = path.join(regionPath, constellationName)

            let constellation = YAML.load(fs.readFileSync(path.join(constellationPath, "constellation.staticdata"), "utf8"), 'utf8')
            constellation.regionID = region.regionID

            constellations[constellation.constellationID] = constellation

            const solarSystemNames = fs.readdirSync(constellationPath).filter(file => !file.endsWith(".staticdata"))
            for (const solarSystemName of solarSystemNames) {
                const solarSystemPath = path.join(constellationPath, solarSystemName)

                let solarSystem = YAML.load(fs.readFileSync(path.join(solarSystemPath, "solarsystem.staticdata"), "utf8"), 'utf8')
                solarSystem.constellationID = constellation.constellationID

                solarSystems[solarSystem.solarSystemID] = solarSystem

                Object.keys(solarSystem.planets).forEach(planetID => {
                    const planet = solarSystem.planets[planetID]
                    planet.solarSystemID = solarSystem.solarSystemID
                    planets[planetID] = planet

                    // moons
                    Object.keys(planet.moons ?? {}).forEach(moonID => {
                        const moon = planet.moons[moonID]
                        moon.planetID = planetID
                        moons[moonID] = moon
                    })
                    planet.moons = Object.keys(planet.moons ?? {})

                    // asteroid belts
                    Object.keys(planet.asteroidBelts ?? {}).forEach(asteroidBeltID => {
                        const asteroidBelt = planet.asteroidBelts[asteroidBeltID]
                        asteroidBelt.planetID = planetID
                        asteroidBelts[asteroidBeltID] = asteroidBelt
                    })
                    planet.asteroidBelts = Object.keys(planet.asteroidBelts ?? {})
                })
                solarSystem.planets = Object.keys(solarSystem.planets)

                Object.keys(solarSystem.stargates ?? {}).forEach(stargateID => {
                    const stargate = solarSystem.stargates[stargateID]
                    stargate.solarSystemID = solarSystem.solarSystemID
                    stargates[stargateID] = stargate
                })
                solarSystem.stargates = Object.keys(solarSystem.stargates)

                if (solarSystem.star) {
                    stars[solarSystem.star.id] = solarSystem.star
                    solarSystem.star = solarSystem.star.id
                }

            }
        }
    }
    console.timeEnd("Universe: " + universeName)
}

fs.writeFileSync(path.join(SDE_ROOT, "regions.json"), JSON.stringify(regions, null, 2))
fs.writeFileSync(path.join(SDE_ROOT, "constellations.json"), JSON.stringify(constellations, null, 2))
fs.writeFileSync(path.join(SDE_ROOT, "solarSystems.json"), JSON.stringify(solarSystems, null, 2))
fs.writeFileSync(path.join(SDE_ROOT, "planets.json"), JSON.stringify(planets))
fs.writeFileSync(path.join(SDE_ROOT, "moons.json"), JSON.stringify(moons))
fs.writeFileSync(path.join(SDE_ROOT, "stars.json"), JSON.stringify(stars, null, 2))
fs.writeFileSync(path.join(SDE_ROOT, "stargates.json"), JSON.stringify(stargates, null, 2))
fs.writeFileSync(path.join(SDE_ROOT, "asteroidBelts.json"), JSON.stringify(asteroidBelts, null, 2))

console.log("#moons", Object.keys(moons).length)

//console.log(regions)
