let isResetting = false;
let wasDragging = false; 
let cameraTarget = 'kerbol'; 
let isPaused = false;

let currentWarpIndex = 0;
let currentBuyMode = 1;

// DOM Cache-Objekte zur Vermeidung von Layout-Thrashing & redundanten DOM-Lookups
const wrapperCache = {};
const targetElCache = {};

function getWrapperEl(pKey) {
    if (!wrapperCache[pKey]) {
        wrapperCache[pKey] = document.getElementById(`wrapper-${pKey}`);
    }
    return wrapperCache[pKey];
}

function getTargetEl(targetId) {
    if (!targetElCache[targetId]) {
        targetElCache[targetId] = document.getElementById(targetId);
    }
    return targetElCache[targetId];
}

// Planeten-Positionen anhand der game time berechnen
function updatePlanetsPositions() {
    if (typeof gameData === 'undefined') return;
    if (!gameData.planets) return;

    for (const pKey in gameData.planets) {
        const p = gameData.planets[pKey];
        
        if (!p) continue;
        if (p.orbitDuration === undefined) continue;

        const wrapperEl = getWrapperEl(pKey);
        if (!wrapperEl) continue;

        const startAngle = p.startAngle || 0;
        const timeInOrbit = (gameData.missionTime || 0) % p.orbitDuration;
        const progress = timeInOrbit / p.orbitDuration;
        const startProgress = startAngle / 360;
        
        const currentProgress = (progress + startProgress) % 1.0;
        const angleRad = currentProgress * 2 * Math.PI;
        
        const rx = (p.orbitWidth || 0) / 2;
        const ry = (p.orbitHeight || 0) / 2;
        const offsetY = p.offsetY || 0;

        const x = rx * Math.cos(angleRad);
        const y = -ry * Math.sin(angleRad) + offsetY;

        wrapperEl.style.position = 'absolute';
        wrapperEl.style.left = '50%';
        wrapperEl.style.top = '50%';
        wrapperEl.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    }
}

function updateApsisMarkers() {
    const apMarker = document.getElementById('global-ap-marker');
    const peMarker = document.getElementById('global-pe-marker');
    
    if (!apMarker) return;
    if (!peMarker) return;

    const pId = gameData.selectedPlanet;

    if (!pId || pId === 'kerbol') {
        apMarker.style.display = 'none';
        peMarker.style.display = 'none';
        return;
    }

    const p = gameData.planets[pId];

    if (!p || p.orbitHeight === undefined) {
        apMarker.style.display = 'none';
        peMarker.style.display = 'none';
        return;
    }

    apMarker.style.display = 'block';
    peMarker.style.display = 'block';
    
    const targetContainer = p.orbitParent === 'kerbol' 
        ? document.getElementById('map-content') 
        : getWrapperEl(p.orbitParent);

    if (!targetContainer) return;
    
    if (apMarker.parentElement !== targetContainer) targetContainer.appendChild(apMarker);
    if (peMarker.parentElement !== targetContainer) targetContainer.appendChild(peMarker);

    const radius = p.orbitHeight / 2;
    const offsetY = p.offsetY || 0;
    
    apMarker.style.top = `calc(50% - ${radius - offsetY}px - 18px)`;
    peMarker.style.top = `calc(50% + ${radius + offsetY}px - 18px)`;
}

// Funktion zum Zeichnen der SVG Orbits
function drawSvgOrbits() {
    if (typeof gameData === 'undefined') return;
    if (!gameData.planets) return;
    
    const svgLayer = document.getElementById('orbit-svg-layer');
    if (!svgLayer) return;

    svgLayer.innerHTML = '';
    document.querySelectorAll('.local-orbit-layer').forEach(layer => layer.remove());

    for (const pKey in gameData.planets) {
        const p = gameData.planets[pKey];
        if (!gameData.upgrades.betterTelescopes.unlocked && pKey === 'dres') continue;
        
        if (!p) continue;
        if (p.orbitHeight === undefined) continue;
        if (p.orbitWidth === undefined) continue;

        const rx = p.orbitWidth / 2;
        const ry = p.orbitHeight / 2;
        const offsetY = p.offsetY || 0;

        const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        ellipse.setAttribute('cx', 0);
        ellipse.setAttribute('cy', offsetY);
        ellipse.setAttribute('rx', rx);
        ellipse.setAttribute('ry', ry);
        ellipse.setAttribute('fill', 'none');
        
        const strokeColor = p.orbitColor;
        ellipse.setAttribute('stroke', strokeColor);
        ellipse.setAttribute('stroke-width', '1');
        ellipse.setAttribute('class', `svg-orbit svg-orbit-${pKey}`);
        
        if (p.orbitParent === 'kerbol') {
            svgLayer.appendChild(ellipse);
            continue;
        }

        const parentWrapper = getWrapperEl(p.orbitParent);
        if (!parentWrapper) continue;
        
        let localSvgLayer = parentWrapper.querySelector('.local-orbit-layer');
        if (!localSvgLayer) {
            localSvgLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            localSvgLayer.setAttribute('class', 'local-orbit-layer');
            localSvgLayer.setAttribute('style', 'position: absolute; top: 50%; left: 50%; overflow: visible; pointer-events: none; z-index: 0;');
            parentWrapper.insertBefore(localSvgLayer, parentWrapper.firstChild);
        }
        localSvgLayer.appendChild(ellipse);
    }
}
drawSvgOrbits();

function getWarpMultiplier(index) {
    if (index === 3 && gameData.upgrades.krakenDrive && gameData.upgrades.krakenDrive.unlocked) return 22;
    return warpLevels[index];
}

let lastTime = performance.now();
let uiFastTimer = 0;
let uiHeavyTimer = 0;
let floatTextTimer = 0;

