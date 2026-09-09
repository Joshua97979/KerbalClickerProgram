// data.js
// Enthält alle statischen Spieldaten und Konfigurationen. Diese Datei hat keine Abhängigkeiten zu DOM-Elementen.

const ICON_FUNDS = '<img src="textures/Funds_Icon.png" alt="Funds" class="resource-icon">';
const ICON_SCI = '<img src="textures/Science_Icon.png" alt="Science" class="resource-icon">';

const warpThresholds = [0, 1000, 100000, 10000000];
const warpLevels = [1, 4, 10, 20];

const unitDOMMapping = {
    rocket: { cardId: 'rocket-card', prefix: 'rocket', isClick: true, isRocket: true, title: '🚀 Rocket Launch (Click)', btnText: 'Add Moar Boosters!' },
    // Moho
    solarPowerPlant: { cardId: 'solar-power-plant-card', prefix: 'solar-power-plant', title: '☀️ Solar Power Plant', yieldResource: 'funds', btnText: 'Construct' },
    heatShieldProd: { cardId: 'heat-shield-prod-card', prefix: 'heat-shield-prod', title: '🛡️ Heat Shield Production', yieldResource: 'funds', btnText: 'Build' },
    solarObsPlatform: { cardId: 'solar-obs-platform-card', prefix: 'solar-obs-platform', title: '🔭 Solar Observation Platform', yieldResource: 'science', btnText: 'Construct' },
    // Eve
    spaceElevator: { cardId: 'space-elevator-card', prefix: 'space-elevator', title: '🗼 Space Elevator', yieldResource: 'funds', btnText: 'Construct', req: 'spaceElevatorTech' },
    sstoFreighter: { cardId: 'ssto-freighter-card', prefix: 'ssto-freighter', title: '✈️ SSTO Freighter', yieldResource: 'funds', btnText: 'Build' },
    mysteryGoo: { cardId: 'mystery-goo-card', prefix: 'mystery-goo', title: '🧪 Mystery Goo™ Surface Experiment', yieldResource: 'science', btnText: 'Deploy' },
    // Gilly
    parachuteProd: { cardId: 'parachute-prod-card', prefix: 'parachute-prod', title: '🪂 Parachute Production', yieldResource: 'funds', btnText: 'Build' },
    lowGravGolfCourse: { cardId: 'low-grav-golf-card', prefix: 'low-grav-golf', title: '⛳ Low-Gravity Golf Course', yieldResource: 'funds', btnText: 'Open Course' },
    // Kerbin
    hotel: { cardId: 'hotel-card', prefix: 'hotel', title: '🏨 H.O.T.E.L.', yieldResource: 'funds', btnText: 'Launch Module' },
    kerbalTraining: { cardId: 'training-card', prefix: 'training', title: '🏫 Kerbal Training Center', yieldResource: 'science', btnText: 'Build Center' },
    // Mun
    he3Extractor: { cardId: 'he3-card', prefix: 'he3', title: '🏭 Helium-3 Extractor', yieldResource: 'funds', btnText: 'Build', req: 'unlockHe3' },
    regolithLab: { cardId: 'regolith-lab-card', prefix: 'regolith-lab', title: '🔬 Regolith Laboratory', yieldResource: 'science', btnText: 'Build Lab' },
    // Minmus
    mintIceCream: { cardId: 'mint-ice-cream-card', prefix: 'mint-ice-cream', title: '🍦 Mint Ice Cream Extractor', yieldResource: 'funds', btnText: 'Extract' },
    jetpackCourse: { cardId: 'jetpack-course-card', prefix: 'jetpack-course', title: '🎒 Jetpack Obstacle Course', yieldResource: 'funds', btnText: 'Build' },
    // Duna
    spaceyLifter: { cardId: 'spacey-lifter-card', prefix: 'spacey-lifter', title: '🚀 SpaceY Heavy Booster', yieldResource: 'funds', btnText: 'Launch' },
    duneBuggyRally: { cardId: 'dune-buggy-card', prefix: 'dune-buggy', title: '🏎️ Dune Buggy Rally', yieldResource: 'funds', btnText: 'Host Race' },
    rover: { cardId: 'rover-card', prefix: 'rover', title: '🚙 Autonomous Science Rover', yieldResource: 'science', btnText: 'Launch Rover', req: 'unlockRover' },
    // Ike
    craterResearch: { cardId: 'crater-research-card', prefix: 'crater-research', title: '🏗️ Ike Crater Research Base', yieldResource: 'science', btnText: 'Build Base' },
    telescopeObs: { cardId: 'telescope-card', prefix: 'telescope', title: '🔭 Tidal-Lock Telescope Observatory', yieldResource: 'science', btnText: 'Build Lab' },
    // Dres
    dresDenialCenter: { cardId: 'dres-denial-card', prefix: 'dres-denial', title: '🚫 Dres Denial Enforcement Center', yieldResource: 'funds', btnText: 'Fund' },
    amnesiaField: { cardId: 'amnesia-field-card', prefix: 'amnesia-field', title: '🌀 Amnesia Field Generator', yieldResource: 'science', btnText: 'Activate' },
    // Jool
    cloudCityHotel: { cardId: 'cloud-city-card', prefix: 'cloud-city', title: '☁️ Cloud City Hotel', yieldResource: 'funds', btnText: 'Construct' },
    he4Extractor: { cardId: 'he4-card', prefix: 'he4', title: '🏭 Helium-4 Extractor', yieldResource: 'funds', btnText: 'Build' },
    orbitalShipyard: { cardId: 'orbital-shipyard-card', prefix: 'orbital-shipyard', title: '🛠️ Orbital Shipyard', yieldResource: 'funds', btnText: 'Construct' },
    // Laythe
    submersible: { cardId: 'submersible-card', prefix: 'submersible', title: '🚤 Submersible', yieldResource: 'science', btnText: 'Launch' },
    greenhouse: { cardId: 'greenhouse-card', prefix: 'greenhouse', title: '🌱 Greenhouse', yieldResource: 'science', btnText: 'Construct' },
    tidalStation: { cardId: 'tidal-station-card', prefix: 'tidal-station', title: '🌊 Tidal Measurement Station', yieldResource: 'science', btnText: 'Build' },
    // Vall
    waterSample: { cardId: 'water-sample-card', prefix: 'water-sample', title: '💧 Water Sample Extractor', yieldResource: 'funds', btnText: 'Build' },
    raspberryIceCream: { cardId: 'raspberry-ice-cream-card', prefix: 'raspberry-ice-cream', title: '🍧 Raspberry Ice Cream Extractor', yieldResource: 'funds', btnText: 'Build' },
    iceCrystalFreighter: { cardId: 'ice-crystal-freighter-card', prefix: 'ice-crystal-freighter', title: '❄️ Ice Crystal VTOL Freighter', yieldResource: 'funds', btnText: 'Build' },
    // Tylo
    massCatapult: { cardId: 'mass-catapult-card', prefix: 'mass-catapult', title: '☄️ Catapult Launch Pad', yieldResource: 'funds', btnText: 'Construct' },
    gravioliDetector: { cardId: 'gravioli-detector-card', prefix: 'gravioli-detector', title: '📡 GRAVMAX Negative Gravioli Detector', yieldResource: 'science', btnText: 'Deploy' },
    // Bop
    lowGRoverTest: { cardId: 'low-g-rover-test-card', prefix: 'low-g-rover-test', title: '🛹 Low-G Rover Test-Ramp', yieldResource: 'funds', btnText: 'Build' },
    krakenContainment: { cardId: 'kraken-containment-card', prefix: 'kraken-containment', title: '🦑 Kraken Containment Facility', yieldResource: 'science', btnText: 'Contain' },
    // Pol
    fuelRefinery: { cardId: 'fuel-refinery-card', prefix: 'fuel-refinery', title: '⛽ Fuel Refinery Station', yieldResource: 'funds', btnText: 'Build' },
    lowGravMobility: { cardId: 'low-grav-mobility-card', prefix: 'low-grav-mobility', title: '🏎️ Low-Gravity Mobility Test Track', yieldResource: 'science', btnText: 'Build' },
    // Eeloo
    exoticIceCream: { cardId: 'exotic-ice-cream-card', prefix: 'exotic-ice-cream', title: '💎 Exotic Ice Cream Extractor', yieldResource: 'funds', btnText: 'Build' },
    cryoLab: { cardId: 'cryo-lab-card', prefix: 'cryo-lab', title: '❄️ Cryosleep Lab', yieldResource: 'science', btnText: 'Build Lab' }
};

