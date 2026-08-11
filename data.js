// data.js
//Enthält alle statischen Spieldaten und Konfigurationen. Diese Datei hat keine Abhängigkeiten zu DOM-Elementen.

const ICON_FUNDS = '<img src="textures/Funds_Icon.png" alt="Funds" class="resource-icon">';
const ICON_SCI = '<img src="textures/Science_Icon.png" alt="Science" class="resource-icon">';

const warpThresholds = [0, 1000, 100000, 10000000];
const warpLevels = [1, 4, 10, 20];

// data.js

const unitDOMMapping = {
    rocket: { cardId: 'rocket-card', prefix: 'rocket', isClick: true, isRocket: true, title: '🚀 Rocket Launch (Click)', btnText: 'Add Moar Boosters!' },
    miner: { cardId: 'miner-card', prefix: 'miner', title: '🚜 Mining Rig', yieldResource: 'funds', btnText: 'Build', multiplier: 'mining' },
    scienceLab: { cardId: 'science-card', prefix: 'lab', title: '🔬 Science Laboratory', yieldResource: 'science', btnText: 'Build Lab', multiplier: 'commNet' },
    touristHotel: { cardId: 'hotel-card', prefix: 'hotel', req: 'unlockTouristHotel', title: '🏨 Orbital Tourism Hotel', yieldResource: 'funds', btnText: 'Launch Module', multiplier: 'tourism' },
    researchStation: { cardId: 'station-card', prefix: 'station', req: 'unlockResearchStation', title: '🛰️ Orbital Research Station', yieldResource: 'science', btnText: 'Launch Module' },
    rover: { cardId: 'rover-card', prefix: 'rover', req: 'unlockRover', title: '🚙 Autonomous Science Rover', yieldResource: 'science', btnText: 'Launch Rover', multiplier: 'rover' },
    he3Extractor: { cardId: 'he3-card', prefix: 'he3', req: 'unlockHe3', title: '🏭 Helium-3 Extractor', yieldResource: 'funds', btnText: 'Build' },
    lkoFuelDepot: { cardId: 'lko-fuel-card', prefix: 'lko-fuel', req: 'docking', title: '⛽ LKO Fuel Station', yieldResource: 'funds', btnText: 'Build' },
    telescopeObs: { cardId: 'telescope-card', prefix: 'telescope', title: '🔭 Telescope Observatory', yieldResource: 'science', btnText: 'Build Lab', multiplier: 'commNet' },
    kerbalTraining: { cardId: 'training-card', prefix: 'training', title: '🏫 Kerbal Training Center', yieldResource: 'science', btnText: 'Build Center', multiplier: 'commNet' },
    tourismShuttle: { cardId: 'tourism-shuttle-card', prefix: 'tourism-shuttle', title: '🚀 Tourism Shuttle', yieldResource: 'funds', btnText: 'Build' },
    fuelRefinery: { cardId: 'fuel-refinery-card', prefix: 'fuel-refinery', title: '⛽ Fuel Refinery', yieldResource: 'funds', btnText: 'Build' },
    regolithLab: { cardId: 'regolith-lab-card', prefix: 'regolith-lab', title: '🔬 Regolith Laboratory', yieldResource: 'science', btnText: 'Build Lab', multiplier: 'commNet' },
    craterResearch: { cardId: 'crater-research-card', prefix: 'crater-research', title: '🏗️ Lunar Crater Research Base', yieldResource: 'science', btnText: 'Build Base', multiplier: 'commNet' },
    mysteryGoo: { cardId: 'mystery-goo-card', prefix: 'mystery-goo', title: '🧪 MysteryGoo Surface Experiment', yieldResource: 'science', btnText: 'Deploy' },
    iceExtractor: { cardId: 'ice-extractor-card', prefix: 'ice-extractor', title: '🧊 Ice Extractor', yieldResource: 'funds', btnText: 'Build' },
    spaceElevator: { cardId: 'space-elevator-card', prefix: 'space-elevator', req: 'spaceElevatorTech', title: '🗼 Space Elevator', yieldResource: 'funds', btnText: 'Construct' },
    parachuteProd: { cardId: 'parachute-prod-card', prefix: 'parachute-prod', title: '🪂 Parachute Production', yieldResource: 'funds', btnText: 'Build' },
    highPressureLab: { cardId: 'high-pressure-lab-card', prefix: 'high-pressure-lab', title: '🔬 High-Pressure Atmosphere Lab', yieldResource: 'science', btnText: 'Build Lab', multiplier: 'commNet' },
    gravioliDetector: { cardId: 'gravioli-detector-card', prefix: 'gravioli-detector', title: '📡 Gravioli Detector Surface Exp.', yieldResource: 'science', btnText: 'Deploy' },
    colonyModule: { cardId: 'colony-module-card', prefix: 'colony-module', title: '🏡 Colony Habitation Module', yieldResource: 'funds', btnText: 'Build Module', multiplier: 'habitat' },
    spaceyLifter: { cardId: 'spacey-lifter-card', prefix: 'spacey-lifter', title: '🚀 SpaceY Heavy Lifter', yieldResource: 'funds', btnText: 'Launch' },
    fuelExport: { cardId: 'fuel-export-card', prefix: 'fuel-export', title: '⛽ Fuel Export Base', yieldResource: 'funds', btnText: 'Build Base' },
    geologicLab: { cardId: 'geologic-lab-card', prefix: 'geologic-lab', title: '🔬 Geological Analysis Lab', yieldResource: 'science', btnText: 'Build Lab', multiplier: 'commNet' },
    greenhouse: { cardId: 'greenhouse-card', prefix: 'greenhouse', title: '🌱 Greenhouse', yieldResource: 'science', btnText: 'Construct' },
    cloudCityHotel: { cardId: 'cloud-city-card', prefix: 'cloud-city', title: '☁️ Cloud City Hotel', yieldResource: 'funds', btnText: 'Construct' },
    floatingMiner: { cardId: 'floating-miner-card', prefix: 'floating-miner', title: '🎈 Floating Gas Miner', yieldResource: 'funds', btnText: 'Build' },
    he4Extractor: { cardId: 'he4-card', prefix: 'he4', title: '🏭 Helium-4 Extractor', yieldResource: 'funds', btnText: 'Build' },
    atmosphereScoop: { cardId: 'atmosphere-scoop-card', prefix: 'atmosphere-scoop', title: '🌬️ Atmosphere Scoop', yieldResource: 'funds', btnText: 'Build' },
    sstoFreighter: { cardId: 'ssto-freighter-card', prefix: 'ssto-freighter', title: '✈️ SSTO Freighter', yieldResource: 'funds', btnText: 'Build' },
    oceanResearch: { cardId: 'ocean-research-card', prefix: 'ocean-research', title: '🌊 Ocean Research Facility', yieldResource: 'science', btnText: 'Build Lab', multiplier: 'commNet' },
    underwaterProbe: { cardId: 'underwater-probe-card', prefix: 'underwater-probe', title: '🚤 Underwater Probe', yieldResource: 'science', btnText: 'Launch' },
    tidalStation: { cardId: 'tidal-station-card', prefix: 'tidal-station', title: '🌊 Tidal Power Station', yieldResource: 'funds', btnText: 'Build' },
    xenoBioStation: { cardId: 'xeno-bio-card', prefix: 'xeno-bio', title: '🦠 Xeno-Biology Station', yieldResource: 'science', btnText: 'Build Lab', multiplier: 'commNet' },
    supplyDepot: { cardId: 'supply-depot-card', prefix: 'supply-depot', title: '📦 Deep Space Supply Depot', yieldResource: 'funds', btnText: 'Build' },
    exoticIceSale: { cardId: 'exotic-ice-card', prefix: 'exotic-ice', title: '💎 Exotic Ice Export', yieldResource: 'funds', btnText: 'Establish' },
    deepIceDrill: { cardId: 'deep-ice-drill-card', prefix: 'deep-ice-drill', title: '🧊 Deep Ice Drill', yieldResource: 'funds', btnText: 'Build' },
    cryoLab: { cardId: 'cryo-lab-card', prefix: 'cryo-lab', title: '❄️ Cryo-Laboratory', yieldResource: 'science', btnText: 'Build Lab', multiplier: 'commNet' },
    longCryoLab: { cardId: 'long-cryo-lab-card', prefix: 'long-cryo-lab', title: '🛌 Long-Term Cryo Station', yieldResource: 'science', btnText: 'Build Station', multiplier: 'commNet' },
    heatShieldProd: { cardId: 'heat-shield-prod-card', prefix: 'heat-shield-prod', title: '🛡️ Heat Shield Production', yieldResource: 'funds', btnText: 'Build' },
    solarPowerPlant: { cardId: 'solar-power-plant-card', prefix: 'solar-power-plant', title: '☀️ Solar Power Plant', yieldResource: 'funds', btnText: 'Construct' },
    lowGravOreTransporter: { cardId: 'low-grav-ore-transporter-card', prefix: 'low-grav-ore-transporter', title: '🪨 Low-G Ore Transporter', yieldResource: 'funds', btnText: 'Build' },
    heavyLander: { cardId: 'heavy-lander-card', prefix: 'heavy-lander', title: '🛸 Heavy Lander', yieldResource: 'funds', btnText: 'Build' },
    massCatapult: { cardId: 'mass-catapult-card', prefix: 'mass-catapult', title: '☄️ Mass Catapult', yieldResource: 'funds', btnText: 'Construct' },
    iceCrystalExport: { cardId: 'ice-crystal-export-card', prefix: 'ice-crystal-export', title: '❄️ Ice Crystal Export', yieldResource: 'funds', btnText: 'Establish' },
    ionDriveProbe: { cardId: 'ion-drive-probe-card', prefix: 'ion-drive-probe', title: '🛰️ Ion Drive Probe', yieldResource: 'science', btnText: 'Launch' },
    solarObsPlatform: { cardId: 'solar-obs-platform-card', prefix: 'solar-obs-platform', req: 'docking', title: '🔭 Solar Observation Platform', yieldResource: 'science', btnText: 'Construct', multiplier: 'commNet' },
    thermalResLab: { cardId: 'thermal-res-lab-card', prefix: 'thermal-res-lab', title: '🌡️ Thermal Research Lab', yieldResource: 'science', btnText: 'Build Lab', multiplier: 'commNet' },
    plasmaPhysicsLab: { cardId: 'plasma-physics-lab-card', prefix: 'plasma-physics-lab', title: '⚡ Plasma Physics Lab', yieldResource: 'science', btnText: 'Build Lab', multiplier: 'commNet' },
    dwarfPlanetResearch: { cardId: 'dwarf-planet-research-card', prefix: 'dwarf-planet-research', title: '🪐 Dwarf Planet Research', yieldResource: 'science', btnText: 'Build Base', multiplier: 'commNet' },
    commNetRelayUnit: { cardId: 'comm-net-relay-card', prefix: 'comm-net-relay', title: '📡 CommNet Relay', yieldResource: 'science', btnText: 'Build Unit', multiplier: 'commNet' }
};

