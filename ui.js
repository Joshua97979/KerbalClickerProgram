// ui.js
// Zuständig für UI-Updates, DOM-Caching, Text-Formatierung und den Performance-Pool

const uiCache = {
    funds: document.getElementById('ui-funds'),
    income: document.getElementById('ui-income'),
    science: document.getElementById('ui-science'),
    scienceIncome: document.getElementById('ui-science-income'),
    missionTime: document.getElementById('mission-time')
};

function formatMissionTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    const pad = (num) => num.toString().padStart(2, '0');
    return `T+ ${pad(h)}:${pad(m)}:${pad(s)}`;
}

const floatingTextPool = [];
const POOL_SIZE = 50;

function initFloatingTextPool() {
    for (let i = 0; i < POOL_SIZE; i++) {
        const el = document.createElement('div');
        el.style.display = 'none';
        floatingTextPool.push({ el: el, timeoutId: null });
    }
}

initFloatingTextPool();

function getFloatingTextElement() {
    if (floatingTextPool.length === 0) {
        const el = document.createElement('div');
        el.style.display = 'none';
        return { el: el, timeoutId: null };
    }
    return floatingTextPool.pop();
}

function releaseFloatingTextElement(item) {
    if (!item) return;
    
    if (item.timeoutId) {
        clearTimeout(item.timeoutId);
        item.timeoutId = null;
    }

    item.el.style.display = 'none';
    
    if (item.el.parentNode) {
        item.el.parentNode.removeChild(item.el);
    }
    
    floatingTextPool.push(item);
}

function createFloatingText(target, text, colorClass = 'text-green') {
    if (!target) return;
    
    let parentEl;
    if (typeof target === 'string') {
        const targetId = target === 'kerbol' ? 'kerbol' : `planet-${target}`;
        parentEl = document.getElementById(targetId);
    } else {
        parentEl = target;
    }
    
    if (!parentEl) return;
    
    const poolItem = getFloatingTextElement();
    const textEl = poolItem.el;

    textEl.className = `floating-number ${colorClass}`;
    textEl.innerHTML = text;
    textEl.style.color = ''; 

    if (colorClass === 'text-orange') textEl.style.color = 'var(--ksp-orange, orange)';
    if (colorClass === 'text-blue') textEl.style.color = 'var(--ksp-blue, #00d2ff)';
    if (colorClass === 'text-green') textEl.style.color = 'var(--ksp-green, #b4d455)';

    parentEl.appendChild(textEl);
    textEl.style.display = 'block';
    
    textEl.style.animation = 'none';
    textEl.offsetHeight; 
    textEl.style.animation = '';
    
    const multiplier = typeof getWarpMultiplier === 'function' ? getWarpMultiplier(currentWarpIndex) : 1;
    textEl.getAnimations().forEach(anim => anim.playbackRate = multiplier);
    
    if (poolItem.timeoutId) clearTimeout(poolItem.timeoutId);
    poolItem.timeoutId = setTimeout(() => {
        releaseFloatingTextElement(poolItem);
    }, 800 / multiplier);
}

function createWarpFloatingText(oldMultiplier, newMultiplier, colorStr) {
    const mapContainer = document.getElementById('solar-system-map');
    if (!mapContainer) return;
    document.querySelector('.floating-warp-text')?.remove();

    const textEl = document.createElement('div');
    textEl.className = 'floating-warp-text';
    textEl.style.color = colorStr;
    mapContainer.appendChild(textEl);
    textEl.getAnimations().forEach(anim => anim.playbackRate = 1);

    const duration = 200, startTime = performance.now();
    function tickNumber(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        textEl.innerText = `TimeWarp: ${Math.round(oldMultiplier + (newMultiplier - oldMultiplier) * progress)}x`;
        if (progress < 1) requestAnimationFrame(tickNumber);
    }
    requestAnimationFrame(tickNumber);
    setTimeout(() => { if (textEl.parentNode) textEl.remove(); }, 1200);
}