function getUnitMultiplier(unitKey) {
    // Da alte Multiplikatoren (Avionics, SCANsat, Public Relations) entfernt wurden, 
    // gibt diese Funktion standardmäßig 1 zurück. Kann später für neue Synergien erweitert werden.
    return 1;
}

const gameData = {
    funds: 0, totalFundsEarned: 0, science: 0, totalScienceEarned: 0, maxWarpUnlocked: 0, missionTime: 0, selectedPlanet: null, claimedContracts: [], completedContracts: [], cachedTotalIncome: 0, cachedTotalScience: 0,
    asteroidsCaught: 0,
    hasLaunchedRocket: false,
    techDummies: [
        { id: 'dummy-1', source: 'strutsAndBoosters', target: 'krakenDrive', tier: 8, row: 1 },
        { id: 'dummy-2', source: 'spaceElevatorTech', target: 'krakenDrive', tier: 8, row: 2 }
    ],
    upgrades: {
        launchAbortSystem: { id: 'launchAbortSystem', name: 'Launch Abort System', cost: 50, unlocked: false, desc: 'Safety first! Doubles the yield of a manual click.', tier: 1, row: 3, req: [] },
        mechJeb: { id: 'mechJeb', name: 'MechJeb Autopilot', cost: 150, unlocked: false, desc: 'Automates the Manual Start (Click).', tier: 6, row: 3, req: ['unlockHe3'] },
        trackingStation: { id: 'trackingStation', name: 'Tracking Station', cost: 40, unlocked: false, desc: 'Deep space tracking network. Allows detection and collection of passing asteroids.', tier: 3, row: 2, req: ['commNet'] },
        longTermMissions: { id: 'longTermMissions', name: 'Long-Term Missions', cost: 1500, unlocked: false, desc: 'Increases Funds and Science income by +10% while in Time-Warp.', tier: 7, row: 3, req: ['mechJeb'] },
        unlockRover: { id: 'unlockRover', name: 'Rover Technology', cost: 50, unlocked: false, desc: 'Unlocks the Autonomous Science Rover on Duna', tier: 5, row: 6, req: ['drogueChute'] },
        unlockHe3: { id: 'unlockHe3', name: 'Helium-3 Extraction', cost: 1500, unlocked: false, desc: 'Unlocks the Helium-3 Extractor on the Mun', tier: 4, row: 3, req: ['commNet'] },
        commNet: { id: 'commNet', name: 'CommNet', cost: 1000, unlocked: false, desc: 'A global antenna and relay network. Increases global science income by +5% per successfully unlocked planet.', tier: 2, row: 3, req: ['launchAbortSystem'] },
        strutsAndBoosters: { id: 'strutsAndBoosters', name: 'Struts and Boosters', cost: 500, unlocked: false, desc: 'If it moves and it shouldn\'t: struts. If it doesn\'t move and it should: boosters. Reduces the total cost of all rocket components in the pre-mission panel by 50%.', tier: 7, row: 1, req: ['veryHeavyRocketry'] },
        veryHeavyRocketry: { id: 'veryHeavyRocketry', name: 'Very Heavy Rocketry', cost: 2500, unlocked: false, desc: 'Because "Heavy Rocketry" was just the starting line. Doubles the maximum upgrade level of all rocket components from 5 to 10.', tier: 6, row: 1, req: ['valentinasCoffee'] },
        valentinasCoffee: { id: 'valentinasCoffee', name: 'Valentina\'s Coffee Machine', cost: 800, unlocked: false, desc: 'Keeps the mission control staff wide awake and focused. Increases the success probability of all transfer missions by 10%.', tier: 5, row: 1, req: ['trackingStation'] },
        dartEngine: { id: 'dartEngine', name: 'Dart Aerospike Engine', cost: 3500, unlocked: false, desc: 'Advanced atmospheric propulsion. Necessary for travel to Eve.', tier: 9, row: 4, req: ['rtg'] },
        drogueChute: { id: 'drogueChute', name: 'Drogue Chute', cost: 3000, unlocked: false, desc: 'High-altitude parachute system. Necessary for a safe landing in Dunas thin atmosphere.', tier: 4, row: 5, req: ['commNet'] },
        radiators: { id: 'radiators', name: 'Radiators', cost: 4000, unlocked: false, desc: 'Heat dissipation systems. Necessary for travel to Moho.', tier: 5, row: 4, req: ['drogueChute'] },
        betterTelescopes: { id: 'betterTelescopes', name: 'Better Telescopes', cost: 10000, unlocked: false, desc: 'Advanced optical arrays. Finally proves the existence of a so-called "Dres".', tier: 7, row: 4, req: ['aerocapture', 'radiators'] },
        aerocapture: { id: 'aerocapture', name: 'Aerocapture Maneuver', cost: 15000, unlocked: false, desc: 'Advanced orbital mechanics. Necessary for travel to Jool.', tier: 6, row: 5, req: ['drogueChute'] },
        spaceElevatorTech: { id: 'spaceElevatorTech', name: 'Space Elevator', cost: 20000, unlocked: false, desc: 'A massive orbital tether. Unlocks the Space Elevator on Kerbin and Eve.', tier: 6, row: 2, req: ['unlockHe3'] },
        rapierEngine: { id: 'rapierEngine', name: 'R.A.P.I.E.R. Engine', cost: 25000, unlocked: false, desc: 'Hybrid propulsion system. Necessary for travel to Laythe.', tier: 7, row: 6, req: ['aerocapture'] },
        rtg: { id: 'rtg', name: 'Radioisotope Thermoelectric Generator', cost: 30000, unlocked: false, desc: 'Reliable deep space power. Necessary for travel to Eeloo.', tier: 8, row: 5, req: ['betterTelescopes', 'rapierEngine'] },
        krakenDrive: { id: 'krakenDrive', name: 'Kraken Drive', cost: 100000, unlocked: false, desc: 'Experimental spacetime manipulation. Increases the last warp level from x20 to x22.', tier: 11, row: 3, req: ['dartEngine', 'longTermMissions', 'spaceElevatorTech', 'strutsAndBoosters'] }
    },
    planets: {
        kerbol: { id: 'kerbol', name: 'Kerbol', unlocked: true, desc: 'The massive central star of the system. The inexhaustible source of all light and heat.', unlockCost: 0, units: {} },
        moho: {
            id: 'moho', name: 'Moho', desc: 'The closest planet to Kerbol, baked by intense solar radiation and stripped of an atmosphere.',
            unlocked: false, unlockCost: 7500, unlockReq: 'radiators', unlockTime: 420, isUnlocking: false, unlockProgress: 0, baseTransferChance: 0.15, rocketUpgradeBaseCost: 2500, rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, orbitDuration: 100, startAngle: 340, orbitWidth: 190, orbitHeight: 200, offsetY: -30, orbitColor: 'rgba(155, 126, 103, 0.5)', orbitParent: 'kerbol',
            units: {
                solarPowerPlant: { baseCost: 45000, costMult: 1.25, owned: 0, basePower: 400, max: 50 },
                heatShieldProd: { baseCost: 15000, costMult: 1.25, owned: 0, basePower: 120, max: 50 },
                solarObsPlatform: { baseCost: 20000, costMult: 1.3, owned: 0, basePower: 70, max: 50 }
            }
        },
        eve: {
            id: 'eve', name: 'Eve', desc: 'A dense, purple planet with a crushing atmosphere and extremely high gravity.',
            unlocked: false, unlockCost: 7500, unlockReq: 'dartEngine', unlockTime: 420, isUnlocking: false, unlockProgress: 0, baseTransferChance: 0.15, rocketUpgradeBaseCost: 2500, rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, orbitDuration: 140, startAngle: 150, orbitWidth: 400, orbitHeight: 400, offsetY: 0, orbitColor: 'rgba(162, 75, 162, 0.5)', orbitParent: 'kerbol',
            units: {
                spaceElevator: { baseCost: 25000, costMult: 1.25, owned: 0, basePower: 300, max: 50 },
                sstoFreighter: { baseCost: 85000, costMult: 1.25, owned: 0, basePower: 1000, max: 50 },
                mysteryGoo: { baseCost: 15000, costMult: 1.25, owned: 0, basePower: 50, max: 50 }
            }
        },
        gilly: {
            id: 'gilly', name: 'Gilly', desc: 'A tiny, potato-shaped asteroid captured by Eves gravity.',
            unlocked: false, unlockCost: 1000, planetReq: 'eve', unlockTime: 420, isUnlocking: false, unlockProgress: 0, baseTransferChance: 0.20, rocketUpgradeBaseCost: 1000, rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, orbitDuration: 60, startAngle: 60, orbitWidth: 90, orbitHeight: 90, offsetY: 0, orbitColor: 'rgba(171, 131, 123, 0.5)', orbitParent: 'eve',
            units: {
                parachuteProd: { baseCost: 10000, costMult: 1.2, owned: 0, basePower: 110, max: 50 },
                lowGravGolfCourse: { baseCost: 15000, costMult: 1.2, owned: 0, basePower: 150, max: 50 }
            }
        },
        kerbin: {
            id: 'kerbin', name: 'Kerbin', desc: 'Our beloved homeworld. A blue planet with perfect conditions for Kerbal life.',
            unlocked: true, unlockCost: 0, orbitDuration: 200, startAngle: 90, orbitWidth: 650, orbitHeight: 650, offsetY: 0, orbitColor: 'rgba(149, 192, 184, 0.7)', orbitParent: 'kerbol',
            units: {
                rocket: { baseCost: 10, costMult: 1.15, owned: 1, basePower: 1, max: 50 },
                hotel: { baseCost: 2500, costMult: 1.2, owned: 0, basePower: 40, max: 50 },
                spaceElevator: { baseCost: 25000, costMult: 1.25, owned: 0, basePower: 300, max: 50 },
                kerbalTraining: { baseCost: 1500, costMult: 1.3, owned: 0, basePower: 15, max: 50 }
																									 
            }
        },
        mun: {
            id: 'mun', name: 'Mun', desc: 'The loyal companion of Kerbin. A dusty moon covered in deep craters.',
            unlocked: false, unlockCost: 1000, planetReq: 'kerbin', unlockTime: 30, isUnlocking: false, unlockProgress: 0, baseTransferChance: 0.15, rocketUpgradeBaseCost: 250, rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, orbitDuration: 60, startAngle: 45, orbitWidth: 90, orbitHeight: 90, offsetY: 0, orbitColor: 'rgba(126, 126, 126, 0.7)', orbitParent: 'kerbin',
            units: {
                he3Extractor: { baseCost: 8000, costMult: 1.25, owned: 0, basePower: 100, max: 50 },
                regolithLab: { baseCost: 1200, costMult: 1.3, owned: 0, basePower: 6, max: 50 }
            }
        },
        minmus: {
            id: 'minmus', name: 'Minmus', desc: 'A tiny, mint-green moon. Researchers still speculate whether it is made of mint ice cream.',
            unlocked: false, unlockCost: 2500, planetReq: 'kerbin', unlockTime: 60, isUnlocking: false, unlockProgress: 0, baseTransferChance: 0.15, rocketUpgradeBaseCost: 400, rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, orbitDuration: 110, startAngle: 230, orbitWidth: 140, orbitHeight: 140, offsetY: 0, orbitColor: 'rgba(162, 255, 204, 0.5)', orbitParent: 'kerbin',
            units: {
                mintIceCream: { baseCost: 3500, costMult: 1.2, owned: 0, basePower: 45, max: 50 },
                jetpackCourse: { baseCost: 4500, costMult: 1.2, owned: 0, basePower: 60, max: 50 }
            }
        },
        duna: {
            id: 'duna', name: 'Duna', desc: 'The rusty red desert planet. Its thin atmosphere requires giant parachutes for a safe landing.',
            unlocked: false, unlockCost: 15000, unlockReq: 'drogueChute', unlockTime: 120, isUnlocking: false, unlockProgress: 0, baseTransferChance: 0.10, rocketUpgradeBaseCost: 4000, rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, orbitDuration: 350, startAngle: 290, orbitWidth: 950, orbitHeight: 950, offsetY: 0, orbitColor: 'rgba(212, 60, 25, 0.5)', orbitParent: 'kerbol',
            units: {
                spaceyLifter: { baseCost: 28000, costMult: 1.25, owned: 0, basePower: 350, max: 50 },
                duneBuggyRally: { baseCost: 32000, costMult: 1.25, owned: 0, basePower: 400, max: 50 },
                rover: { baseCost: 5000, costMult: 1.2, owned: 0, basePower: 20, max: 50 }
            }
        },
        ike: {
            id: 'ike', name: 'Ike', desc: 'A dark, rocky moon tightly bound to Duna, often blocking its sunlight.',
            unlocked: false, unlockCost: 20000, planetReq: 'duna', unlockTime: 145, isUnlocking: false, unlockProgress: 0, baseTransferChance: 0.15, rocketUpgradeBaseCost: 5000, rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, orbitDuration: 50, startAngle: 30, orbitWidth: 120, orbitHeight: 120, offsetY: 0, orbitColor: 'rgba(180, 180, 180, 0.5)', orbitParent: 'duna',
            units: {
                craterResearch: { baseCost: 15000, costMult: 1.3, owned: 0, basePower: 45, max: 50 },
                telescopeObs: { baseCost: 18000, costMult: 1.3, owned: 0, basePower: 60, max: 50 }
            }
        },
        dres: {
            id: 'dres', name: 'Dres', desc: 'The forgotten world drifting quietly in the asteroid belt between Duna and Jool.',
            unlocked: false, unlockCost: 15000, unlockReq: 'betterTelescopes', unlockTime: 420, isUnlocking: false, unlockProgress: 0, baseTransferChance: 0.05, rocketUpgradeBaseCost: 6000, rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, orbitDuration: 800, startAngle: 170, orbitWidth: 1440, orbitHeight: 1600, offsetY: 100, orbitColor: 'rgba(89, 63, 48, 0.7)', orbitParent: 'kerbol',
            units: {
                dresDenialCenter: { baseCost: 40000, costMult: 1.25, owned: 0, basePower: 500, max: 50 },
                amnesiaField: { baseCost: 35000, costMult: 1.3, owned: 0, basePower: 120, max: 50 }
            }
        },
        jool: {
            id: 'jool', name: 'Jool', desc: 'A giant gas planet with an unmistakable green color. The gravitational heart of the outer system.',
            unlocked: false, unlockCost: 50000, unlockReq: 'aerocapture', unlockTime: 420, isUnlocking: false, unlockProgress: 0, baseTransferChance: 0.05, rocketUpgradeBaseCost: 10000, rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, orbitDuration: 1200, startAngle: 280, orbitWidth: 2410, orbitHeight: 2410, offsetY: 0, orbitColor: 'rgba(75, 203, 75, 0.5)', orbitParent: 'kerbol',
            units: {
                cloudCityHotel: { baseCost: 90000, costMult: 1.25, owned: 0, basePower: 1200, max: 50 },
                he4Extractor: { baseCost: 120000, costMult: 1.3, owned: 0, basePower: 1600, max: 50 },
                orbitalShipyard: { baseCost: 150000, costMult: 1.3, owned: 0, basePower: 2000, max: 50 }
            }
        },
        laythe: {
            id: 'laythe', name: 'Laythe', desc: 'An inner, ocean-covered moon with an oxygen-rich atmosphere orbiting the gas giant Jool.',
            unlocked: false, unlockCost: 60000, planetReq: 'jool', unlockReq: 'rapierEngine', unlockTime: 420, isUnlocking: false, unlockProgress: 0, baseTransferChance: 0.10, rocketUpgradeBaseCost: 12000, rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, orbitDuration: 70, startAngle: 180, orbitWidth: 120, orbitHeight: 120, offsetY: 0, orbitColor: 'rgba(18, 86, 130, 0.5)', orbitParent: 'jool',
            units: {
                submersible: { baseCost: 55000, costMult: 1.3, owned: 0, basePower: 190, max: 50 },
                greenhouse: { baseCost: 65000, costMult: 1.3, owned: 0, basePower: 220, max: 50 },
                tidalStation: { baseCost: 75000, costMult: 1.3, owned: 0, basePower: 260, max: 50 }
            }
        },
        vall: {
            id: 'vall', name: 'Vall', desc: 'A frozen, icy moon orbiting Jool with a thick, icy crust concealing a hidden subsurface ocean.',
            unlocked: false, unlockCost: 1000, planetReq: 'jool', unlockTime: 420, isUnlocking: false, unlockProgress: 0, baseTransferChance: 0.10, rocketUpgradeBaseCost: 12000, rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, orbitDuration: 110, startAngle: 90, orbitWidth: 180, orbitHeight: 180, offsetY: 0, orbitColor: 'rgba(107, 131, 143, 0.5)', orbitParent: 'jool',
            units: {
                waterSample: { baseCost: 20000, costMult: 1.25, owned: 0, basePower: 250, max: 50 },
                raspberryIceCream: { baseCost: 25000, costMult: 1.25, owned: 0, basePower: 320, max: 50 },
                iceCrystalFreighter: { baseCost: 35000, costMult: 1.25, owned: 0, basePower: 450, max: 50 }
            }
        },
        tylo: {
            id: 'tylo', name: 'Tylo', desc: 'The giant, airless moon of Jool with a surface gravity matching Kerbins.',
            unlocked: false, unlockCost: 1000, planetReq: 'jool', unlockTime: 420, isUnlocking: false, unlockProgress: 0, baseTransferChance: 0.05, rocketUpgradeBaseCost: 15000, rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, orbitDuration: 180, startAngle: 160, orbitWidth: 260, orbitHeight: 260, offsetY: 0, orbitColor: 'rgba(174, 175, 177, 0.5)', orbitParent: 'jool',
            units: {
                massCatapult: { baseCost: 100000, costMult: 1.25, owned: 0, basePower: 800, max: 50 },
                gravioliDetector: { baseCost: 80000, costMult: 1.3, owned: 0, basePower: 300, max: 50 }
            }
        },
        bop: {
            id: 'bop', name: 'Bop', desc: 'A captured, irregularly shaped asteroid moon wandering the outer edges of the Jool system.',
            unlocked: false, unlockCost: 1000, planetReq: 'jool', unlockTime: 420, isUnlocking: false, unlockProgress: 0, baseTransferChance: 0.85, rocketUpgradeBaseCost: 15000, rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, orbitDuration: 280, startAngle: 40, orbitWidth: 360, orbitHeight: 360, offsetY: 0, orbitColor: 'rgba(63, 54, 52, 0.5)', orbitParent: 'jool',
            units: {
                lowGRoverTest: { baseCost: 40000, costMult: 1.25, owned: 0, basePower: 450, max: 50 },
                krakenContainment: { baseCost: 60000, costMult: 1.3, owned: 0, basePower: 250, max: 50 }
            }
        },
        pol: {
            id: 'pol', name: 'Pol', desc: 'The smallest and outermost moon of Jool, resembling a dusty pollen grain floating in space.',
            unlocked: false, unlockCost: 1000, planetReq: 'jool', unlockTime: 420, isUnlocking: false, unlockProgress: 0, baseTransferChance: 0.85, rocketUpgradeBaseCost: 15000, orbitDuration: 400, startAngle: 300, orbitWidth: 475, orbitHeight: 500, offsetY: 30, orbitColor: 'rgba(223, 162, 115, 0.4)', orbitParent: 'jool',
            units: {
                fuelRefinery: { baseCost: 35000, costMult: 1.25, owned: 0, basePower: 380, max: 50 },
                lowGravMobility: { baseCost: 45000, costMult: 1.3, owned: 0, basePower: 200, max: 50 }
            }
        },
        eeloo: {
            id: 'eeloo', name: 'Eeloo', desc: 'A white, ice-covered dwarf planet at the edge of the system.',
            unlocked: false, unlockCost: 100000, unlockReq: 'rtg', unlockTime: 420, isUnlocking: false, unlockProgress: 0, baseTransferChance: 0.85, rocketUpgradeBaseCost: 15000, rocketUpgrades: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, orbitDuration: 1900, startAngle: 60, orbitWidth: 2520, orbitHeight: 2800, offsetY: -250, orbitColor: 'rgba(220, 220, 220, 0.4)', orbitParent: 'kerbol',
            units: {
                exoticIceCream: { baseCost: 150000, costMult: 1.25, owned: 0, basePower: 2000, max: 50 },
                cryoLab: { baseCost: 130000, costMult: 1.3, owned: 0, basePower: 450, max: 50 }
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
    { 
        id: 'sci_basics', req: 'start_funds', title: "Scientific Foundations", desc: "Build a Kerbal Training Center on Kerbin", 
        condition: () => {
            if (!gameData.planets.kerbin.units.kerbalTraining) return false;
            return gameData.planets.kerbin.units.kerbalTraining.owned >= 1;
        }, 
        rewardText: `+${formatNumber(500)} ${ICON_FUNDS}`, reward: () => gameData.funds += 500, 
        current: () => {
            if (!gameData.planets.kerbin.units.kerbalTraining) return 0;
            return Math.min(gameData.planets.kerbin.units.kerbalTraining.owned, 1);
        }, target: 1 
    },
    { 
        id: 'tourism', req: 'start_funds', title: "Tourism Boom", desc: "Build 5 H.O.T.E.L.s on Kerbin", 
        condition: () => {
            if (!gameData.planets.kerbin.units.hotel) return false;
            return gameData.planets.kerbin.units.hotel.owned >= 5;
        }, 
        rewardText: `+${formatNumber(2000)} ${ICON_FUNDS}`, reward: () => gameData.funds += 2000, 
        current: () => {
            if (!gameData.planets.kerbin.units.hotel) return 0;
            return Math.min(gameData.planets.kerbin.units.hotel.owned, 5);
        }, target: 5 
    },
    {
        id: 'max_unit_upgrade', req: 'tourism', title: "Maximum Capacity", desc: "Upgrade any unit to its maximum level",
        condition: () => {
            for (const pKey in gameData.planets) {
                const planet = gameData.planets[pKey];
                if (!planet || !planet.units) continue;

                for (const uKey in planet.units) {
                    const unit = planet.units[uKey];
                    if (!unit) continue;
                    if (unit.owned >= unit.max) return true;
                }
            }
            return false;
        },
        rewardText: `+${formatNumber(5000)} ${ICON_FUNDS}`, reward: () => gameData.funds += 5000,
        current: () => {
            for (const pKey in gameData.planets) {
                const planet = gameData.planets[pKey];
                if (!planet || !planet.units) continue;

                for (const uKey in planet.units) {
                    const unit = planet.units[uKey];
                    if (!unit) continue;
                    if (unit.owned >= unit.max) return 1;
                }
            }
            return 0;
        }, target: 1
    },
    { 
        id: 'first_rocket_launch', req: 'sci_basics', title: "First Rocket Launch", desc: "Launch your first transfer rocket to another celestial body", 
        condition: () => !!gameData.hasLaunchedRocket, 
        rewardText: `+${formatNumber(1000)} ${ICON_FUNDS}`, reward: () => gameData.funds += 1000, 
        current: () => gameData.hasLaunchedRocket ? 1 : 0, target: 1 
    },
    { id: 'mun_unlock', req: 'first_rocket_launch', title: "Mun Mission", desc: "Unlock the Mun", condition: () => gameData.planets.mun.unlocked, rewardText: `+${formatNumber(50)} ${ICON_SCI}`, reward: () => gameData.science += 50, current: () => gameData.planets.mun.unlocked ? 1 : 0, target: 1 },
    { id: 'duna_unlock', req: 'mun_unlock', title: "Red Planet Expedition", desc: "Unlock Duna", condition: () => gameData.planets.duna.unlocked, rewardText: `+${formatNumber(500)} ${ICON_SCI}`, reward: () => gameData.science += 500, current: () => gameData.planets.duna.unlocked ? 1 : 0, target: 1 },
    { id: 'commnet', req: 'sci_basics', title: "CommNet Optimization", desc: "Research 'CommNet' in the R&D Center", condition: () => gameData.upgrades.commNet.unlocked, rewardText: `+${formatNumber(1000)} ${ICON_FUNDS}`, reward: () => gameData.funds += 1000, current: () => gameData.upgrades.commNet.unlocked ? 1 : 0, target: 1 },
    { id: 'unlock_tracking_station', req: 'commnet', title: "Tracking Station", desc: "Research 'Tracking Station' in the R&D Center", condition: () => gameData.upgrades.trackingStation.unlocked, rewardText: `+${formatNumber(1500)} ${ICON_FUNDS}`, reward: () => gameData.funds += 1500, current: () => gameData.upgrades.trackingStation.unlocked ? 1 : 0, target: 1 },
    { 
        id: 'catch_asteroids', req: 'unlock_tracking_station', title: "Asteroid Capture", desc: "Catch 10 passing asteroids on the map", 
        condition: () => (gameData.asteroidsCaught || 0) >= 10, 
        rewardText: `+${formatNumber(200)} ${ICON_SCI}`, reward: () => gameData.science += 200, 
        current: () => Math.min(gameData.asteroidsCaught || 0, 10), target: 10 
    },
    { 
        id: 'duna_rovers', req: 'mun_unlock', title: "Duna Rover Fleet", desc: "Send 3 Science Rovers to Duna", 
        condition: () => {
            if (!gameData.planets.duna.units.rover) return false;
            return gameData.planets.duna.units.rover.owned >= 3;
        }, 
        rewardText: `+${formatNumber(100)} ${ICON_SCI}`, reward: () => gameData.science += 100, 
        current: () => {
            if (!gameData.planets.duna.units.rover) return 0;
            return Math.min(gameData.planets.duna.units.rover.owned, 3);
        }, target: 3 
    },
    { 
        id: 'he3_mining', req: 'mun_unlock', title: "Helium-3 Market Leadership", desc: "Build the first Helium-3 Extractor on the Mun", 
        condition: () => {
            if (!gameData.planets.mun.units.he3Extractor) return false;
            return gameData.planets.mun.units.he3Extractor.owned >= 1;
        }, 
        rewardText: `+${formatNumber(5000)} ${ICON_FUNDS}`, reward: () => gameData.funds += 5000, 
        current: () => {
            if (!gameData.planets.mun.units.he3Extractor) return 0;
            return gameData.planets.mun.units.he3Extractor.owned >= 1 ? 1 : 0;
        }, target: 1 
    },
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
    }
];