function recalculateCache() {
    let totalInc = 0;
    let totalSci = 0;
    
    // CommNet generiert global +5% Science per erfolgreich freigeschaltetem Planet
    let commNetBonus = 1;
    if (gameData.upgrades.commNet && gameData.upgrades.commNet.unlocked) {
        let unlockedCount = 0;
        for (const key in gameData.planets) {
            if (gameData.planets[key].unlocked) unlockedCount++;
        }
        commNetBonus = 1 + (unlockedCount * 0.05);
    }
    
    for (const pKey in gameData.planets) {
        const p = gameData.planets[pKey];
        p.cachedIncome = 0;
        p.cachedScience = 0;
        if (!p.unlocked) continue;
        
        let pIncome = 0;
        let pScience = 0;
        
        if (pKey === 'kerbin' && gameData.upgrades.mechJeb.unlocked) {
            pIncome += getClickValue('kerbin');
        }
        
        for (const uKey in p.units) {
            const unit = p.units[uKey];
            if (!unit || unit.owned === 0) continue;
            
            const mapping = unitDOMMapping[uKey];
            if (!mapping) continue;
            
            const unitMult = getUnitMultiplier(uKey);
            const yieldAmount = unit.owned * unit.basePower * unitMult;
            
            if (mapping.yieldResource === 'funds') {
                pIncome += yieldAmount;
                continue;
            }
            
            if (mapping.yieldResource === 'science') {
                pScience += yieldAmount;
                continue;
            }
        }
        
        p.cachedIncome = pIncome;
        p.cachedScience = pScience;
        totalInc += pIncome;
        totalSci += pScience;
    }
    
    gameData.cachedTotalIncome = Math.floor(totalInc);
    gameData.cachedTotalScience = Math.floor(totalSci * commNetBonus);
}

function setCameraTarget(targetId) {
    cameraTarget = targetId;
}

function applyZoom(targetScale) {
    const clampedScale = Math.max(0.3, Math.min(targetScale, 6));
    if (clampedScale === mapScale) return;

    const scaleRatio = clampedScale / mapScale;
    mapScale = clampedScale;
    mapPanX *= scaleRatio;
    mapPanY *= scaleRatio;
    updateMapTransform();
}

// Karten-Zentrum cachen, um Layout Thrashing im Frame Loop zu vermeiden
let mapCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

function updateMapDimensions() {
    if (!mapSection) return;
    const rect = mapSection.getBoundingClientRect();
    mapCenter.x = rect.left + rect.width / 2;
    mapCenter.y = rect.top + rect.height / 2;
}
window.addEventListener('resize', updateMapDimensions);

function updateCameraStep() {
    if (!cameraTarget) return;
    if (isDraggingMap) return;

    const targetId = cameraTarget === 'kerbol' ? 'kerbol' : `planet-${cameraTarget}`;
    const targetEl = getTargetEl(targetId);
    if (!targetEl) return;

    const targetRect = targetEl.getBoundingClientRect();

    const diffX = mapCenter.x - (targetRect.left + targetRect.width / 2);
    const diffY = mapCenter.y - (targetRect.top + targetRect.height / 2);

    if (Math.abs(diffX) < 0.1 && Math.abs(diffY) < 0.1) return;

    mapPanX += (diffX * 0.2) / mapScale;
    mapPanY += (diffY * 0.2) / mapScale;
    updateMapTransform();
}

function getCost(planetId, unitKey, amount = 1) {
    const unit = gameData.planets[planetId]?.units[unitKey];
    if (!unit) return 0;
    
    let totalCost = 0;
    let currentOwned = unit.owned;
    
    for (let i = 0; i < amount; i++) {
        totalCost += Math.floor(unit.baseCost * Math.pow(unit.costMult, currentOwned));
        currentOwned++;
    }
    
    return totalCost;
}

function getMaxAffordable(planetId, unitKey) {
    const unit = gameData.planets[planetId]?.units[unitKey];
    if (!unit) return { amount: 0, cost: 0 };
    
    let maxAmount = 0;
    let totalCost = 0;
    let currentOwned = unit.owned;
    
    while (true) {
        if (currentOwned >= unit.max) break;
        
        const nextCost = Math.floor(unit.baseCost * Math.pow(unit.costMult, currentOwned));
        if (totalCost + nextCost > gameData.funds) break;
        
        totalCost += nextCost;
        currentOwned++;
        maxAmount++;
    }
    
    return { amount: maxAmount, cost: totalCost };
}

function getTotalIncome() {
    return gameData.cachedTotalIncome || 0;
}

function getTotalScience() {
    return gameData.cachedTotalScience || 0;
}

function getClickValue(planetId) {
    const rocket = gameData.planets[planetId]?.units?.rocket;
    if (!rocket) return 0;
    
    const abortMult = gameData.upgrades.launchAbortSystem.unlocked ? 2 : 1;
    
    return rocket.owned * rocket.basePower * abortMult;
}

function claimContract(contractId) {
    if (gameData.claimedContracts.includes(contractId)) return;
    const contract = contracts.find(c => c.id === contractId);
    if (!contract || (!gameData.completedContracts.includes(contractId) && !contract.condition())) return;

    const preScience = gameData.science;
    contract.reward();
    const gainedScience = gameData.science - preScience;
    if (gainedScience > 0) gameData.totalScienceEarned += gainedScience;
    
    gameData.claimedContracts.push(contractId);
    createFloatingText('kerbin', 'MISSION ACCOMPLISHED!', 'text-orange');
    updateHeader();
    saveGame();
}

function cyclePlanet(direction, onlyUnlocked = false) {
    let planetKeys = Object.keys(gameData.planets);
    if (planetKeys.length === 0) return;
    
    if (!gameData.upgrades.betterTelescopes.unlocked) {
        planetKeys = planetKeys.filter(key => key !== 'dres');
    }
    
    if (onlyUnlocked) {
        planetKeys = planetKeys.filter(key => gameData.planets[key].unlocked);
    }
    
    if (planetKeys.length === 0) return;
    
    const currentIndex = planetKeys.indexOf(gameData.selectedPlanet);
    if (currentIndex === -1) {
        selectPlanet(planetKeys[0]);
        return;
    }
    
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = planetKeys.length - 1;
    if (newIndex >= planetKeys.length) newIndex = 0;
    
    selectPlanet(planetKeys[newIndex]);
}