function spawnFloatingTexts(globalMult) {
    for (const pKey in gameData.planets) {
        const p = gameData.planets[pKey];
        if (!p.unlocked) continue;

        const finalPlanetIncome = Math.floor(p.cachedIncome * globalMult);

        if (finalPlanetIncome > 0) {
            createFloatingText(pKey, `+${formatNumber(finalPlanetIncome)} ${ICON_FUNDS}`, 'text-green');
        }

        if (p.cachedScience > 0) {
            setTimeout(() => createFloatingText(pKey, `+${formatNumber(p.cachedScience)} ${ICON_SCI}`, 'text-blue'), 200 / getWarpMultiplier(currentWarpIndex));
        }
    }
}

function generateUnitCards() {
    const container = document.getElementById('economy-scroll-area');
    if (!container) return;

    let html = '';

    for (const [unitKey, unitData] of Object.entries(unitDOMMapping)) {
        const prefix = unitData.prefix;
        const cardId = unitData.cardId;
        const title = unitData.title || 'Unknown Unit';
        const btnText = unitData.btnText || 'Build';

        if (unitData.isRocket) {
            html += `
            <div class="action-card" id="${cardId}">
                <div id="launchpad-label">LAUNCHPAD - MANUAL CONTROL</div>
                <div id="rocket-content">
                    <h3>${title}</h3>
                    <div class="stat-grid">
                        <span>Boosters:</span> <span class="stat-val"><span id="${prefix}-owned">0</span></span>
                        <span>Click Value:</span> <span class="stat-val text-green">+<span id="${prefix}-power">1</span> ${ICON_FUNDS}</span>
                    </div>
                    <button id="btn-click" class="ksp-button">Manual Launch!</button>
                    <button id="btn-buy-${prefix}" class="ksp-button btn-green">${btnText} (<span id="${prefix}-cost">10</span> ${ICON_FUNDS})</button>
                </div>
            </div>`;
            continue;
        }

        const isScience = unitData.yieldResource === 'science';
        const icon = isScience ? ICON_SCI : ICON_FUNDS;
        const textColor = isScience ? 'text-blue' : 'text-green';
        const btnClass = isScience ? 'btn-blue' : 'btn-green';

        html += `
        <div class="action-card" id="${cardId}">
            <h3>${title}</h3>
            <div class="stat-grid">
                <span>Owned:</span> <span class="stat-val"><span id="${prefix}-owned">0</span></span>
                <span>Yield/Ea:</span> <span class="stat-val">+<span id="${prefix}-single">0</span> ${icon}/s</span>
                <span>Total:</span> <span class="stat-val ${textColor}">+<span id="${prefix}-power">0</span> ${icon}/s</span>
            </div>
            <button id="btn-buy-${prefix}" class="ksp-button ${btnClass}">${btnText} (<span id="${prefix}-cost">0</span> ${icon})</button>
        </div>`;
    }

    container.innerHTML = html;
}

function updateFastUI() {
    uiCache.funds.innerText = formatNumber(gameData.funds);
    uiCache.income.innerText = formatNumber(getTotalIncome());
    uiCache.science.innerText = formatNumber(gameData.science);
    uiCache.scienceIncome.innerText = formatNumber(getTotalScience());
    uiCache.missionTime.innerText = formatMissionTime(gameData.missionTime);

    const pId = gameData.selectedPlanet;
    if (!pId) return;

    const planet = gameData.planets[pId];
    if (!planet) return;
    if (!planet.isUnlocking && !planet.hasFailed) return;

    const bar = document.getElementById('transfer-progress-bar');
    if (!bar) return;

    const text = document.getElementById('transfer-progress-text');
    if (!text) return;

    const progressPercent = Math.min((planet.unlockProgress / planet.unlockTime) * 100, 100);
    bar.style.width = progressPercent + '%';

    if (planet.hasFailed) {
        text.innerText = "FAILED";
        return;
    }

    const timeLeft = Math.max(0, planet.unlockTime - planet.unlockProgress);
    const m = Math.floor(timeLeft / 60);
    const s = Math.floor(timeLeft % 60);
    const pad = (num) => num.toString().padStart(2, '0');
    
    text.innerText = `T - ${pad(m)}:${pad(s)}`;
}

