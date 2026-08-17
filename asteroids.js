// asteroids.js
// Verwaltet das Erzeugen, Bewegen und Anklicken von Asteroiden auf der Karte.

const ASTEROID_CONFIG = {
    minSpawnInterval: 4, 
    maxSpawnInterval: 12,
    maxAsteroids: 4,
    minSpeedMs: 150000,    
    maxSpeedMs: 100000,
    minApproach: 400,     
    maxApproach: 1500,     
    baseMinRewardFunds: 100,  
    baseMaxRewardFunds: 500,
    baseMinRewardScience: 5,  
    baseMaxRewardScience: 25
};

let activeAsteroids = [];
let nextAsteroidSpawnTick = getRandomAsteroidInterval();
let asteroidTimer = 0;

function getRandomAsteroidInterval() {
    return Math.floor(Math.random() * (ASTEROID_CONFIG.maxSpawnInterval - ASTEROID_CONFIG.minSpawnInterval + 1)) + ASTEROID_CONFIG.minSpawnInterval;
}

function updateAsteroids(effectiveTime) {
    asteroidTimer += effectiveTime;
    
    if (asteroidTimer < nextAsteroidSpawnTick) return;

    spawnAsteroid();
    asteroidTimer = 0;
    nextAsteroidSpawnTick = getRandomAsteroidInterval();
}

function spawnAsteroid() {
    if (!gameData.upgrades.trackingStation.unlocked) return;
    if (activeAsteroids.length >= ASTEROID_CONFIG.maxAsteroids) return;

    const layer = document.getElementById('asteroid-layer');
    if (!layer) return;

    const mapRect = mapSection.getBoundingClientRect();
    const safeRadius = (Math.max(mapRect.width, mapRect.height) / mapScale) * 0.6 + 800;

    const startAngle = Math.random() * Math.PI * 2;
    const startX = Math.cos(startAngle) * safeRadius;
    const startY = Math.sin(startAngle) * safeRadius;

    const endAngle = startAngle + Math.PI + (Math.random() - 0.5) * (Math.PI * 0.6);
    const endX = Math.cos(endAngle) * safeRadius;
    const endY = Math.sin(endAngle) * safeRadius;

    const curveDirection = Math.random() > 0.5 ? 1 : -1;
    const ctrlAngle = startAngle + (Math.PI / 2) * curveDirection;
    const approachDist = ASTEROID_CONFIG.minApproach + Math.random() * (ASTEROID_CONFIG.maxApproach - ASTEROID_CONFIG.minApproach);
    
    const ctrlX = Math.cos(ctrlAngle) * approachDist;
    const ctrlY = Math.sin(ctrlAngle) * approachDist;

    const pathData = `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;

    const group = document.createElement('div');
    group.className = 'asteroid-group';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'asteroid-path-svg');
    
    const pathNode = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathNode.setAttribute('class', 'asteroid-path');
    pathNode.setAttribute('d', pathData);
    svg.appendChild(pathNode);

    const sprite = document.createElement('div');
    sprite.className = 'asteroid-sprite';
    sprite.style.offsetPath = `path('${pathData}')`;
    sprite.style.offsetAnchor = 'center';

    group.appendChild(svg);
    group.appendChild(sprite);
    layer.appendChild(group);

    const asteroidObj = { group, sprite };
    activeAsteroids.push(asteroidObj);

    const speedMs = ASTEROID_CONFIG.minSpeedMs + Math.random() * (ASTEROID_CONFIG.maxSpeedMs - ASTEROID_CONFIG.minSpeedMs);
    const anim = sprite.animate([
        { offsetDistance: '0%' },
        { offsetDistance: '100%' }
    ], {
        duration: speedMs,
        easing: 'linear',
        fill: 'forwards'
    });

    anim.playbackRate = getWarpMultiplier(currentWarpIndex);

    anim.onfinish = () => {
        group.remove();
        activeAsteroids = activeAsteroids.filter(a => a !== asteroidObj);
    };

    sprite.addEventListener('mouseenter', () => svg.style.opacity = '1');
    sprite.addEventListener('mouseleave', () => svg.style.opacity = '0');
    
    // Verhindert, dass der Klick als mousedown auf die Map weitergeleitet wird und den Kamerafokus löscht
    sprite.addEventListener('mousedown', (e) => e.stopPropagation());
    
    sprite.addEventListener('click', (e) => {
        e.stopPropagation();
		
		gameData.asteroidsCaught = (gameData.asteroidsCaught || 0) + 1;
		
        const chance = Math.random();
        const giveFunds = chance < 0.7;
        const giveScience = chance > 0.3;

        if (anim) anim.pause();
        sprite.style.backgroundImage = 'none';
        sprite.style.pointerEvents = 'none';
        
        sprite.style.offsetRotate = '0deg';
        sprite.style.transform = 'none';

        const currentInc = getTotalIncome();
        const currentSci = getTotalScience();

        if (giveFunds) {
            const dynamicMinFunds = Math.max(ASTEROID_CONFIG.baseMinRewardFunds, currentInc * 30);
            const dynamicMaxFunds = Math.max(ASTEROID_CONFIG.baseMaxRewardFunds, currentInc * 90);
            const funds = Math.floor(Math.random() * (dynamicMaxFunds - dynamicMinFunds + 1)) + dynamicMinFunds;
            
            gameData.funds += funds;
            gameData.totalFundsEarned += funds;
            createFloatingText(sprite, `+${formatNumber(funds)} ${ICON_FUNDS}`, 'text-green');
        }

        if (giveScience) {
            const dynamicMinSci = Math.max(ASTEROID_CONFIG.baseMinRewardScience, currentSci * 15);
            const dynamicMaxSci = Math.max(ASTEROID_CONFIG.baseMaxRewardScience, currentSci * 45);
            const science = Math.floor(Math.random() * (dynamicMaxSci - dynamicMinSci + 1)) + dynamicMinSci;
            
            gameData.science += science;
            gameData.totalScienceEarned += science;
            
            setTimeout(() => {
                if (!sprite.parentNode) return;
                createFloatingText(sprite, `+${formatNumber(science)} ${ICON_SCI}`, 'text-blue');
            }, 200 / getWarpMultiplier(currentWarpIndex));
        }

        updateHeader();

        if (typeof playSFX === 'function' && typeof sfxMission !== 'undefined') {
            playSFX(sfxMission);
        }

        activeAsteroids = activeAsteroids.filter(a => a !== asteroidObj);

        setTimeout(() => {
            if (group.parentNode) group.remove();
        }, 1200 / getWarpMultiplier(currentWarpIndex));
    });
}