function setWarpIndex(index) {
    if (index < 0 || index >= warpLevels.length) return;
    
    if (index > gameData.maxWarpUnlocked) {
        showWarpLockedPopup();
        return;
    }
    
    const oldMultiplier = getWarpMultiplier(currentWarpIndex);
    currentWarpIndex = index;
    const newMultiplier = getWarpMultiplier(currentWarpIndex);
    
    updateWarpUI(currentWarpIndex, oldMultiplier, newMultiplier);
    
    if (typeof playSFX === 'function' && typeof sfxClick !== 'undefined') {
        playSFX(sfxClick);
    }
}

function attemptWarpUnlock() {
    const nextLevel = gameData.maxWarpUnlocked + 1;
    if (nextLevel >= warpLevels.length || gameData.totalScienceEarned < warpThresholds[nextLevel]) return;
    showWarpUpgradeModal();
}

function executeWarpUpgrade() {
    const nextLevel = gameData.maxWarpUnlocked + 1;
    if (nextLevel >= warpLevels.length) return;
    
    isResetting = true; 
    localStorage.removeItem('kspIdleSave');
    localStorage.setItem('kspIdleSave', JSON.stringify({ maxWarpUnlocked: nextLevel, missionTime: gameData.missionTime, settings: gameData.settings }));
    sessionStorage.setItem('kspAudioState', JSON.stringify({ music: isMusicPlaying, sound: isSoundEnabled }));
    location.reload(); 
}

function selectPlanet(planetId) {
    if (isPaused || wasDragging) return;
    if (planetId === 'dres' && !gameData.upgrades.betterTelescopes.unlocked) return;
    
    gameData.selectedPlanet = planetId;
    cameraTarget = planetId; 

    updatePanel();
    updateApsisMarkers();
    updateOrbitHighlight();
    
    playSFX(sfxPlanet);
}

function getVisualTargetId(pId) {
    if (pId === 'mun') return pId;
    if (pId === 'minmus') return pId;
    
    const p = gameData.planets[pId];
    if (!p) return pId;
    if (!p.planetReq) return pId;
    if (p.planetReq === 'kerbin') return pId;
    
    return p.planetReq;
}

function createGhostTarget(pId) {
    const p = gameData.planets[pId];
    if (!p) return;
    
    const visualTargetId = getVisualTargetId(pId);
    const visualTarget = gameData.planets[visualTargetId];
    if (!visualTarget) return;
    
    const existingGhost = document.querySelector(`.ghost-orbit-${pId}`);
    if (existingGhost) existingGhost.remove();
    
    const remainingTime = p.unlockTime - (p.unlockProgress || 0);
    const arrivalTime = gameData.missionTime + remainingTime;
    
    const isMainPlanet = visualTarget.orbitParent === 'kerbol';
    const parentId = isMainPlanet ? 'map-content' : `wrapper-${visualTarget.orbitParent}`;
    const parentContainer = document.getElementById(parentId);
    
    if (!parentContainer) return;

    const ghostWrapper = document.createElement('div');
    ghostWrapper.className = `planet-wrapper ghost-orbit ghost-orbit-${pId}`;
    ghostWrapper.id = `ghost-wrapper-${pId}`;
    ghostWrapper.style.position = 'absolute';
    ghostWrapper.style.left = '50%';
    ghostWrapper.style.top = '50%';
    
    const ghostPlanet = document.createElement('div');
    ghostPlanet.className = 'planet ghost-planet';
    
    ghostWrapper.appendChild(ghostPlanet);
    parentContainer.appendChild(ghostWrapper);
    
    p.ghostTargetId = ghostWrapper.id;
    
    const startAngle = visualTarget.startAngle || 0;
    const timeInOrbit = arrivalTime % visualTarget.orbitDuration;
    const progress = timeInOrbit / visualTarget.orbitDuration;
    const startProgress = startAngle / 360;
    
    const currentProgress = (progress + startProgress) % 1.0;
    const angleRad = currentProgress * 2 * Math.PI;
    
    const rx = (visualTarget.orbitWidth || 0) / 2;
    const ry = (visualTarget.orbitHeight || 0) / 2;
    const offsetY = visualTarget.offsetY || 0;

    const x = rx * Math.cos(angleRad);
    const y = -ry * Math.sin(angleRad) + offsetY;
    
    ghostWrapper.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
}

function getTransferChance(planetId) {
    const p = gameData.planets[planetId];
    if (!p) return 0;
    if (!p.rocketUpgrades) return p.baseTransferChance || 0.15;
    
    let totalUpgrades = 0;
    for (const key in p.rocketUpgrades) {
        totalUpgrades += p.rocketUpgrades[key];
    }
    
    const base = p.baseTransferChance || 0.15;
    
    // Valentina's Coffee Bonus
    let coffeeBonus = 0;
    if (gameData.upgrades.valentinasCoffee && gameData.upgrades.valentinasCoffee.unlocked) {
        coffeeBonus = 0.10; 
    }
    
    const maxLevelPerComponent = (gameData.upgrades.veryHeavyRocketry && gameData.upgrades.veryHeavyRocketry.unlocked) ? 10 : 5;
    const maxTotalUpgrades = 6 * maxLevelPerComponent;
    
    const maxBonus = 1.0 - base;
    const bonusPerLevel = maxBonus / maxTotalUpgrades;
    
    return base + coffeeBonus + (totalUpgrades * bonusPerLevel);
}