function getUnitMultiplier(unitKey) {
    const mapping = unitDOMMapping[unitKey];
    if (!mapping) return 1;

    const multType = mapping.multiplier;
    if (!multType) return 1;

    if (multType === 'mining' && gameData.upgrades.efficientMiners.unlocked) return 1.5;
    if (multType === 'tourism' && gameData.upgrades.publicRelations.unlocked) return 2;
    if (multType === 'commNet' && gameData.upgrades.commNetRelay.unlocked) return 1.5;
    if (multType === 'habitat' && gameData.upgrades.inflatableHabitats.unlocked) return 2;
    
    if (multType === 'rover') {
        let mult = 1;
        if (gameData.upgrades.advancedAvionics.unlocked) mult *= 1.2;
        if (gameData.upgrades.scanSatMapping.unlocked) mult *= 2.0;
        return mult;
    }

    return 1;
}

const gameData = {
    funds: 0, 
    totalFundsEarned: 0, 
    science: 0, 
    totalScienceEarned: 0,
    maxWarpUnlocked: 0,
    missionTime: 0, 
    selectedPlanet: null, 
    claimedContracts: [], 
    completedContracts: [],
	cachedTotalIncome: 0,
    cachedTotalScience: 0,
    upgrades: {
        rocketTech: { id: 'rocketTech', name: 'Solid Rocket Boosters', cost: 25, unlocked: false, desc: 'Doubles the click value on Kerbin', tier: 1, row: 3, req: [] },
		efficientMiners: { id: 'efficientMiners', name: 'Optimized Drills', cost: 10, unlocked: false, desc: 'Increases yield of all mining vehicles by +50%', tier: 2, row: 3, req: ['rocketTech'] },
		mechJeb: { id: 'mechJeb', name: 'MechJeb Autopilot', cost: 150, unlocked: false, desc: 'Automates the Manual Start (Click).', tier: 3, row: 1, req: ['efficientMiners'] },
		trackingStation: { id: 'trackingStation', name: 'Tracking Station', cost: 40, unlocked: false, desc: 'Deep space tracking network. Allows detection and collection of passing asteroids.', tier: 2, row: 5, req: ['rocketTech'] },
        longTermMissions: { id: 'longTermMissions', name: 'Long-Term Missions', cost: 1500, unlocked: false, desc: 'Increases Funds and Science income by +10% while in Time-Warp.', tier: 3, row: 5, req: ['trackingStation'] },
		unlockRover: { id: 'unlockRover', name: 'Rover Technology', cost: 50, unlocked: false, desc: 'Unlocks the Autonomous Science Rover on the Mun', tier: 3, row: 2, req: ['efficientMiners'] },
        kerbalKonstructs: { id: 'kerbalKonstructs', name: 'Kerbal Konstructs', cost: 150, unlocked: false, desc: 'Extraterrestrial Bases. Doubles global Funds income!', tier: 3, row: 3, req: ['efficientMiners'] },
        docking: { id: 'docking', name: 'Docking & Orbital Assembly', cost: 500, unlocked: false, desc: 'Unlocks various Orbital Stations across different planets.', tier: 3, row: 4, req: ['efficientMiners'] },
		unlockTouristHotel: { id: 'unlockTouristHotel', name: 'Orbital Tourism', cost: 250, unlocked: false, desc: 'Unlocks the Orbital Tourism Hotel on Kerbin', tier: 4, row: 4, req: ['docking'] },
		unlockResearchStation: { id: 'unlockResearchStation', name: 'Orbital Research Station', cost: 500, unlocked: false, desc: 'Unlocks the Orbital Research Station on Kerbin', tier: 4, row: 5, req: ['docking'] },
        commNetRelay: { id: 'commNetRelay', name: 'CommNet Relay', cost: 1000, unlocked: false, desc: 'Increases the Science yield of all labs by +50%', tier: 5, row: 2, req: ['advancedAvionics'] },
        unlockHe3: { id: 'unlockHe3', name: 'Helium-3 Extraction', cost: 1500, unlocked: false, desc: 'Unlocks the Helium-3 Extractor on the Mun', tier: 5, row: 3, req: ['unlockRover', 'kerbalKonstructs'] },
        publicRelations: { id: 'publicRelations', name: 'Public Relations Office', cost: 2000, unlocked: false, desc: 'Increases the yield of the Tourism Hotel by +100%', tier: 5, row: 4, req: ['unlockTouristHotel'] },
        dartEngine: { id: 'dartEngine', name: 'Dart Aerospike Engine', cost: 3500, unlocked: false, desc: 'Advanced atmospheric propulsion. Necessary for travel to Eve.', tier: 6, row: 2, req: ['commNetRelay'] },
        drogueChute: { id: 'drogueChute', name: 'Drogue Chute', cost: 3000, unlocked: false, desc: 'High-altitude parachute system. Necessary for a safe landing in Dunas thin atmosphere.', tier: 6, row: 3, req: ['commNetRelay', 'unlockHe3'] },
        radiators: { id: 'radiators', name: 'Radiators', cost: 4000, unlocked: false, desc: 'Heat dissipation systems. Necessary for travel to Moho.', tier: 6, row: 1, req: ['commNetRelay'] },
		betterTelescopes: { id: 'betterTelescopes', name: 'Better Telescopes', cost: 10000, unlocked: false, desc: 'Advanced optical arrays. Finally proves the existence of a so-called "Dres".', tier: 7, row: 1, req: ['radiators'] },
        aerocapture: { id: 'aerocapture', name: 'Aerocapture Maneuver', cost: 15000, unlocked: false, desc: 'Advanced orbital mechanics. Necessary for travel to Jool.', tier: 7, row: 3, req: ['drogueChute'] },
		spaceElevatorTech: { id: 'spaceElevatorTech', name: 'Space Elevator', cost: 20000, unlocked: false, desc: 'A massive orbital tether. Unlocks the Space Elevator on Kerbin and Eve.', tier: 8, row: 1, req: ['aerocapture'] },																																																							 
        rapierEngine: { id: 'rapierEngine', name: 'R.A.P.I.E.R. Engine', cost: 25000, unlocked: false, desc: 'Hybrid propulsion system. Necessary for travel to Laythe.', tier: 8, row: 2, req: ['aerocapture'] },
        rtg: { id: 'rtg', name: 'Radioisotope Thermoelectric Generator', cost: 30000, unlocked: false, desc: 'Reliable deep space power. Necessary for travel to Eeloo.', tier: 8, row: 4, req: ['aerocapture'] },
        krakenDrive: { id: 'krakenDrive', name: 'Kraken Drive', cost: 100000, unlocked: false, desc: 'Experimental spacetime manipulation. Increases the last warp level from x20 to x22.', tier: 9, row: 3, req: ['rtg'] },
		launchAbortSystem: { id: 'launchAbortSystem', name: 'Launch Abort System', cost: 50, unlocked: false, desc: 'Safety first! Doubles the yield of a manual click.', tier: 2, row: 1, req: ['rocketTech'] },
        improvedFlagMaterial: { id: 'improvedFlagMaterial', name: 'Improved Flag Material', cost: 800, unlocked: false, desc: 'Better flags inspire everyone. Grants a +10% boost to global Funds and Science income.', tier: 4, row: 1, req: ['mechJeb'] },
        advancedAvionics: { id: 'advancedAvionics', name: 'Advanced Avionics', cost: 1200, unlocked: false, desc: 'Smarter driving software. All Rovers generate +20% Science.', tier: 4, row: 2, req: ['unlockRover'] },
        munTransferStation: { id: 'munTransferStation', name: 'Mun Transfer Station', cost: 2500, unlocked: false, desc: 'Orbital logistics limit launch weight. Lowers the cost of all units on the Mun by 20%.', tier: 6, row: 5, req: ['unlockResearchStation'] },
        scanSatMapping: { id: 'scanSatMapping', name: 'SCANsat Mapping', cost: 3500, unlocked: false, desc: 'High-res orbital mapping. Increases the Science yield of all Rovers by +100%.', tier: 5, row: 1, req: ['advancedAvionics'] },
        inflatableHabitats: { id: 'inflatableHabitats', name: 'Inflatable Habitats', cost: 12000, unlocked: false, desc: 'More space for Kerbals to stretch. Doubles the yield of Colony Modules.', tier: 7, row: 2, req: ['drogueChute'] }
	},
    planets: {
        kerbol: { id: 'kerbol', name: 'Kerbol', unlocked: true, desc: 'The massive central star of the system. The inexhaustible source of all light and heat.', unlockCost: 0, units: {} },
        moho: {
            id: 'moho', name: 'Moho', desc: 'The closest planet to Kerbol, baked by intense solar radiation and stripped of an atmosphere. Its reddish surface is a harsh crucible for any spacecraft daring to enter its orbit.',
			unlocked: false, unlockCost: 7500, unlockReq: 'radiators',
			unlockTime: 420, isUnlocking: false, unlockProgress: 0, 
            baseTransferChance: 0.15, rocketUpgradeBaseCost: 2500,
            rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, 
            orbitDuration: 100, startAngle: 340,
			orbitWidth: 190, orbitHeight: 200, offsetY: -30, orbitColor: 'rgba(155, 126, 103, 0.5)', orbitParent: 'kerbol',
            units: {
                miner: { baseCost: 6000, costMult: 1.25, owned: 0, basePower: 50, max: 100 },
                heatShieldProd: { baseCost: 15000, costMult: 1.25, owned: 0, basePower: 120, max: 50 },
                solarPowerPlant: { baseCost: 45000, costMult: 1.25, owned: 0, basePower: 400, max: 50 },
                ionDriveProbe: { baseCost: 8000, costMult: 1.3, owned: 0, basePower: 25, max: 50 },
                solarObsPlatform: { baseCost: 20000, costMult: 1.3, owned: 0, basePower: 70, max: 50 },
                thermalResLab: { baseCost: 50000, costMult: 1.3, owned: 0, basePower: 180, max: 50 },
                plasmaPhysicsLab: { baseCost: 120000, costMult: 1.3, owned: 0, basePower: 450, max: 50 },
                commNetRelayUnit: { baseCost: 2500, costMult: 1.3, owned: 0, basePower: 10, max: 50 }
            }
        },
		eve: {
            id: 'eve', name: 'Eve', desc: 'A dense, purple planet with a crushing atmosphere and extremely high gravity.',
			unlocked: false, unlockCost: 7500, unlockReq: 'dartEngine',
            unlockTime: 420, isUnlocking: false, unlockProgress: 0, 
            baseTransferChance: 0.15, rocketUpgradeBaseCost: 2500,
            rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, 
            orbitDuration: 140, startAngle: 150,
			orbitWidth: 400, orbitHeight: 400, offsetY: 0, orbitColor: 'rgba(162, 75, 162, 0.5)', orbitParent: 'kerbol',
			units: {
                miner: { baseCost: 6000, costMult: 1.25, owned: 0, basePower: 50, max: 100 },
                spaceElevator: { baseCost: 25000, costMult: 1.25, owned: 0, basePower: 300, max: 50 },
                parachuteProd: { baseCost: 10000, costMult: 1.2, owned: 0, basePower: 110, max: 50 },
                highPressureLab: { baseCost: 12000, costMult: 1.3, owned: 0, basePower: 40, max: 50 },
                gravioliDetector: { baseCost: 18000, costMult: 1.3, owned: 0, basePower: 65, max: 50 },
                commNetRelayUnit: { baseCost: 2500, costMult: 1.3, owned: 0, basePower: 10, max: 50 }
            }
        },
		gilly: {
            id: 'gilly', name: 'Gilly', desc: 'A tiny, potato-shaped asteroid captured by Eves gravity. Its gravity is so weak that a strong kerbal could practically jump into orbit.',
			unlocked: false, unlockCost: 1000, planetReq: 'eve',
			unlockTime: 420, isUnlocking: false, unlockProgress: 0, 
            baseTransferChance: 0.20, rocketUpgradeBaseCost: 1000,
            rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, 
            orbitDuration: 60, startAngle: 60,
			orbitWidth: 90, orbitHeight: 90, offsetY: 0,  orbitColor: 'rgba(171, 131, 123, 0.5)', orbitParent: 'eve',
            units: {
                miner: { baseCost: 1500, costMult: 1.2, owned: 0, basePower: 15, max: 100 },
                commNetRelayUnit: { baseCost: 2500, costMult: 1.3, owned: 0, basePower: 10, max: 50 }
            }
        },
        kerbin: {
            id: 'kerbin', name: 'Kerbin', desc: 'Our beloved homeworld. A blue planet with perfect conditions for Kerbal life.',
			unlocked: true, unlockCost: 0, orbitDuration: 200, startAngle: 90,
			orbitWidth: 650, orbitHeight: 650, offsetY: 0,  orbitColor: 'rgba(149, 192, 184, 0.7)', orbitParent: 'kerbol',
            units: {
                rocket: { baseCost: 10, costMult: 1.15, owned: 1, basePower: 1, max: 50 },
                miner: { baseCost: 50, costMult: 1.15, owned: 0, basePower: 1, max: 100 },
                scienceLab: { baseCost: 500, costMult: 1.3, owned: 0, basePower: 4, max: 50 },
                touristHotel: { baseCost: 2500, costMult: 1.2, owned: 0, basePower: 40, max: 50 },
                researchStation: { baseCost: 4000, costMult: 1.25, owned: 0, basePower: 15, max: 50 },
                lkoFuelDepot: { baseCost: 1200, costMult: 1.2, owned: 0, basePower: 20, max: 50 },
                telescopeObs: { baseCost: 800, costMult: 1.25, owned: 0, basePower: 8, max: 50 },
                kerbalTraining: { baseCost: 1500, costMult: 1.3, owned: 0, basePower: 15, max: 50 },
				spaceElevator: { baseCost: 25000, costMult: 1.25, owned: 0, basePower: 300, max: 50 },																					  
                commNetRelayUnit: { baseCost: 2500, costMult: 1.3, owned: 0, basePower: 10, max: 50 }
            }
        },
        mun: {
            id: 'mun', name: 'Mun', desc: 'The loyal companion of Kerbin. A dusty moon covered in deep craters.',
			unlocked: false, unlockCost: 1000, planetReq: 'kerbin',
            unlockTime: 30, isUnlocking: false, unlockProgress: 0, 
            baseTransferChance: 0.15, rocketUpgradeBaseCost: 250,
            rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, 
            orbitDuration: 60, startAngle: 45,
			orbitWidth: 90, orbitHeight: 90, offsetY: 0,  orbitColor: 'rgba(126, 126, 126, 0.7)', orbitParent: 'kerbin',
			units: {
                miner: { baseCost: 1500, costMult: 1.2, owned: 0, basePower: 15, max: 100 },
                scienceLab: { baseCost: 3500, costMult: 1.3, owned: 0, basePower: 12, max: 50 },
                rover: { baseCost: 200, costMult: 1.2, owned: 0, basePower: 1, max: 50 },
                he3Extractor: { baseCost: 8000, costMult: 1.25, owned: 0, basePower: 100, max: 50 },
                tourismShuttle: { baseCost: 2200, costMult: 1.2, owned: 0, basePower: 35, max: 50 },
                fuelRefinery: { baseCost: 4500, costMult: 1.25, owned: 0, basePower: 60, max: 50 },
                regolithLab: { baseCost: 1200, costMult: 1.3, owned: 0, basePower: 6, max: 50 },
                craterResearch: { baseCost: 2500, costMult: 1.3, owned: 0, basePower: 14, max: 50 },
                mysteryGoo: { baseCost: 800, costMult: 1.25, owned: 0, basePower: 4, max: 50 },
                commNetRelayUnit: { baseCost: 2500, costMult: 1.3, owned: 0, basePower: 10, max: 50 }
            }
        },
        minmus: {
            id: 'minmus', name: 'Minmus', desc: 'A tiny, mint-green moon. Researchers still speculate whether it is made of mint ice cream.',
			unlocked: false, unlockCost: 2500, planetReq: 'kerbin',
			unlockTime: 60, isUnlocking: false, unlockProgress: 0, 
            baseTransferChance: 0.15, rocketUpgradeBaseCost: 400,
            rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, 
            orbitDuration: 110, startAngle: 230,
			orbitWidth: 140, orbitHeight: 140, offsetY: 0,  orbitColor: 'rgba(162, 255, 204, 0.5)', orbitParent: 'kerbin',
            units: {
                miner: { baseCost: 3000, costMult: 1.2, owned: 0, basePower: 25, max: 100 },
                iceExtractor: { baseCost: 3500, costMult: 1.2, owned: 0, basePower: 45, max: 50 },
                commNetRelayUnit: { baseCost: 2500, costMult: 1.3, owned: 0, basePower: 10, max: 50 }
            }
        },
        duna: {
            id: 'duna', name: 'Duna', desc: 'The rusty red desert planet. Its thin atmosphere requires giant parachutes for a safe landing.',
			unlocked: false, unlockCost: 15000, unlockReq: 'drogueChute',
			unlockTime: 120, isUnlocking: false, unlockProgress: 0, 
            baseTransferChance: 0.10, rocketUpgradeBaseCost: 4000,
            rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, 
            orbitDuration: 350, startAngle: 290,
			orbitWidth: 950, orbitHeight: 950, offsetY: 0,  orbitColor: 'rgba(212, 60, 25, 0.5)', orbitParent: 'kerbol',
            units: {
                miner: { baseCost: 12000, costMult: 1.25, owned: 0, basePower: 75, max: 100 },
                colonyModule: { baseCost: 18000, costMult: 1.2, owned: 0, basePower: 180, max: 50 },
                spaceyLifter: { baseCost: 28000, costMult: 1.25, owned: 0, basePower: 350, max: 50 },
                fuelExport: { baseCost: 45000, costMult: 1.3, owned: 0, basePower: 600, max: 50 },
                geologicLab: { baseCost: 15000, costMult: 1.3, owned: 0, basePower: 50, max: 50 },
                greenhouse: { baseCost: 22000, costMult: 1.3, owned: 0, basePower: 80, max: 50 },
                commNetRelayUnit: { baseCost: 2500, costMult: 1.3, owned: 0, basePower: 10, max: 50 }
            }
        },
		ike: {
            id: 'ike', name: 'Ike', desc: 'A dark, rocky moon tightly bound to Duna, often blocking its sunlight.',
			unlocked: false, unlockCost: 20000, planetReq: 'duna',
			unlockTime: 145, isUnlocking: false, unlockProgress: 0, 
            baseTransferChance: 0.15, rocketUpgradeBaseCost: 5000,
            rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, 
            orbitDuration: 50, startAngle: 30,
			orbitWidth: 120, orbitHeight: 120, offsetY: 0,  orbitColor: 'rgba(180, 180, 180, 0.5)', orbitParent: 'duna',
            units: {
                miner: { baseCost: 16000, costMult: 1.25, owned: 0, basePower: 100, max: 100 },
                commNetRelayUnit: { baseCost: 2500, costMult: 1.3, owned: 0, basePower: 10, max: 50 }
            }
        },
		dres: {
            id: 'dres', name: 'Dres', desc: 'The forgotten world drifting quietly in the asteroid belt between Duna and Jool. Its cratered, barren landscape often leaves curious travelers wondering if it actually exists.',
			unlocked: false, unlockCost: 15000, unlockReq: 'betterTelescopes',
			unlockTime: 420, isUnlocking: false, unlockProgress: 0, 
            baseTransferChance: 0.05, rocketUpgradeBaseCost: 6000,
            rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, 
            orbitDuration: 800, startAngle: 170,
			orbitWidth: 1440, orbitHeight: 1600, offsetY: 100,  orbitColor: 'rgba(89, 63, 48, 0.7)', orbitParent: 'kerbol',
            units: {
                miner: { baseCost: 12000, costMult: 1.25, owned: 0, basePower: 75, max: 100 },
                dwarfPlanetResearch: { baseCost: 30000, costMult: 1.3, owned: 0, basePower: 100, max: 50 },
                commNetRelayUnit: { baseCost: 2500, costMult: 1.3, owned: 0, basePower: 10, max: 50 }
            }
        },
        jool: {
            id: 'jool', name: 'Jool', desc: 'A giant gas planet with an unmistakable green color. The gravitational heart of the outer system.',
			unlocked: false, unlockCost: 50000, unlockReq: 'aerocapture',
			unlockTime: 420, isUnlocking: false, unlockProgress: 0, 
            baseTransferChance: 0.05, rocketUpgradeBaseCost: 10000,
            rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, 
            orbitDuration: 1200, startAngle: 280,
			orbitWidth: 2410, orbitHeight: 2410, offsetY: 0,  orbitColor: 'rgba(75, 203, 75, 0.5)', orbitParent: 'kerbol',
            units: {
                miner: { baseCost: 40000, costMult: 1.25, owned: 0, basePower: 250, max: 100 },
                cloudCityHotel: { baseCost: 90000, costMult: 1.25, owned: 0, basePower: 1200, max: 50 },
                floatingMiner: { baseCost: 60000, costMult: 1.25, owned: 0, basePower: 750, max: 50 },
                he4Extractor: { baseCost: 120000, costMult: 1.3, owned: 0, basePower: 1600, max: 50 },
                atmosphereScoop: { baseCost: 50000, costMult: 1.3, owned: 0, basePower: 180, max: 50 },
                commNetRelayUnit: { baseCost: 2500, costMult: 1.3, owned: 0, basePower: 10, max: 50 }
            }
        },
		laythe: {
            id: 'laythe', name: 'Laythe', desc: 'An inner, ocean-covered moon with an oxygen-rich atmosphere orbiting the gas giant Jool. A distant, blue home away from home.',
			unlocked: false, unlockCost: 60000, planetReq: 'jool', unlockReq: 'rapierEngine',
			unlockTime: 420, isUnlocking: false, unlockProgress: 0, 
            baseTransferChance: 0.10, rocketUpgradeBaseCost: 12000,
            rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, 
            orbitDuration: 70, startAngle: 180,
			orbitWidth: 120, orbitHeight: 120, offsetY: 0,  orbitColor: 'rgba(18, 86, 130, 0.5)', orbitParent: 'jool',
            units: {
                miner: { baseCost: 60000, costMult: 1.3, owned: 0, basePower: 350, max: 100 },
                sstoFreighter: { baseCost: 85000, costMult: 1.25, owned: 0, basePower: 1000, max: 50 },
                oceanResearch: { baseCost: 40000, costMult: 1.3, owned: 0, basePower: 130, max: 50 },
                underwaterProbe: { baseCost: 55000, costMult: 1.3, owned: 0, basePower: 190, max: 50 },
                tidalStation: { baseCost: 70000, costMult: 1.3, owned: 0, basePower: 250, max: 50 },
                xenoBioStation: { baseCost: 95000, costMult: 1.3, owned: 0, basePower: 350, max: 50 },
                commNetRelayUnit: { baseCost: 2500, costMult: 1.3, owned: 0, basePower: 10, max: 50 }
            }
        },
		vall: {
            id: 'vall', name: 'Vall', desc: 'A frozen, icy moon orbiting Jool with a thick, icy crust concealing a hidden subsurface ocean. Its chilly plains are a breathtaking stop on any outer planets tour.',
			unlocked: false, unlockCost: 1000, planetReq: 'jool',
			unlockTime: 420, isUnlocking: false, unlockProgress: 0, 
            baseTransferChance: 0.10, rocketUpgradeBaseCost: 12000,
            rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, 
            orbitDuration: 110, startAngle: 90,
			orbitWidth: 180, orbitHeight: 180, offsetY: 0,  orbitColor: 'rgba(107, 131, 143, 0.5)', orbitParent: 'jool',
            units: {
                miner: { baseCost: 1500, costMult: 1.2, owned: 0, basePower: 15, max: 100 },
                iceCrystalExport: { baseCost: 25000, costMult: 1.25, owned: 0, basePower: 200, max: 50 },
                commNetRelayUnit: { baseCost: 2500, costMult: 1.3, owned: 0, basePower: 10, max: 50 }
            }
        },
		tylo: {
            id: 'tylo', name: 'Tylo', desc: 'The giant, airless moon of Jool with a surface gravity matching Kerbins. Landing here requires careful planning and a massive amount of delta-V because there is no atmosphere to slow you down.',
			unlocked: false, unlockCost: 1000, planetReq: 'jool',
			unlockTime: 420, isUnlocking: false, unlockProgress: 0, 
            baseTransferChance: 0.05, rocketUpgradeBaseCost: 15000,
            rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 },
			orbitDuration: 180, startAngle: 160,
			orbitWidth: 260, orbitHeight: 260, offsetY: 0,  orbitColor: 'rgba(174, 175, 177, 0.5)', orbitParent: 'jool',
            units: {
                miner: { baseCost: 1500, costMult: 1.2, owned: 0, basePower: 15, max: 100 },
                heavyLander: { baseCost: 40000, costMult: 1.25, owned: 0, basePower: 300, max: 50 },
                massCatapult: { baseCost: 100000, costMult: 1.25, owned: 0, basePower: 800, max: 50 },
                commNetRelayUnit: { baseCost: 2500, costMult: 1.3, owned: 0, basePower: 10, max: 50 }
            }
        },
		bop: {
            id: 'bop', name: 'Bop', desc: 'A captured, irregularly shaped asteroid moon wandering the outer edges of the Jool system. Its rugged, mountainous terrain hides whispered legends of ancient space krakens.',
			unlocked: false, unlockCost: 1000, planetReq: 'jool',
			unlockTime: 420, isUnlocking: false, unlockProgress: 0,
			baseTransferChance: 0.85, rocketUpgradeBaseCost: 15000,
            rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 },
			orbitDuration: 280, startAngle: 40,
			orbitWidth: 360, orbitHeight: 360, offsetY: 0,  orbitColor: 'rgba(63, 54, 52, 0.5)', orbitParent: 'jool',
            units: {
                miner: { baseCost: 1500, costMult: 1.2, owned: 0, basePower: 15, max: 100 },
                commNetRelayUnit: { baseCost: 2500, costMult: 1.3, owned: 0, basePower: 10, max: 50 }
            }
        },
		pol: {
            id: 'pol', name: 'Pol', desc: 'The smallest and outermost moon of Jool, resembling a dusty pollen grain floating in space. Its jagged terrain and bizarre spiked boulders make for a uniquely tricky landing.',
			unlocked: false, unlockCost: 1000, planetReq: 'jool',
			unlockTime: 420, isUnlocking: false, unlockProgress: 0,
			baseTransferChance: 0.85, rocketUpgradeBaseCost: 15000,
			orbitDuration: 400, startAngle: 300,
			orbitWidth: 475, orbitHeight: 500, offsetY: 30,  orbitColor: 'rgba(223, 162, 115, 0.4)', orbitParent: 'jool',
            units: {
                miner: { baseCost: 1500, costMult: 1.2, owned: 0, basePower: 15, max: 100 },
                lowGravOreTransporter: { baseCost: 35000, costMult: 1.25, owned: 0, basePower: 250, max: 50 },
                commNetRelayUnit: { baseCost: 2500, costMult: 1.3, owned: 0, basePower: 10, max: 50 }
            }
        },
		eeloo: {
            id: 'eeloo', name: 'Eeloo', desc: 'A white, ice-covered dwarf planet at the edge of the system. A distant world of snow and deep canyons crossing a lonely path.',
			unlocked: false, unlockCost: 100000, unlockReq: 'rtg',
			unlockTime: 420, isUnlocking: false, unlockProgress: 0,
			baseTransferChance: 0.85, rocketUpgradeBaseCost: 15000,
            rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 },
			orbitDuration: 1900, startAngle: 60,
			orbitWidth: 2520, orbitHeight: 2800, offsetY: -250,  orbitColor: 'rgba(220, 220, 220, 0.4)', orbitParent: 'kerbol',
            units: {
                miner: { baseCost: 80000, costMult: 1.3, owned: 0, basePower: 450, max: 100 },
                supplyDepot: { baseCost: 110000, costMult: 1.25, owned: 0, basePower: 1400, max: 50 },
                exoticIceSale: { baseCost: 150000, costMult: 1.25, owned: 0, basePower: 2000, max: 50 },
                deepIceDrill: { baseCost: 200000, costMult: 1.3, owned: 0, basePower: 2800, max: 50 },
                cryoLab: { baseCost: 80000, costMult: 1.3, owned: 0, basePower: 280, max: 50 },
                longCryoLab: { baseCost: 130000, costMult: 1.3, owned: 0, basePower: 450, max: 50 },
                commNetRelayUnit: { baseCost: 2500, costMult: 1.3, owned: 0, basePower: 10, max: 50 }
            }
        }
    }
};

