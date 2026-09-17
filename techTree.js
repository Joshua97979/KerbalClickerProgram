// techTree.js
// Logik für das Forschungszentrum (R&D) und Rendering des Tech-Trees

let techScale = 1;
let techPanX = 0;
let techPanY = 0;
let isDraggingTech = false;
let techDragStartX = 0;
let techDragStartY = 0;

// Neue Variablen für Mobile Touch (Pan & Zoom)
let initialTechPinchDistance = null;
let techDragStartCoords = { x: 0, y: 0 };

function initTechTree() {
    const techContainer = document.getElementById('upgrades-container');
    if (!techContainer) return;

    // Desktop Events
    techContainer.addEventListener('mousedown', handleTechDragStart);
    window.addEventListener('mousemove', handleTechDragMove);
    window.addEventListener('mouseup', handleTechDragEnd);
    techContainer.addEventListener('wheel', handleTechZoom, { passive: false });
    
    // Mobile Touch Events
    techContainer.addEventListener('touchstart', handleTechTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTechTouchMove, { passive: false });
    window.addEventListener('touchend', handleTechTouchEnd);
    
    window.addEventListener('resize', handleTechResize);
}

function handleTechDragStart(e) {
    if (e.target.closest('button')) return; 
    
    isDraggingTech = true;
    techDragStartX = e.clientX - techPanX;
    techDragStartY = e.clientY - techPanY;
}

function handleTechDragMove(e) {
    if (!isDraggingTech) return;
    
    techPanX = e.clientX - techDragStartX;
    techPanY = e.clientY - techDragStartY;
    updateTechTransform();
}

function handleTechDragEnd() {
    isDraggingTech = false;
}

function handleTechZoom(e) {
    e.preventDefault();
    const techContainer = document.getElementById('upgrades-container');
    if (!techContainer) return;

    const rect = techContainer.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const oldScale = techScale;

    techScale = Math.max(0.3, Math.min(techScale + (e.deltaY < 0 ? 0.1 : -0.1), 3));
    const scaleRatio = techScale / oldScale;
    
    techPanX = mouseX - (mouseX - techPanX) * scaleRatio;
    techPanY = mouseY - (mouseY - techPanY) * scaleRatio;
    updateTechTransform();
}

// --- Mobile Touch Handler (Neu) ---

function handleTechTouchStart(e) {
    // 2-Finger-Geste für Zoom (Pinch)
    if (e.touches.length === 2) {
        isDraggingTech = false;
        initialTechPinchDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        return;
    }

    if (e.touches.length !== 1) return;
    if (e.target.closest('button')) return; // Buttons normal klickbar lassen

    // 1-Finger-Geste für Panning
    isDraggingTech = true;
    techDragStartX = e.touches[0].clientX - techPanX;
    techDragStartY = e.touches[0].clientY - techPanY;
    techDragStartCoords = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}

function handleTechTouchMove(e) {
    // Zoom-Logik (Pinch)
    if (e.touches.length === 2) {
        if (initialTechPinchDistance === null) return;
        e.preventDefault(); 
        
        const currentDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        
        const pinchRatio = currentDistance / initialTechPinchDistance;
        
        if (pinchRatio <= 1.05 && pinchRatio >= 0.95) return;

        const oldScale = techScale;
        const delta = pinchRatio > 1.05 ? 0.05 : -0.05;
        techScale = Math.max(0.3, Math.min(techScale + delta, 3));

        // Zentrum des Pinches berechnen, damit wir an die richtige Stelle zoomen
        const touchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const touchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        
        const techContainer = document.getElementById('upgrades-container');
        const rect = techContainer ? techContainer.getBoundingClientRect() : { left: 0, top: 0 };
        
        const localX = touchCenterX - rect.left;
        const localY = touchCenterY - rect.top;
        const scaleRatio = techScale / oldScale;

        techPanX = localX - (localX - techPanX) * scaleRatio;
        techPanY = localY - (localY - techPanY) * scaleRatio;

        initialTechPinchDistance = currentDistance;
        updateTechTransform();
        return;
    }

    // Panning-Logik
    if (!isDraggingTech) return;
    if (e.touches.length !== 1) return;
    
    // Verhindert das Scrollen der Seite, während wir den Tech-Tree verschieben
    e.preventDefault();

    techPanX = e.touches[0].clientX - techDragStartX;
    techPanY = e.touches[0].clientY - techDragStartY;
    updateTechTransform();
}

function handleTechTouchEnd(e) {
    if (e.touches.length < 2) {
        initialTechPinchDistance = null;
    }
    
    if (e.touches.length === 0) {
        isDraggingTech = false;
    }
}

// --- Ende Mobile Touch Handler ---

function updateTechTransform() {
    const content = document.getElementById('upgrades-content'); 
    if (!content) return;
    content.style.transform = `translate(${techPanX}px, ${techPanY}px) scale(${techScale})`;
}