function getRocketUpgradeCost(planetId, comp) {
    const p = gameData.planets[planetId];
    if (!p) return 0;
    if (!p.rocketUpgrades) return 0;
    
    const currentLevel = p.rocketUpgrades[comp];
    const maxLevel = (gameData.upgrades.veryHeavyRocketry && gameData.upgrades.veryHeavyRocketry.unlocked) ? 10 : 5;
    if (currentLevel >= maxLevel) return 0;
    
    const baseCost = p.rocketUpgradeBaseCost || 1000;
    let cost = Math.floor(baseCost * Math.pow(1.8, currentLevel));
    
    // Struts and Boosters Rabatt
    if (gameData.upgrades.strutsAndBoosters && gameData.upgrades.strutsAndBoosters.unlocked) {
        cost = Math.floor(cost * 0.5);
    }
    
    return cost;
}

function buyRocketUpgrade(comp) {
    const pId = gameData.selectedPlanet;
    if (!pId) return;
    
    const p = gameData.planets[pId];
    if (!p) return;
    if (!p.rocketUpgrades) return;

    const maxLevel = (gameData.upgrades.veryHeavyRocketry && gameData.upgrades.veryHeavyRocketry.unlocked) ? 10 : 5;
    const lvl = p.rocketUpgrades[comp];
    if (lvl >= maxLevel) return;

    const cost = getRocketUpgradeCost(pId, comp);
    if (gameData.funds < cost) return;

    gameData.funds -= cost;
    p.rocketUpgrades[comp]++;
    
    updateHeader();
    if (typeof updatePanel === 'function') updatePanel();
    if (typeof updateRocketUpgradesUI === 'function') updateRocketUpgradesUI();
    saveGame();
}

function unlockSelectedPlanet() {
    const pId = gameData.selectedPlanet;
    if (!pId) return;
    
    const planet = gameData.planets[pId];
    if (!planet) return;

    if (planet.unlocked || planet.isUnlocking) return;
    if (gameData.funds < planet.unlockCost) return;
    if (planet.unlockReq && !gameData.upgrades[planet.unlockReq].unlocked) return;
    if (planet.planetReq && !gameData.planets[planet.planetReq].unlocked) return;

    gameData.funds -= planet.unlockCost;
    planet.isUnlocking = true;
    planet.hasFailed = false;
    planet.unlockProgress = 0;
    planet.failProgress = null;
    gameData.hasLaunchedRocket = true;

    planet.transferStartPos = getRelativePos('wrapper-kerbin');

    const roll = Math.random();
    const successChance = getTransferChance(pId);
    if (roll > successChance) {
        const minFail = planet.unlockTime * 0.10;
        const randomRange = planet.unlockTime * 0.70;
        planet.failProgress = minFail + (Math.random() * randomRange);
    }
    
    createGhostTarget(pId);
    
    recalculateCache();
    updateHeader();
    updatePanel(); 
    saveGame();
}

function confirmTransferFail() {
    const pId = gameData.selectedPlanet;
    if (!pId) return;
    
    const planet = gameData.planets[pId];
    if (!planet) return;
    if (!planet.hasFailed) return;

    planet.hasFailed = false;
    planet.unlockProgress = 0;
    
    updateHeader();
    updatePanel();
    saveGame();
}

let lastClick = 0;
const BASE_CLICK_COOLDOWN_MS = 200;

function manualClick() {
    if (isPaused) return;
    if (gameData.upgrades.mechJeb.unlocked) return;
    
    const now = Date.now();
	const currentWarpMult = getWarpMultiplier(currentWarpIndex);
	// Skaliert den Cooldown antiproportional zum Warp, damit man mit Time-Warp schneller klicken kann
    const adjustedCooldown = BASE_CLICK_COOLDOWN_MS / Math.max(1, currentWarpMult);

	if (now - lastClick < adjustedCooldown) return;
    lastClick = now;
    
    const pId = 'kerbin';
    const clickVal = getClickValue(pId);
    if (clickVal === 0) return;
    
    gameData.funds += clickVal;
    gameData.totalFundsEarned += clickVal; 
    
    createFloatingText(pId, `+${formatNumber(clickVal)} ${ICON_FUNDS}`, 'text-green');
    
    updateHeader();
    
    if (typeof playSFX === 'undefined') return;
    if (typeof sfxClick === 'undefined') return;
    
    playSFX(sfxClick);
}

function buyUnit(unitKey) {
    const pId = gameData.selectedPlanet;
    if (!pId || pId === 'kerbol') return;

    const unit = gameData.planets[pId].units[unitKey];
    if (!unit) return;
    if (unit.owned >= unit.max) return;
    
    const req = unitDOMMapping[unitKey]?.req;
    if (req && !gameData.upgrades[req].unlocked) return;

    let amountToBuy = currentBuyMode;
    let cost = 0;

    if (currentBuyMode === 'MAX') {
        const maxInfo = getMaxAffordable(pId, unitKey);
        amountToBuy = maxInfo.amount;
        cost = maxInfo.cost;
    } else {
        amountToBuy = Math.min(currentBuyMode, Math.max(0, unit.max - unit.owned));
        cost = getCost(pId, unitKey, amountToBuy);
    }

    if (amountToBuy <= 0) return;
    if (gameData.funds < cost) return;

    gameData.funds -= cost;
    unit.owned += amountToBuy;
    
    recalculateCache();
    updateHeader();
    updatePanel();
    saveGame();
}

function buyUpgrade(upgradeId) {
    if (isDraggingTech) return;
    
    const upg = gameData.upgrades[upgradeId];
    if (upg.unlocked || gameData.science < upg.cost) return;

    gameData.science -= upg.cost;
    upg.unlocked = true;
    
    if (upgradeId === 'mechJeb') initializeMechJeb();
    if (upgradeId === 'betterTelescopes') updatePlanetVisibility('dres');
    if (upgradeId === 'krakenDrive' && currentWarpIndex === 3) setWarpIndex(3);
    playSFX(sfxMission);
    
    recalculateCache();
    updateHeader();
    updatePanel();
    renderUpgrades();
    saveGame();
}