function formatNumber(num) {
    if (num < 1000) return Math.floor(num).toString();
    if (num < 1000000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    if (num < 1000000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num < 1000000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    return (num / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
}

const contracts = [
    { id: 'start_funds', title: "The Space Program", desc: `Collect your first ${formatNumber(10)} ${ICON_FUNDS}`, condition: () => gameData.funds >= 10, rewardText: `+${formatNumber(10)} ${ICON_SCI}`, reward: () => gameData.science += 10, current: () => Math.min(Math.floor(gameData.funds), 10), target: 10 },
    { id: 'lifetime_100', title: "Funding Milestone", desc: `Earn a total of ${formatNumber(100)} ${ICON_FUNDS} (Lifetime)`, condition: () => gameData.totalFundsEarned >= 100, rewardText: `+${formatNumber(25)} ${ICON_SCI}`, reward: () => gameData.science += 25, current: () => Math.min(Math.floor(gameData.totalFundsEarned), 100), target: 100 },
    { id: 'sci_basics', req: 'start_funds', title: "Scientific Foundations", desc: "Build a Science Lab on Kerbin", condition: () => gameData.planets.kerbin.units.scienceLab.owned >= 1, rewardText: `+${formatNumber(500)} ${ICON_FUNDS}`, reward: () => gameData.funds += 500, current: () => Math.min(gameData.planets.kerbin.units.scienceLab.owned, 1), target: 1 },
    { id: 'tourism', req: 'start_funds', title: "Tourism Boom", desc: "Build 5 Tourist Hotels on Kerbin", condition: () => gameData.planets.kerbin.units.touristHotel.owned >= 5, rewardText: `+${formatNumber(2000)} ${ICON_FUNDS}`, reward: () => gameData.funds += 2000, current: () => Math.min(gameData.planets.kerbin.units.touristHotel.owned, 5), target: 5 },
    { id: 'mun_unlock', req: 'sci_basics', title: "Mun Mission", desc: "Unlock the Mun", condition: () => gameData.planets.mun.unlocked, rewardText: `+${formatNumber(50)} ${ICON_SCI}`, reward: () => gameData.science += 50, current: () => gameData.planets.mun.unlocked ? 1 : 0, target: 1 },
    { id: 'kk_base', req: 'sci_basics', title: "Project: Extraterrestrial Base", desc: "Research 'Kerbal Konstructs' in the R&D Center", condition: () => gameData.upgrades.kerbalKonstructs.unlocked, rewardText: `+${formatNumber(10000)} ${ICON_FUNDS}`, reward: () => gameData.funds += 10000, current: () => gameData.upgrades.kerbalKonstructs.unlocked ? 1 : 0, target: 1 },
    { id: 'commnet', req: 'sci_basics', title: "CommNet Optimization", desc: "Research 'CommNet Relay'", condition: () => gameData.upgrades.commNetRelay.unlocked, rewardText: `+${formatNumber(1000)} ${ICON_FUNDS}`, reward: () => gameData.funds += 1000, current: () => gameData.upgrades.commNetRelay.unlocked ? 1 : 0, target: 1 },
    { 
        id: 'commnet_kerbin', 
        req: 'commnet', 
        title: "Kerbin System CommNet", 
        desc: "Build at least 1 CommNet Relay on every celestial body in the Kerbin system.", 
        condition: () => {
            const bodies = ['kerbin', 'mun', 'minmus'];
            let total = 0;
            let completed = 0;
            
            for (const pKey of bodies) {
                const planet = gameData.planets[pKey];
                if (!planet) continue;
                total++;
                if (!planet.units || !planet.units.commNetRelayUnit || planet.units.commNetRelayUnit.owned === 0) continue;
                completed++;
            }
            return total > 0 && completed >= total;
        }, 
        rewardText: `+${formatNumber(2000)} ${ICON_SCI}`, 
        reward: () => gameData.science += 2000, 
        current: () => {
            const bodies = ['kerbin', 'mun', 'minmus'];
            let completed = 0;
            for (const pKey of bodies) {
                const planet = gameData.planets[pKey];
                if (!planet) continue;
                if (!planet.units || !planet.units.commNetRelayUnit || planet.units.commNetRelayUnit.owned === 0) continue;
                completed++;
            }
            return completed;
        }, 
        target: 3 
    },
    { 
        id: 'commnet_jool', 
        req: 'commnet_kerbin', 
        title: "Jool System CommNet", 
        desc: "Build at least 1 CommNet Relay on every celestial body in the Jool system.", 
        condition: () => {
            const bodies = ['jool', 'laythe', 'vall', 'tylo', 'bop', 'pol'];
            let total = 0;
            let completed = 0;
            
            for (const pKey of bodies) {
                const planet = gameData.planets[pKey];
                if (!planet) continue;
                total++;
                if (!planet.units || !planet.units.commNetRelayUnit || planet.units.commNetRelayUnit.owned === 0) continue;
                completed++;
            }
            return total > 0 && completed >= total;
        }, 
        rewardText: `+${formatNumber(10000)} ${ICON_SCI}`, 
        reward: () => gameData.science += 10000, 
        current: () => {
            const bodies = ['jool', 'laythe', 'vall', 'tylo', 'bop', 'pol'];
            let completed = 0;
            for (const pKey of bodies) {
                const planet = gameData.planets[pKey];
                if (!planet) continue;
                if (!planet.units || !planet.units.commNetRelayUnit || planet.units.commNetRelayUnit.owned === 0) continue;
                completed++;
            }
            return completed;
        }, 
        target: 6 
    },
	{ id: 'pr_upgrade', req: 'tourism', title: "Public Relations", desc: "Research 'Public Relations Office' in the R&D Center", condition: () => gameData.upgrades.publicRelations.unlocked, rewardText: `+${formatNumber(500)} ${ICON_SCI}`, reward: () => gameData.science += 500, current: () => gameData.upgrades.publicRelations.unlocked ? 1 : 0, target: 1 },
    { id: 'mun_rovers', req: 'mun_unlock', title: "Mun Rover Fleet", desc: "Send 3 Science Rovers to the Mun", condition: () => gameData.planets.mun.units.rover.owned >= 3, rewardText: `+${formatNumber(100)} ${ICON_SCI}`, reward: () => gameData.science += 100, current: () => Math.min(gameData.planets.mun.units.rover.owned, 3), target: 3 },
    { id: 'he3_mining', req: 'mun_unlock', title: "Helium-3 Market Leadership", desc: "Build the first Helium-3 Extractor on the Mun", condition: () => gameData.planets.mun.units.he3Extractor.owned >= 1, rewardText: `+${formatNumber(5000)} ${ICON_FUNDS}`, reward: () => gameData.funds += 5000, current: () => gameData.planets.mun.units.he3Extractor.owned >= 1 ? 1 : 0, target: 1 },
    { id: 'lifetime_1000', req: 'lifetime_100', title: "Funding Milestone II", desc: `Earn a total of ${formatNumber(1000)} ${ICON_FUNDS} (Lifetime)`, condition: () => gameData.totalFundsEarned >= 1000, rewardText: `+${formatNumber(100)} ${ICON_SCI}`, reward: () => gameData.science += 100, current: () => Math.min(Math.floor(gameData.totalFundsEarned), 1000), target: 1000 },
	{
        id: 'unlock_kerbol_system',
        req: 'mun_unlock',
        title: "Master of the Kerbol System",
        desc: "Unlock all celestial bodies in the Kerbol system.",
        condition: () => {
            let unlocked = 0;
            for (const pKey in gameData.planets) {
                if (!gameData.planets[pKey].unlocked) continue;
                unlocked++;
            }
            return unlocked >= 16;
        },
        rewardText: `+${formatNumber(25000)} ${ICON_SCI}`,
        reward: () => gameData.science += 25000,
        current: () => {
            let unlocked = 0;
            for (const pKey in gameData.planets) {
                if (!gameData.planets[pKey].unlocked) continue;
                unlocked++;
            }
            return unlocked;
        },
        target: 16
    },
	{ 
        id: 'deep_space_network', 
        req: 'commnet_jool', 
        title: "Deep Space Network", 
        desc: "Build at least 1 CommNet Relay on every celestial body.", 
        condition: () => {
            let count = 0;
            for (const pKey in gameData.planets) {
                const planet = gameData.planets[pKey];
                
                if (!planet.units) continue;
                if (!planet.units.commNetRelayUnit) continue;
                if (planet.units.commNetRelayUnit.owned === 0) continue;
                
                count++;
            }
            return count >= 16;
        }, 
        rewardText: `+${formatNumber(5000)} ${ICON_SCI}`, 
        reward: () => gameData.science += 5000, 
        current: () => {
            let count = 0;
            for (const pKey in gameData.planets) {
                const planet = gameData.planets[pKey];
                
                if (!planet.units) continue;
                if (!planet.units.commNetRelayUnit) continue;
                if (planet.units.commNetRelayUnit.owned === 0) continue;
                
                count++;
            }
            return count > 16 ? 16 : count;
        }, 
        target: 16 
    }
];