function handleTechResize() {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        const rndModal = document.getElementById('rnd-modal');
        if (!rndModal || rndModal.classList.contains('hidden')) return;
        drawTechLines();
    }, 100);
}

function toggleRndModal() {
    const rndModal = document.getElementById('rnd-modal');
    if (!rndModal) return;

    if (!rndModal.classList.contains('hidden')) {
        rndModal.classList.add('hidden');
        return;
    }

    rndModal.classList.remove('hidden');
    renderUpgrades();

    setTimeout(() => {
        const container = document.getElementById('upgrades-container');
        const canvas = document.getElementById('tech-tree-canvas');
        if (!container || !canvas) return;

        const cRect = container.getBoundingClientRect();
        const oldTransform = canvas.style.transform;
        canvas.style.transform = 'none';
        const canvasWidth = canvas.scrollWidth;
        const canvasHeight = canvas.scrollHeight;
        canvas.style.transform = oldTransform;

        // Suche nach der am weitesten links liegenden, noch nicht erforschten Spalte (Tier)
        let minTier = Infinity;

        for (const key in gameData.upgrades) {
            const upg = gameData.upgrades[key];
            if (upg.unlocked) continue; 
            if (upg.tier >= minTier) continue; 

            minTier = upg.tier;
        }

        // Wenn alles erforscht ist, herauszoomen und komplett zentrieren
        if (minTier === Infinity) {
            techScale = Math.max(0.3, Math.min(1, cRect.width / (canvasWidth + 80), cRect.height / (canvasHeight + 80)));
            techPanX = (cRect.width - (canvasWidth * techScale)) / 2;
            techPanY = (cRect.height - (canvasHeight * techScale)) / 2;
            updateTechTransform();
            return;
        }

        // Finde alle Upgrades in der Ziel-Spalte für die vertikale Ausdehnung
        let minTop = Infinity;
        let maxBottom = -Infinity;
        let targetX = null;

        for (const key in gameData.upgrades) {
            const upg = gameData.upgrades[key];
            if (upg.tier !== minTier) continue;
            
            const card = document.getElementById(`upgrade-card-${key}`);
            if (!card) continue;
            
            minTop = Math.min(minTop, card.offsetTop);
            maxBottom = Math.max(maxBottom, card.offsetTop + card.offsetHeight);
            targetX = card.offsetLeft + (card.offsetWidth / 2);
        }

        // Fallback, falls DOM-Elemente unerwartet fehlen
        if (targetX === null) {
            techScale = 0.7;
            techPanX = (cRect.width - (canvasWidth * techScale)) / 2;
            techPanY = (cRect.height - (canvasHeight * techScale)) / 2;
            updateTechTransform();
            return;
        }

        // Dynamischen Zoom-Faktor berechnen
        const canvasCenterY = canvasHeight / 2;
        const maxDistFromCenter = Math.max(canvasCenterY - minTop, maxBottom - canvasCenterY);
        
        // Benötigte Höhe, um alle Elemente der Spalte + 120px Padding anzuzeigen
        const requiredHeight = (maxDistFromCenter * 2) + 120;
        
        let calculatedScale = cRect.height / requiredHeight;

        // Limitiere den Zoom-In auf 0.7 (als Minimum-Distanz / maximaler Zoom für 1-2 Upgrades)
        techScale = Math.min(0.7, calculatedScale);
        
        // Limitiere den Zoom-Out auf das globale Minimum von 0.3
        techScale = Math.max(0.3, techScale);

        // Kamera positionieren
        techPanY = (cRect.height - (canvasHeight * techScale)) / 2;
        techPanX = (cRect.width / 2) - (targetX * techScale);
        
        updateTechTransform();
    }, 10);
}