function updateHeavyUI() {
    checkContracts();
    refreshButtonStates();
    updateWarpProgress();
    updateRndIndicator();
    
    const rndModal = document.getElementById('rnd-modal');
    if (!rndModal) return;
    if (rndModal.classList.contains('hidden')) return;
    
    renderUpgrades();
}

function updateHeader() {
    updateFastUI();
    updateHeavyUI();
}

function updateButtonState(buttonId, cost) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    
    if (gameData.funds < cost) {
        btn.classList.add('disabled-buy');
        btn.disabled = true; 
        return;
    }
    btn.classList.remove('disabled-buy');
    btn.disabled = false;
}

function refreshButtonStates() {
    const pId = gameData.selectedPlanet;
    if (!pId) return;

	if (typeof updateRocketUpgradesUI === 'function') {
        updateRocketUpgradesUI();
    }				
	
    const planet = gameData.planets[pId];
    if (!planet) return;

    const btnUnlock = document.getElementById('btn-unlock');
    if (btnUnlock) {
        btnUnlock.classList.remove('disabled-buy');
        btnUnlock.disabled = false;

        if (gameData.funds < planet.unlockCost) {
            btnUnlock.classList.add('disabled-buy');
            btnUnlock.disabled = true;
        }
        if (planet.unlockReq && !gameData.upgrades[planet.unlockReq].unlocked) {
            btnUnlock.classList.add('disabled-buy');
            btnUnlock.disabled = true;
        }
        if (planet.planetReq && !gameData.planets[planet.planetReq].unlocked) {
            btnUnlock.classList.add('disabled-buy');
            btnUnlock.disabled = true;
        }
    }

    if (pId === 'kerbol') return; 

    for (const [unitKey, mapping] of Object.entries(unitDOMMapping)) {
        if (!planet.units[unitKey]) continue;
        
        const btnId = `btn-buy-${mapping.prefix}`;
        const unit = planet.units[unitKey];
        
        if (unit.owned >= unit.max) {
            updateButtonState(btnId, Infinity);
            const btn = document.getElementById(btnId);
            if (btn) {
                if (unitKey === 'rocket') btn.innerHTML = 'Max Parts Reached!';
                else btn.innerHTML = 'Max Reached!';
            }
            continue;
        }

        let cost = 0;
        let buyAmount = currentBuyMode;
        
        if (currentBuyMode === 'MAX') {
            const maxInfo = getMaxAffordable(pId, unitKey);
            buyAmount = maxInfo.amount;
            cost = maxInfo.cost;
            
            if (buyAmount === 0) {
                buyAmount = 1;
                cost = getCost(pId, unitKey, 1);
            }
            
            const btn = document.getElementById(btnId);
            if (btn) {
                let baseText = unitKey === 'rocket' ? 'Add Moar Boosters!' : 'Build';
                btn.innerHTML = `${baseText} (<span id="${mapping.prefix}-cost">${formatNumber(cost)}</span> ${ICON_FUNDS})`;
            }
        } else {
            buyAmount = Math.min(currentBuyMode, Math.max(0, unit.max - unit.owned));
            if (buyAmount === 0) buyAmount = 1;
            cost = getCost(pId, unitKey, buyAmount);
        }
        
        updateButtonState(btnId, cost);
    }
}