function gameLoop(currentTime) {
    if (isPaused) {
        lastTime = currentTime; 
        requestAnimationFrame(gameLoop);
        return;
    }

    let deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    if (deltaTime > 0.1) {
        deltaTime = 0.1; 
    }

    const warpMult = getWarpMultiplier(currentWarpIndex);
    const effectiveTime = deltaTime * warpMult;

    gameData.missionTime += effectiveTime;
    
    updatePlanetsPositions(); // Jedes Frame die Hauptplaneten an ihre exakte Position setzen
    updateCameraStep();       // Kamera-Lock ohne redundante Loops/Reflows ausführen

    let frameIncome = gameData.cachedTotalIncome * effectiveTime;
    let frameScience = gameData.cachedTotalScience * effectiveTime;

    if (currentWarpIndex > 0 && gameData.upgrades.longTermMissions && gameData.upgrades.longTermMissions.unlocked) {
        frameIncome *= 1.10;
        frameScience *= 1.10;
    }

    gameData.funds += frameIncome;
    gameData.totalFundsEarned += frameIncome;
    gameData.science += frameScience;
    gameData.totalScienceEarned += frameScience;
    
    for (const pKey in gameData.planets) {
        const p = gameData.planets[pKey];
        
        if (!p.isUnlocking) {
            removeTransferVisual(pKey); 
            continue;
        }
        
        p.unlockProgress += effectiveTime;
        
        if (p.failProgress !== null && p.failProgress !== undefined && p.unlockProgress >= p.failProgress) {
            p.isUnlocking = false;
            p.hasFailed = true;
            p.failProgress = null;

            createFloatingText(pKey, 'MISSION FAILED!', 'text-red');
            if (typeof playSFX === 'function' && typeof sfxTransferFailed !== 'undefined') playSFX(sfxTransferFailed);
            
            updateHeader();
            if (gameData.selectedPlanet === pKey) updatePanel();
            saveGame();
            
            removeTransferVisual(pKey); 
            continue;
        }

        if (p.unlockProgress < p.unlockTime) {
            let activeStartPos = p.transferStartPos;
            if (pKey === 'mun' || pKey === 'minmus') activeStartPos = getRelativePos('wrapper-kerbin');
            
            updateTransferVisual(pKey, p.unlockProgress / p.unlockTime, activeStartPos);
            continue;
        }
        
        p.isUnlocking = false;
        p.unlockProgress = 0; 
        p.failProgress = null;
        p.unlocked = true;
        
        const planetEl = getTargetEl(`planet-${pKey}`);
        if (planetEl) planetEl.classList.remove('locked');
        
        createFloatingText(pKey, `${p.name.toUpperCase()} REACHED!`, 'text-green');
        if (typeof playSFX === 'function' && typeof sfxTransferComplete !== 'undefined') playSFX(sfxTransferComplete);
        
        recalculateCache();
        updateHeader();
        if (gameData.selectedPlanet === pKey) updatePanel();
        saveGame();
        
        removeTransferVisual(pKey);
    }

    uiFastTimer += deltaTime; 
    if (uiFastTimer >= 0.1) { 
        updateFastUI();
        uiFastTimer %= 0.1; 
    }

    uiHeavyTimer += deltaTime;
    if (uiHeavyTimer >= 1.0) {
        updateHeavyUI();
        uiHeavyTimer %= 1.0;
    }

    floatTextTimer += effectiveTime;
    if (floatTextTimer >= 1.0) {
        const globalMult = 1;
        spawnFloatingTexts(globalMult);
        floatTextTimer %= 1.0;
    }
    
    updateAsteroids(effectiveTime);

    requestAnimationFrame(gameLoop);
}

function saveGame() { 
    if (isResetting) return;
    const dataToSave = { ...gameData, mapScale: mapScale };
    localStorage.setItem('kspIdleSave', JSON.stringify(dataToSave)); 
}

function loadGame() {
    const saved = localStorage.getItem('kspIdleSave');
    if (!saved) return;
    
    const loadedData = JSON.parse(saved);

    const keysToLoad = ['funds', 'totalFundsEarned', 'science', 'missionTime', 'selectedPlanet', 'totalScienceEarned', 'maxWarpUnlocked', 'settings', 'asteroidsCaught', 'hasLaunchedRocket'];
    keysToLoad.forEach(key => {
        if (loadedData[key] !== undefined) gameData[key] = loadedData[key];
    });
    if (loadedData.mapScale) {
        mapScale = loadedData.mapScale;
        updateMapTransform();
    }
    
    if (Array.isArray(loadedData.claimedContracts)) {
        gameData.claimedContracts = loadedData.claimedContracts.map(c => typeof c === 'number' ? contracts[c]?.id : c).filter(Boolean);
    }
    
    if (Array.isArray(loadedData.completedContracts)) {
        gameData.completedContracts = loadedData.completedContracts.map(c => typeof c === 'number' ? contracts[c]?.id : c).filter(Boolean);
    }

    if (loadedData.upgrades) {
        for (const key in gameData.upgrades) {
            if (!loadedData.upgrades[key]) continue;
            gameData.upgrades[key].unlocked = !!loadedData.upgrades[key].unlocked;
        }
    }

    if (!loadedData.planets) return;

    for (const pKey in gameData.planets) {
        if (!loadedData.planets[pKey]) continue;
        
        gameData.planets[pKey].unlocked = !!loadedData.planets[pKey].unlocked;
		
		gameData.planets[pKey].rocketUpgrades = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 };
        
        gameData.planets[pKey].isUnlocking = !!loadedData.planets[pKey].isUnlocking;
        gameData.planets[pKey].hasFailed = !!loadedData.planets[pKey].hasFailed;
        gameData.planets[pKey].unlockProgress = loadedData.planets[pKey].unlockProgress || 0;
        gameData.planets[pKey].failProgress = loadedData.planets[pKey].failProgress !== undefined ? loadedData.planets[pKey].failProgress : null;
        
        if (loadedData.planets[pKey].transferStartPos) {
            gameData.planets[pKey].transferStartPos = loadedData.planets[pKey].transferStartPos;
        } else if (gameData.planets[pKey].isUnlocking) {
            gameData.planets[pKey].transferStartPos = getRelativePos('wrapper-kerbin');
        }

        const planetEl = getTargetEl(`planet-${pKey}`);
        if (planetEl && gameData.planets[pKey].unlocked) {
            planetEl.classList.remove('locked');
        }

        if (gameData.planets[pKey].isUnlocking && !gameData.planets[pKey].hasFailed) {
            createGhostTarget(pKey);
        }

        if (!loadedData.planets[pKey].units) continue;
        
        for (const uKey in gameData.planets[pKey].units) {
            if (!loadedData.planets[pKey].units[uKey]) continue;
            gameData.planets[pKey].units[uKey].owned = loadedData.planets[pKey].units[uKey].owned || 0;
        }
    }
    recalculateCache();
    
    if (gameData.upgrades.mechJeb.unlocked) initializeMechJeb();
    updatePlanetVisibility('dres');
}

