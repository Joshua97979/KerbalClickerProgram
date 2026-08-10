let debugMode = true;

document.addEventListener('DOMContentLoaded', initDebugMenu);

function enableDebugMenu() {
	debugMode = true;
	initDebugMenu();
}

function initDebugMenu() {
	if (!debugMode) return;
    
    const debugBtn = document.getElementById('btn-debug-menu');
    if (!debugBtn) return;
    
    debugBtn.style.display = 'inline-block';
    
    debugBtn.addEventListener('click', openDebugMenu);
    document.getElementById('btn-close-debug').addEventListener('click', closeDebugMenu);
    document.getElementById('btn-cheat-research').addEventListener('click', cheatResearch);
    document.getElementById('btn-cheat-warp').addEventListener('click', cheatWarp);
    document.getElementById('btn-cheat-funds-science').addEventListener('click', cheatFundsAndScience);
	document.getElementById('btn-cheat-total-science').addEventListener('click', cheatTotalScienceEarned);
	document.getElementById('btn-cheat-planets').addEventListener('click', cheatUnlockPlanets);
	
	createFpsVramOverlay();
}

function openDebugMenu() {
    document.getElementById('debug-modal').classList.remove('hidden');
}

function closeDebugMenu() {
    document.getElementById('debug-modal').classList.add('hidden');
}

function cheatResearch() {
    for (const key in gameData.upgrades) {
        gameData.upgrades[key].unlocked = true;
    }
    
    if (typeof renderTechTree === 'function') renderTechTree();
    if (typeof updatePanel === 'function') updatePanel();
    recalculateCache();
	updatePlanetVisibility('dres');
	initializeMechJeb();
}

function cheatWarp() {
    if (typeof warpLevels === 'undefined') return;
    
    gameData.maxWarpUnlocked = warpLevels.length - 1;
    if (typeof updateWarpUI === 'function') {
        updateWarpUI(currentWarpIndex, getWarpMultiplier(currentWarpIndex), getWarpMultiplier(currentWarpIndex));
    }
	const arrows = document.querySelectorAll('.warp-arrow');
    arrows.forEach((arrow, idx) => {
        arrow.style.opacity = '1';
    });
}

function cheatFundsAndScience() {
    gameData.funds += 1000000000;
    gameData.science += 1000000000;
    // totalScienceEarned wird ebenfalls erhöht, damit der reguläre Warp-Prestige-Balken keinen Fehler wirft
    gameData.totalScienceEarned += 1000000000; 
    
    if (typeof updateHeader === 'function') updateHeader();
    recalculateCache();
}

function cheatTotalScienceEarned() {
	gameData.totalScienceEarned = 1000000000;
    if (typeof updateHeader === 'function') updateHeader();
    recalculateCache();
} 

function createFpsVramOverlay() {
    if (document.getElementById('fps-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'fps-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '4px';
    overlay.style.left = '4px';
    overlay.style.zIndex = '999999';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.color = '#00ff00';
    overlay.style.fontFamily = 'monospace';
    overlay.style.fontSize = '11px';
    overlay.style.padding = '2px 6px';
    overlay.style.pointerEvents = 'none';
    overlay.style.borderRadius = '3px';
    overlay.innerText = 'FPS: --';
    document.body.appendChild(overlay);

    let lastTime = performance.now();
    let frameCount = 0;

    function updateStats(now) {
        frameCount++;
        if (now - lastTime >= 500) {
            const fps = Math.round((frameCount * 1000) / (now - lastTime));
            frameCount = 0;
            lastTime = now;

            overlay.innerText = `FPS: ${fps}`;
        }
        requestAnimationFrame(updateStats);
    }

    requestAnimationFrame(updateStats);
}

function cheatUnlockPlanets() {
    for (const pKey in gameData.planets) {
        const p = gameData.planets[pKey];
        
        p.unlocked = true;
        p.isUnlocking = false;
        p.hasFailed = false;
        p.unlockProgress = 0;
        p.failProgress = null;
        
        if (typeof removeTransferVisual === 'function') removeTransferVisual(pKey);

        const planetEl = document.getElementById(`planet-${pKey}`);
        if (!planetEl) continue;
        
        planetEl.classList.remove('locked');
    }

    recalculateCache();
    
    if (typeof updateHeader === 'function') updateHeader();
    if (typeof updatePanel === 'function') updatePanel();
	
	gameData.upgrades['betterTelescopes'].unlocked = true;
	updatePlanetVisibility('dres');
}