function updatePanel() {
    const pId = gameData.selectedPlanet;
    if (!pId) return;

    const planet = gameData.planets[pId];
    if (!planet) return;

    document.getElementById('panel-title').innerText = planet.name;

	const rocketAssembly = document.getElementById('rocket-assembly-container');
	
    if (!planet.unlocked) {
        document.getElementById('buy-toggle-container').classList.add('hidden');
        document.getElementById('unlock-section').classList.remove('hidden');
        document.getElementById('economy-section').classList.add('hidden');

        const btnUnlock = document.getElementById('btn-unlock');
        const progressContainer = document.getElementById('transfer-progress-container');
        const reqTextEl = document.getElementById('unlock-req-text');
        const chanceTextEl = document.getElementById('transfer-chance-text');
        const btnFailConfirm = document.getElementById('btn-transfer-fail-confirm');

        if (chanceTextEl) chanceTextEl.classList.add('hidden');
        if (btnFailConfirm) btnFailConfirm.classList.add('hidden');
		if (rocketAssembly) rocketAssembly.classList.add('hidden');

        if (planet.hasFailed) {
            if (btnUnlock) btnUnlock.classList.add('hidden');
            if (reqTextEl) reqTextEl.classList.add('hidden');
            if (progressContainer) progressContainer.classList.remove('hidden');
            
            if (chanceTextEl) {
                chanceTextEl.innerText = 'MISSION FAILED!';
                chanceTextEl.classList.remove('hidden');
                chanceTextEl.style.color = 'var(--ksp-red, red)';
                chanceTextEl.style.fontWeight = 'bold';
                chanceTextEl.style.marginBottom = '5px';
            }

            const bar = document.getElementById('transfer-progress-bar');
            if (bar) bar.style.backgroundColor = 'var(--ksp-red, red)';

            if (btnFailConfirm) btnFailConfirm.classList.remove('hidden');
            return;
        }

        if (planet.isUnlocking) {
            if (btnUnlock) btnUnlock.classList.add('hidden');
            if (reqTextEl) reqTextEl.classList.add('hidden');
            if (progressContainer) progressContainer.classList.remove('hidden');
            
            if (chanceTextEl) {
                chanceTextEl.innerText = 'Transfer mission in progress...';
                chanceTextEl.classList.remove('hidden');
                chanceTextEl.style.color = '#bbb';
                chanceTextEl.style.fontSize = '0.9rem';
                chanceTextEl.style.fontWeight = 'normal';
                chanceTextEl.style.marginBottom = '5px';
            }

            const bar = document.getElementById('transfer-progress-bar');
            if (bar) bar.style.backgroundColor = ''; 
            
            return;
        }

        if (progressContainer) progressContainer.classList.add('hidden');

        let missingText = '';
        if (planet.planetReq && !gameData.planets[planet.planetReq]?.unlocked) {
            missingText = `Requires unlocked planet: ${gameData.planets[planet.planetReq].name}`;
        }
        if (!missingText && planet.unlockReq && !gameData.upgrades[planet.unlockReq]?.unlocked) {
            missingText = `Requires research: ${gameData.upgrades[planet.unlockReq].name}`;
        }

        if (missingText) {
            if (btnUnlock) btnUnlock.classList.add('hidden');
            if (reqTextEl) {
                reqTextEl.innerText = missingText;
                reqTextEl.classList.remove('hidden');
            }
            return;
        }

        if (reqTextEl) reqTextEl.classList.add('hidden');
        if (btnUnlock) btnUnlock.classList.remove('hidden');
		if (rocketAssembly) rocketAssembly.classList.remove('hidden');

        if (chanceTextEl && typeof getTransferChance === 'function') {
            const chancePct = Math.round(getTransferChance(pId) * 100);

            let chanceColor = 'var(--ksp-red, red)';
            if (chancePct >= 50) chanceColor = 'var(--ksp-orange, orange)';
            if (chancePct > 80) chanceColor = 'var(--ksp-green, #b4d455)';

            chanceTextEl.innerHTML = `Success Chance: <span style="color: ${chanceColor};">${chancePct}%</span>`;
            chanceTextEl.classList.remove('hidden');
            chanceTextEl.style.color = '#bbb';
            chanceTextEl.style.fontSize = '0.9rem';
            chanceTextEl.style.fontWeight = 'normal';
            chanceTextEl.style.marginBottom = '5px';
        }

        const costEl = document.getElementById('unlock-cost');
        if (costEl) costEl.innerText = formatNumber(planet.unlockCost);

        refreshButtonStates();
        return; 
    }

    document.getElementById('unlock-section').classList.add('hidden');
	if (rocketAssembly) rocketAssembly.classList.add('hidden');
	
    if (pId === 'kerbol') {
        document.getElementById('buy-toggle-container').classList.add('hidden');
        document.getElementById('economy-section').classList.add('hidden');
        return; 
    }

    document.getElementById('buy-toggle-container').classList.remove('hidden');
    document.getElementById('economy-section').classList.remove('hidden');

	Object.values(unitDOMMapping).forEach(mapping => {
        const card = document.getElementById(mapping.cardId);
        if (card) card.classList.add('hidden');
    });

    for (const [unitKey, mapping] of Object.entries(unitDOMMapping)) {
        if (!planet.units[unitKey]) continue;
        if (mapping.req && !gameData.upgrades[mapping.req].unlocked) continue;

        const card = document.getElementById(mapping.cardId);
        if (card) card.classList.remove('hidden');

        const unit = planet.units[unitKey];
        const prefix = mapping.prefix;

        const ownedEl = document.getElementById(`${prefix}-owned`);
        if (ownedEl) ownedEl.innerText = `${unit.owned}/${unit.max}`;
        
        let buyAmount = currentBuyMode;
        let cost = 0;

        if (currentBuyMode === 'MAX') {
            const maxInfo = getMaxAffordable(pId, unitKey);
            buyAmount = maxInfo.amount;
            cost = maxInfo.cost;
            if (buyAmount === 0 && unit.owned < unit.max) {
                buyAmount = 1;
                cost = getCost(pId, unitKey, 1);
            }
        } else {
            buyAmount = Math.min(currentBuyMode, Math.max(0, unit.max - unit.owned));
            if (buyAmount === 0 && unit.owned < unit.max) buyAmount = 1;
            cost = getCost(pId, unitKey, buyAmount);
        }

        if (mapping.isClick) {
            const powerEl = document.getElementById(`${prefix}-power`);
            if (powerEl) powerEl.innerText = formatNumber(getClickValue(pId));
            
            const btn = document.getElementById(`btn-buy-${prefix}`);
            if (!btn) continue;

            if (unit.owned >= unit.max) {
                btn.innerHTML = 'Max Parts Reached!';
                btn.classList.add('disabled-buy');
                btn.disabled = true;
                continue;
            }
            
            btn.innerHTML = `Add Moar Boosters! (<span id="${prefix}-cost">${formatNumber(cost)}</span> ${ICON_FUNDS})`;
            updateButtonState(`btn-buy-${prefix}`, cost);
            continue;
        }

        let powerMult = getUnitMultiplier(unitKey);
        
        const singleEl = document.getElementById(`${prefix}-single`);
        if (singleEl) singleEl.innerText = formatNumber(unit.basePower * powerMult);

        const powerEl = document.getElementById(`${prefix}-power`);
        if (powerEl) powerEl.innerText = formatNumber(unit.owned * (unit.basePower * powerMult));

        const costEl = document.getElementById(`${prefix}-cost`);
        if (costEl) costEl.innerText = formatNumber(cost);

        const btn = document.getElementById(`btn-buy-${prefix}`);
        if (!btn) continue;

        if (unit.owned >= unit.max) {
            btn.innerHTML = 'Max Reached!';
            updateButtonState(`btn-buy-${prefix}`, Infinity);
            continue;
        }

        btn.innerHTML = `Build (<span id="${prefix}-cost">${formatNumber(cost)}</span> ${ICON_FUNDS})`;
        updateButtonState(`btn-buy-${prefix}`, cost);
    }
}