function executeReset() { isResetting = true; localStorage.removeItem('kspIdleSave'); location.reload(); }
function resetGame() { showResetConfirm(); }

const mapControls = document.getElementById('map-controls');
if (mapControls) mapControls.addEventListener('mousedown', (e) => e.stopPropagation());

const topUiLayer = document.getElementById('top-ui-layer');
if (topUiLayer) topUiLayer.addEventListener('mousedown', (e) => e.stopPropagation());

if (typeof generateUnitCards === 'function') {
    generateUnitCards();
}

const btnClick = document.getElementById('btn-click');
if (btnClick) {
    btnClick.addEventListener('click', manualClick);
																										
								   
					  
	   
}

document.getElementById('btn-unlock').addEventListener('click', unlockSelectedPlanet);
document.getElementById('btn-reset').addEventListener('click', resetGame);
document.getElementById('btn-rnd').addEventListener('click', toggleRndModal);
document.getElementById('btn-close-rnd').addEventListener('click', () => document.getElementById('rnd-modal').classList.add('hidden'));
document.getElementById('btn-prev-planet').addEventListener('click', () => cyclePlanet(-1));
document.getElementById('btn-next-planet').addEventListener('click', () => cyclePlanet(1));
document.getElementById('btn-help-menu').addEventListener('click', toggleHelpMenu);
document.getElementById('btn-close-help').addEventListener('click', toggleHelpMenu);
document.getElementById('btn-transfer-fail-confirm')?.addEventListener('click', confirmTransferFail);
['a', 'b', 'c', 'd', 'e', 'f'].forEach(comp => {
    const btn = document.getElementById(`btn-upgrade-${comp}`);
    if (!btn) return;
    btn.addEventListener('click', () => buyRocketUpgrade(comp));
});


document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.classList.contains('nav-arrow')) return;
    if (btn.classList.contains('upgrade-btn')) return;
    if (btn.id === 'btn-click') return;

    if (btn.classList.contains('claim-mission-btn')) {
        playSFX(sfxMission);
        if (btn.dataset.contract) claimContract(btn.dataset.contract);
        return;
    }

    playSFX(sfxClick);
});

for (const unitKey in unitDOMMapping) {
    const unitData = unitDOMMapping[unitKey];
    const btn = document.getElementById(`btn-buy-${unitData.prefix}`);
    
    if (!btn) continue; 
    
    btn.addEventListener('click', () => buyUnit(unitKey));
}

document.getElementById('btn-close-warp-upgrade')?.addEventListener('click', hideWarpUpgradeModal);
document.getElementById('btn-cancel-warp-upgrade')?.addEventListener('click', hideWarpUpgradeModal);
document.getElementById('btn-confirm-warp-upgrade')?.addEventListener('click', executeWarpUpgrade);
document.getElementById('btn-close-reset-confirm')?.addEventListener('click', hideResetConfirm);
document.getElementById('btn-cancel-reset')?.addEventListener('click', hideResetConfirm);
document.getElementById('btn-confirm-reset')?.addEventListener('click', executeReset);
document.getElementById('btn-close-esc')?.addEventListener('click', togglePause);
document.getElementById('btn-resume')?.addEventListener('click', togglePause);
document.getElementById('btn-feedback')?.addEventListener('click', () => window.open('https://google.com', '_blank'));
document.getElementById('btn-pause-menu')?.addEventListener('click', togglePause);

const techContainer = document.getElementById('upgrades-container');

const mapSection = document.getElementById('solar-system-map');
const mapContent = document.getElementById('map-content');
const zoomSlider = document.getElementById('zoom-slider'); 
let mapScale = 1, mapPanX = 0, mapPanY = 0, isDraggingMap = false, dragStartX = 0, dragStartY = 0, dragStartCoords = { x: 0, y: 0 };

mapSection.addEventListener('wheel', (e) => {
    e.preventDefault(); 
    applyZoom(mapScale + (e.deltaY < 0 ? 0.1 : -0.1));
}, { passive: false }); 

if (zoomSlider) zoomSlider.addEventListener('input', (e) => { 
    applyZoom(parseFloat(e.target.value)); 
});

mapSection.addEventListener('mousedown', (e) => {
    isDraggingMap = true;
    wasDragging = false;
    cameraTarget = null; 
    dragStartX = e.clientX - mapPanX;
    dragStartY = e.clientY - mapPanY;
    dragStartCoords = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mousemove', (e) => {
    if (!isDraggingMap) return;
    if (Math.abs(e.clientX - dragStartCoords.x) > 5 || Math.abs(e.clientY - dragStartCoords.y) > 5) wasDragging = true;
    mapPanX = e.clientX - dragStartX;
    mapPanY = e.clientY - dragStartY;
    updateMapTransform();
});