function renderUpgrades() {
    const canvas = document.getElementById('tech-tree-canvas');
    if (!canvas) return;
    
    const rndScienceDisplay = document.getElementById('rnd-science-display');
    if (rndScienceDisplay) rndScienceDisplay.innerHTML = `(Current: ${formatNumber(gameData.science)} ${ICON_SCI})`;

    if (gameData.techDummies) {
        for (const dummyData of gameData.techDummies) {
            let dummy = document.getElementById(dummyData.id);
            if (dummy) continue;

            dummy = document.createElement('div');
            dummy.id = dummyData.id;
            dummy.className = 'upgrade-card'; 
            dummy.style.gridColumn = dummyData.tier;
            dummy.style.gridRow = dummyData.row;
            dummy.style.visibility = 'hidden';
            dummy.style.pointerEvents = 'none';
            canvas.appendChild(dummy);
        }
    }

    for (const key in gameData.upgrades) {
        const upg = gameData.upgrades[key];
        const reqsMet = upg.req.every(reqId => gameData.upgrades[reqId].unlocked);
        const canAfford = gameData.science >= upg.cost;
        
        let card = document.getElementById(`upgrade-card-${key}`);
        if (!card) {
            card = document.createElement('div');
            card.id = `upgrade-card-${key}`;
            card.className = 'upgrade-card';
            card.style.gridColumn = upg.tier;
            card.style.gridRow = upg.row;
            canvas.appendChild(card);
        }

        if (!reqsMet) {
            if (card.dataset.state === "locked") continue;
            card.dataset.state = "locked";
            card.className = 'upgrade-card locked-tech';
            card.innerHTML = `<h4>${upg.name}</h4><p>${upg.desc}</p><div class="button-container"><button class="ksp-button disabled-buy techTree-button" disabled>🔒 Locked</button></div>`;
            continue;
        }
        
        if (upg.unlocked) {
            if (card.dataset.state === "unlocked") continue;
            card.dataset.state = "unlocked";
            card.className = 'upgrade-card unlocked-tech';
            card.innerHTML = `<h4>${upg.name}</h4><p>${upg.desc}</p><div class="button-container"><button class="ksp-button techTree-button" disabled>Researched</button></div>`;
            continue;
        }

        const currentState = canAfford ? "afford" : "cannot_afford";
        if (card.dataset.state === currentState) continue;

        card.dataset.state = currentState;
        card.className = 'upgrade-card available-tech';
        const btnClass = canAfford ? 'ksp-button btn-blue upgrade-btn techTree-button' : 'ksp-button disabled-buy';
        const disabledAttr = canAfford ? '' : 'disabled';
        
        card.innerHTML = `<h4>${upg.name}</h4><p>${upg.desc}</p><div class="button-container"><button class="${btnClass}" ${disabledAttr} onclick="buyUpgrade('${key}')">Research (${formatNumber(upg.cost)} ${ICON_SCI})</button></div>`;
    }
    requestAnimationFrame(() => drawTechLines());
}

function drawTechLines() {
    const canvas = document.getElementById('tech-tree-canvas');
    if (!canvas) return;

    let svg = document.getElementById('tech-lines');
    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'tech-lines';
        svg.classList.add('tech-lines');
        canvas.insertBefore(svg, canvas.firstChild);
    }
    
    const oldTransform = canvas.style.transform;
    canvas.style.transform = 'none';
    svg.style.width = '0px'; 
    svg.style.height = '0px';
    svg.innerHTML = '';
    
    const canvasRect = canvas.getBoundingClientRect();
    if (canvasRect.width === 0) {
        canvas.style.transform = oldTransform;
        return;
    }

    svg.style.width = canvas.scrollWidth + 'px';
    svg.style.height = canvas.scrollHeight + 'px';

    for (const key in gameData.upgrades) {
        const upg = gameData.upgrades[key];
        if (!upg.req || upg.req.length === 0) continue;

        const targetCard = document.getElementById(`upgrade-card-${key}`);
        if (!targetCard) continue;

        const tRect = targetCard.getBoundingClientRect();

        for (let i = 0; i < upg.req.length; i++) {
            const reqKey = upg.req[i];
            const sourceCard = document.getElementById(`upgrade-card-${reqKey}`);
            if (!sourceCard) continue;

            const sRect = sourceCard.getBoundingClientRect();
            const startX = sRect.right - canvasRect.left;
            const startY = sRect.top - canvasRect.top + (sRect.height / 2);
            const endX = tRect.left - canvasRect.left;
            const endY = tRect.top - canvasRect.top + (tRect.height / 2);

            let d = '';
            
            const dummyData = gameData.techDummies ? gameData.techDummies.find(dum => dum.target === key && dum.source === reqKey) : null;
            const dummyCard = dummyData ? document.getElementById(dummyData.id) : null;

            if (dummyCard) {
                const dRect = dummyCard.getBoundingClientRect();
                const dummyInX = dRect.left - canvasRect.left;
                const dummyOutX = dRect.right - canvasRect.left;
                const dummyY = dRect.top - canvasRect.top + (dRect.height / 2);
                const midX1 = startX + (dummyInX - startX) / 2;
                const midX2 = dummyOutX + (endX - dummyOutX) / 2;
                d = `M ${startX} ${startY} C ${midX1} ${startY}, ${midX1} ${dummyY}, ${dummyInX} ${dummyY} L ${dummyOutX} ${dummyY} C ${midX2} ${dummyY}, ${midX2} ${endY}, ${endX} ${endY}`;
            }

            if (!d) {
                const midX = startX + (endX - startX) / 2;
                d = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
            }

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            line.setAttribute('d', d);
            line.setAttribute('stroke-width', '4');
            line.setAttribute('fill', 'none');
            
            if (upg.unlocked || gameData.upgrades[reqKey].unlocked) {
                line.setAttribute('stroke', 'var(--ksp-blue)');
            } else {
                line.setAttribute('stroke', '#444444');
            }
            svg.appendChild(line);
        }
    }
    canvas.style.transform = oldTransform;
}

document.addEventListener('DOMContentLoaded', initTechTree);