function checkContracts() {
    const container = document.getElementById('missions-container');
    if (!container) return;

    if (gameData.claimedContracts.length >= contracts.length) {
        if (container.dataset.finished) return; 
        container.innerHTML = `
            <div style="margin-top: 10px;">
                <h3 style="color: var(--ksp-orange); font-size: 1.4rem; line-height: 1.3; margin-bottom: 10px;">All contracts<br>completed!</h3>
                <p style="color: #9aa; font-style: italic; font-size: 1rem; line-height: 1.4;">Awaiting new directives from KSC...</p>
            </div>
        `;
        container.dataset.finished = "true";
        return; 
    }

    contracts.forEach((contract) => {
        if (gameData.claimedContracts.includes(contract.id)) {
            const existingCard = document.getElementById(`contract-card-${contract.id}`);
            if (existingCard) existingCard.remove();
            return;
        }

        if (contract.req && !gameData.claimedContracts.includes(contract.req)) return;

        let isCompleted = gameData.completedContracts.includes(contract.id);
        if (!isCompleted && contract.condition()) {
            isCompleted = true;
            gameData.completedContracts.push(contract.id); 
        }

        let card = document.getElementById(`contract-card-${contract.id}`);
        if (!card) {
            card = document.createElement('div');
            card.id = `contract-card-${contract.id}`;
            card.className = 'action-card';
            container.appendChild(card);
            card.innerHTML = `
                <h3 style="color: var(--ksp-orange); font-size: 1rem;">${contract.title}</h3>
                <p style="font-size: 0.85rem; margin: 5px 0; color: #bbb; font-style: italic;">${contract.desc}</p>
                <div class="button-container"></div>
                <div class="mission-progress-container">
                    <div class="mission-progress-bar"></div>
                    <span class="mission-progress-text"></span>
                </div>
            `;
        }

        card.style.order = isCompleted ? "-1" : "1";

        if (isCompleted && card.dataset.completed !== "true") {
            card.dataset.completed = "true";
            card.querySelector('.button-container').innerHTML = `<button class="ksp-button btn-orange claim-mission-btn" data-contract="${contract.id}">CLAIM REWARD!<br>(${contract.rewardText})</button>`;
            card.querySelector('.mission-progress-container').classList.add('completed');
            card.querySelector('.mission-progress-bar').style.width = '100%';
            card.querySelector('.mission-progress-text').innerText = `${formatNumber(contract.target)}/${formatNumber(contract.target)}`;
            return;
        }

        if (isCompleted) return;

        const currentVal = contract.current();
        const progressPercent = Math.min((currentVal / contract.target) * 100, 100);

        if (card.dataset.completed !== "false") {
            card.dataset.completed = "false";
            card.querySelector('.button-container').innerHTML = `<button class="ksp-button" disabled style="opacity: 0.5;">(Reward: ${contract.rewardText})</button>`;
        }
        
        card.querySelector('.mission-progress-bar').style.width = `${progressPercent}%`;
        card.querySelector('.mission-progress-text').innerText = `${formatNumber(currentVal)}/${formatNumber(contract.target)}`;
    });
}