window.addEventListener('mouseup', () => {
    isDraggingMap = false;
    setTimeout(() => { wasDragging = false; }, 50);
});

document.getElementById('kerbol').addEventListener('click', () => { if (!wasDragging) selectPlanet('kerbol'); });

const escModal = document.getElementById('esc-modal');

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = ['rnd-modal', 'warp-locked-modal', 'reset-confirm-modal', 'warp-upgrade-modal', 'help-modal'];
        
        for (const id of modals) {
            const el = document.getElementById(id);
            if (!el) continue;
            if (el.classList.contains('hidden')) continue;

            if (id === 'warp-locked-modal') {
                hideWarpLockedPopup();
                return;
            }
            if (id === 'reset-confirm-modal') {
                hideResetConfirm();
                return;
            }
            if (id === 'warp-upgrade-modal') {
                hideWarpUpgradeModal();
                return;
            }
            if (id === 'help-modal') {
                toggleHelpMenu();
                return;
            }

            el.classList.add('hidden');
            return;
        }
        
        togglePause();
        return;
    }
    
    if (isPaused) return;
    if (e.target.tagName === 'INPUT') return;

    if (e.key === '.') {
        setWarpIndex(currentWarpIndex + 1);
        return;
    }
    
    if (e.key === ',') {
        setWarpIndex(currentWarpIndex - 1);
        return;
    }
    
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        cyclePlanet(-1);
        return;
    }
    
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        cyclePlanet(1);
        return;
    }
    
    if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        e.preventDefault(); 
        cyclePlanet(-1, true);
        return;
    }
    
    if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        e.preventDefault(); 
        cyclePlanet(1, true);
        return;
    }
    
    if (e.key === ' ') {
        e.preventDefault();
        if (gameData.upgrades.mechJeb.unlocked) return;
        manualClick();
        return;
    }
    
    if (e.key.toLowerCase() === 'f') {
        playSFX(sfxClick);
        toggleRndModal();
        return;
    }
});

const warpLockedModal = document.getElementById('warp-locked-modal');
document.getElementById('btn-close-warp-alert')?.addEventListener('click', hideWarpLockedPopup);
document.getElementById('btn-ok-warp-alert')?.addEventListener('click', hideWarpLockedPopup);

const helpModal = document.getElementById('help-modal');

const btnStartTutorial = document.getElementById('btn-start-tutorial');
if (btnStartTutorial) {
    btnStartTutorial.addEventListener('click', () => {
        console.log('Start Tutorial Tour');
        toggleHelpMenu();
    });
}

setInterval(() => { if (!isPaused) saveGame(); }, 5000);
window.addEventListener('beforeunload', saveGame);

loadGame();
initLabelsSetting();
updateHeader();

if (!gameData.selectedPlanet) gameData.selectedPlanet = 'kerbol';
cameraTarget = gameData.selectedPlanet;

const tooltipEl = document.createElement('div');
tooltipEl.id = 'planet-tooltip';
tooltipEl.className = 'hidden';
document.body.appendChild(tooltipEl);

let hoverTimer = null;
let mouseX = 0;
let mouseY = 0;

// Event-Delegation am Map-Container für Tooltips (schont Arbeitsspeicher und reduziert VRAM-Overhead)
if (mapContent) {
    mapContent.addEventListener('mouseenter', (e) => {
        const p = e.target.closest('.planet, .sun');
        if (!p) return;

        let pId = p.id;
        if (pId.startsWith('planet-')) {
            pId = pId.replace('planet-', '');
        }

        const planetData = gameData.planets[pId];
        if (!planetData) return;
        if (!planetData.desc) return;

        hoverTimer = setTimeout(() => {
            tooltipEl.innerText = planetData.desc;
            tooltipEl.classList.remove('hidden');
            updateTooltipPosition();
        }, 2000);
    }, true);

    mapContent.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!tooltipEl.classList.contains('hidden')) {
            updateTooltipPosition();
        }
    });

    mapContent.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimer);
        tooltipEl.classList.add('hidden');
    }, true);
}

const toggleSlider = document.getElementById('buy-toggle-slider');

document.querySelectorAll('.buy-toggle-btn').forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        const target = e.target;
        const mode = target.getAttribute('data-mode');
        
        if (target.classList.contains('active')) {
            target.classList.remove('active');
            currentBuyMode = 1;
            if (toggleSlider) toggleSlider.style.opacity = '0';
            updatePanel();
            return;
        }
        
        document.querySelectorAll('.buy-toggle-btn').forEach(b => b.classList.remove('active'));
        target.classList.add('active');
        
        if (toggleSlider) {
            toggleSlider.style.opacity = '1';
            toggleSlider.style.transform = `translateX(${index * 100}%)`;
        }
        
        currentBuyMode = mode === 'MAX' ? 'MAX' : parseInt(mode, 10);
        updatePanel();
    });
});

function getRelativePos(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return { x: 0, y: 0 };
    
    const mapContent = document.getElementById('map-content');
    if (!mapContent) return { x: 0, y: 0 };
    
    const elRect = el.getBoundingClientRect();
    const mapRect = mapContent.getBoundingClientRect();
    
    const elX = elRect.left + elRect.width / 2;
    const elY = elRect.top + elRect.height / 2;
    
    const mapX = mapRect.left + mapRect.width / 2;
    const mapY = mapRect.top + mapRect.height / 2;
    
    return {
        x: (elX - mapX) / mapScale,
        y: (elY - mapY) / mapScale
    };
}

function updateTransferVisual(targetId, progress, startPosOverride) {
    if (!targetId) return;

    let layer = document.getElementById('transfer-layer');
    if (!layer) {
        layer = document.createElement('div');
        layer.id = 'transfer-layer';
        document.getElementById('map-content').appendChild(layer);
    }
    
    let svg = document.getElementById('transfer-svg');
    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'transfer-svg';
        svg.style.position = 'absolute';
        svg.style.overflow = 'visible';
        svg.style.width = '1px';
        svg.style.height = '1px';
        layer.appendChild(svg);
    }
    
    let path = document.getElementById(`path-${targetId}`);
    if (!path) {
        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.id = `path-${targetId}`;
        path.setAttribute('class', 'transfer-path');
        svg.appendChild(path);
    }
    
    let rocket = document.getElementById(`rocket-${targetId}`);
    if (!rocket) {
        rocket = document.createElement('div');
        rocket.id = `rocket-${targetId}`;
        rocket.className = 'transfer-rocket'; 
        layer.appendChild(rocket);
    }
    
    const p = gameData.planets[targetId];
    if (!p) return;

    let basePos = startPosOverride || getRelativePos('wrapper-kerbin');
    let startPos = { x: basePos.x, y: basePos.y };

    const isKerbinSystem = targetId === 'mun' || targetId === 'minmus';
    
    if (isKerbinSystem) {
        startPos.y -= 14; 
    }
    
    let visualTargetWrapperId = `wrapper-${getVisualTargetId(targetId)}`;
    if (p.ghostTargetId) {
        const ghostEl = document.getElementById(p.ghostTargetId);
        if (ghostEl) visualTargetWrapperId = p.ghostTargetId;
    }
    
    const targetPos = getRelativePos(visualTargetWrapperId);
    const dist = Math.sqrt((targetPos.x - startPos.x) ** 2 + (targetPos.y - startPos.y) ** 2);
    
    if (dist === 0) return;
    
    let cx = (startPos.x + targetPos.x) / 2;
    let cy = (startPos.y + targetPos.y) / 2;
    
    const centerId = isKerbinSystem ? 'wrapper-kerbin' : 'wrapper-kerbol';
    const centerEl = document.getElementById(centerId) || document.getElementById('kerbol');
    
    if (centerEl) {
        const centerPos = getRelativePos(centerEl.id);
        cx = centerPos.x;
        cy = centerPos.y;
    }

    const dx1 = startPos.x - cx;
    const dy1 = startPos.y - cy;
    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1) || 1;
    
    const dx2 = targetPos.x - cx;
    const dy2 = targetPos.y - cy;
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
    
    const ang1 = (Math.atan2(dy1, dx1) + 2 * Math.PI) % (2 * Math.PI);
    const ang2 = (Math.atan2(dy2, dx2) + 2 * Math.PI) % (2 * Math.PI);
    
    let sweep = ang1 - ang2;
    if (sweep < 0) sweep += 2 * Math.PI;
    
    if (sweep < Math.PI * 0.8 || dist < 150) {
        sweep += 2 * Math.PI;
    }
    
    // Optimierung: Von 120 auf 30 Bezier-Punkte reduziert (Spart CPU-Arbeit beim String-Concat & SVG Parsing)
    const steps = 30;
    const points = [];
    
    for (let i = 0; i <= steps; i++) {
        const t = progress + (i / steps) * (1 - progress);
        
        const currentAng = ang1 - t * sweep;
        const tr = t * t * (3 - 2 * t);
        const bulge = Math.pow(Math.sin(t * Math.PI), 2) * (sweep > Math.PI ? dist * 0.3 : 0);
        const r = len1 + tr * (len2 - len1) + bulge;
        
        points.push({
            x: cx + Math.cos(currentAng) * r,
            y: cy + Math.sin(currentAng) * r
        });
    }
    
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const mx = (prev.x + curr.x) / 2;
        const my = (prev.y + curr.y) / 2;
        d += ` Q ${prev.x} ${prev.y} ${mx} ${my}`;
    }
    d += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
    
    path.setAttribute('d', d);
    
    const currentAng = ang1 - progress * sweep;
    const tr = progress * progress * (3 - 2 * progress);
    const bulge = Math.pow(Math.sin(progress * Math.PI), 2) * (sweep > Math.PI ? dist * 0.3 : 0);
    const r = len1 + tr * (len2 - len1) + bulge;
    
    const rx = cx + Math.cos(currentAng) * r;
    const ry = cy + Math.sin(currentAng) * r;
    
    const p2 = Math.min(progress + 0.001, 1);
    const currentAng2 = ang1 - p2 * sweep;
    const tr2 = p2 * p2 * (3 - 2 * p2);
    const bulge2 = Math.pow(Math.sin(p2 * Math.PI), 2) * (sweep > Math.PI ? dist * 0.3 : 0);
    const r2 = len1 + tr2 * (len2 - len1) + bulge2;
    
    const vx = (cx + Math.cos(currentAng2) * r2) - rx;
    const vy = (cy + Math.sin(currentAng2) * r2) - ry;
    
    const angle = Math.atan2(vy, vx) * (180 / Math.PI);
    
    rocket.style.transform = `translate(calc(-50% + ${rx}px), calc(-50% + ${ry}px)) rotate(${angle}deg)`;
}

function removeTransferVisual(targetId) {
    const path = document.getElementById(`path-${targetId}`);
    if (path) path.remove();
    
    const rocket = document.getElementById(`rocket-${targetId}`);
    if (rocket) rocket.remove();
    
    const ghostOrbit = document.querySelector(`.ghost-orbit-${targetId}`);
    if (ghostOrbit) ghostOrbit.remove();
    
    const p = gameData.planets[targetId];
    if (p && p.ghostTargetId) p.ghostTargetId = null;
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    updatePlanetsPositions();

    for (const pKey in gameData.planets) {
        const p = gameData.planets[pKey];
        
        if (!p.isUnlocking) continue;
        if (p.hasFailed) continue;

        createGhostTarget(pKey);
    }
});

updateMapDimensions();
requestAnimationFrame(gameLoop);
updatePanel();
updateApsisMarkers();
updateOrbitHighlight();
setWarpIndex(0);
updatePlanetsPositions();
updateMapTransform();
updateMusicIcons();
updateSoundIcons();