function updateRndIndicator() {
    const indicator = document.getElementById('rnd-indicator');
    if (!indicator) return;

    let canAfford = false;
    for (const key in gameData.upgrades) {
        const upg = gameData.upgrades[key];
        if (upg.unlocked) continue;
        if (!upg.req.every(reqId => gameData.upgrades[reqId].unlocked)) continue;
        if (gameData.science < upg.cost) continue;
        canAfford = true;
        break;
    }

    if (canAfford) indicator.classList.remove('hidden');
    else indicator.classList.add('hidden');
}

function updateWarpProgress() {
    const container = document.getElementById('warp-progress-container');
    if (!container) return;

    if (gameData.maxWarpUnlocked >= warpLevels.length - 1) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';
    const nextLevel = gameData.maxWarpUnlocked + 1;
    const req = warpThresholds[nextLevel];
    const current = gameData.totalScienceEarned;
    const bar = document.getElementById('warp-progress-bar');
    const text = document.getElementById('warp-progress-text');

    if (current >= req) {
        bar.style.width = '100%';
        text.innerText = "UNLOCK UPGRADE";
        container.classList.add('ready');
    } else {
        const percent = Math.min((current / req) * 100, 100);
        bar.style.width = percent + '%';
        text.innerText = `${formatNumber(current)} / ${formatNumber(req)}`;
        container.classList.remove('ready');
    }

    const arrows = document.querySelectorAll('.warp-arrow');
    arrows.forEach((arrow, idx) => {
        arrow.style.opacity = idx > gameData.maxWarpUnlocked ? '0.4' : '1';
        arrow.style.pointerEvents = 'auto';
    });
}

function updatePlanetVisibility(planetId) {
    if (!planetId) return;
    if (!gameData.upgrades.betterTelescopes.unlocked) return;
	
    const selectors = [
        `#wrapper-${planetId}`
    ];
    
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector); 
        elements.forEach(el => {
            el.classList.remove('planet-hidden');
        });
    });
	drawSvgOrbits();
}

function initializeMechJeb() {
    if (!gameData.upgrades.mechJeb.unlocked) return;
    const btn = document.getElementById('btn-click');
    
    if (!btn) return;
    
    btn.innerHTML = 'MechJeb Active';
    btn.disabled = true;
    btn.classList.add('disabled-buy');
}

function updateOrbitHighlight() {
    document.querySelectorAll('ellipse[class*="svg-orbit-"]').forEach(orbit => orbit.classList.remove('svg-orbit-highlight'));

    const pId = gameData?.selectedPlanet;
    if (!pId || pId === 'kerbol') return;

    const activeSvgOrbit = document.querySelector(`.svg-orbit-${pId}`);
    if (activeSvgOrbit) activeSvgOrbit.classList.add('svg-orbit-highlight');
}

function updateMapTransform() {
    const mapContent = document.getElementById('map-content');
    const zoomSlider = document.getElementById('zoom-slider'); 
    const mapSection = document.getElementById('solar-system-map');
    
    if (!mapContent) return;
    
    mapContent.style.transform = `translate(${mapPanX}px, ${mapPanY}px) scale(${mapScale})`;
    mapContent.style.setProperty('--inv-scale', 1 / mapScale);
    
    if (zoomSlider) zoomSlider.value = mapScale;
    
    if (!mapSection) return;

    const bgX = mapPanX * 0.25;
    const bgY = mapPanY * 0.25;
    const currentBgSize = 1680 * Math.pow(mapScale, 0.3);
    
    mapSection.style.backgroundSize = `${currentBgSize}px ${currentBgSize}px`;
    mapSection.style.backgroundPosition = `calc(50% + ${bgX}px) calc(50% + ${bgY}px)`;
}

function updateTechTransform() {
    const canvas = document.getElementById('tech-tree-canvas');
    if (!canvas) return;
    canvas.style.transform = `translate(${techPanX}px, ${techPanY}px) scale(${techScale})`;
}

function updateTooltipPosition() {
    const tooltipEl = document.getElementById('planet-tooltip');
    if (!tooltipEl) return;
    if (tooltipEl.classList.contains('hidden')) return;
    tooltipEl.style.left = (mouseX + 15) + 'px';
    tooltipEl.style.top = (mouseY + 15) + 'px';
}

function showWarpUpgradeModal() { document.getElementById('warp-upgrade-modal')?.classList.remove('hidden'); if(typeof playSFX === 'function') playSFX(sfxInfoOpen); }
function hideWarpUpgradeModal() { document.getElementById('warp-upgrade-modal')?.classList.add('hidden'); }
function showWarpLockedPopup() { document.getElementById('warp-locked-modal')?.classList.remove('hidden'); if(typeof playSFX === 'function') playSFX(sfxInfoOpen); }
function hideWarpLockedPopup() { document.getElementById('warp-locked-modal')?.classList.add('hidden'); }
function showResetConfirm() { document.getElementById('reset-confirm-modal')?.classList.remove('hidden'); if(typeof playSFX === 'function') playSFX(sfxInfoOpen); }

function hideResetConfirm() { 
    document.getElementById('reset-confirm-modal')?.classList.add('hidden'); 
    if (typeof isPaused !== 'undefined' && isPaused) togglePause();
}

function togglePause() {
    const escModal = document.getElementById('esc-modal');
    const mapSection = document.getElementById('solar-system-map');
    if (!escModal || !mapSection) return;

    if (!escModal.classList.contains('hidden')) {
        escModal.classList.add('hidden');
        isPaused = false;
        mapSection.classList.remove('paused');
        return;
    }
    escModal.classList.remove('hidden');
    isPaused = true;
    mapSection.classList.add('paused');
}

function toggleHelpMenu() {
    const helpModal = document.getElementById('help-modal');
    if (!helpModal) return;

    if (!helpModal.classList.contains('hidden')) {
        helpModal.classList.add('hidden');
        return;
    }

    helpModal.classList.remove('hidden');
}

function updateWarpUI(warpIndex, oldMultiplier, newMultiplier) {
    const warpColors = ['var(--ksp-green)', '#D1FD00', '#FDAC00', '#FF2C00'];
    const activeColor = warpColors[warpIndex];
    
    const container = document.getElementById('time-warp-container');
    if (container) container.style.setProperty('--warp-color', activeColor);
    
    const arrows = document.querySelectorAll('.warp-arrow');
    arrows.forEach((arrow, idx) => {
        if (idx <= warpIndex) {
            arrow.classList.add('active');
            return;
        }
        arrow.classList.remove('active');
    });

    document.getAnimations().forEach(anim => anim.playbackRate = newMultiplier);

    if (typeof createWarpFloatingText === 'function') {
        createWarpFloatingText(oldMultiplier, newMultiplier, activeColor);
    }
}

function togglePlanetLabels(show) {
    if (!gameData.settings) gameData.settings = {};
    gameData.settings.showLabels = show;

    const map = document.getElementById('solar-system-map');
    if (!map) return;

    if (show) {
        map.classList.remove('labels-hidden');
        return;
    }
    
    map.classList.add('labels-hidden');
}

function initLabelsSetting() {
    let showLabels = true;
    
    if (gameData.settings && gameData.settings.showLabels !== undefined) {
        showLabels = gameData.settings.showLabels;
    }
    
    const checkbox = document.getElementById('checkbox-show-labels');
    if (checkbox) checkbox.checked = showLabels;
    
    togglePlanetLabels(showLabels);
}

function updateRocketUpgradesUI() {
    const pId = gameData.selectedPlanet;
    if (!pId) return;

    const planet = gameData.planets[pId];
    if (!planet) return;
    if (planet.unlocked) return;

    const assemblyContainer = document.getElementById('rocket-assembly-container');
    if (!assemblyContainer) return;
    if (assemblyContainer.classList.contains('hidden')) return;

    if (!planet.rocketUpgrades) return;

    const comps = ['a', 'b', 'c', 'd', 'e', 'f'];
    const maxLevel = (gameData.upgrades.veryHeavyRocketry && gameData.upgrades.veryHeavyRocketry.unlocked) ? 10 : 5;

    comps.forEach(comp => {
        const currentLevel = planet.rocketUpgrades[comp] || 0;
        
        const labelEl = document.getElementById(`rocket-upgrade-${comp}`);
        if (labelEl) {
            const compUpper = comp.toUpperCase();
            labelEl.innerHTML = `[${compUpper}]<br>${currentLevel}/${maxLevel}`;
        }

        const btn = document.getElementById(`btn-upgrade-${comp}`);
        if (!btn) return;

        const costEl = document.getElementById(`upgrade-${comp}-cost`);
        
        if (currentLevel >= maxLevel) {
            btn.classList.add('disabled-buy');
            btn.disabled = true;
            if (costEl) costEl.innerText = "MAX";
            return;
        }

        const cost = getRocketUpgradeCost(pId, comp);
        if (costEl) costEl.innerText = formatNumber(cost);

        if (gameData.funds < cost) {
            btn.classList.add('disabled-buy');
            btn.disabled = true;
            return;
        }

        btn.classList.remove('disabled-buy');
        btn.disabled = false;
    });

    const chanceTextEl = document.getElementById('transfer-chance-text');
    if (!chanceTextEl) return;

    const chancePct = Math.round(getTransferChance(pId) * 100);
    let chanceColor = 'var(--ksp-red, red)';
    if (chancePct >= 50) chanceColor = 'var(--ksp-orange, orange)';
    if (chancePct > 80) chanceColor = 'var(--ksp-green, #b4d455)';

    chanceTextEl.innerHTML = `Success Chance: <span style="color: ${chanceColor};">${chancePct}%</span>`;
}