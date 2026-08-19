const Tutorial = {
    step: 0,
    active: false,
    promptModal: null,
    messageBox: null,
    backupData: null,

    init() {
        this.createUI();
    },

    createUI() {
        if (document.getElementById('tutorial-prompt-modal')) return;

        this.promptModal = document.createElement('div');
        this.promptModal.className = 'modal hidden';
        this.promptModal.id = 'tutorial-prompt-modal';
        this.promptModal.innerHTML = `
            <div class="modal-content esc-menu-content" style="border-color: var(--ksp-blue, #00d2ff);">
                <div class="modal-header" style="border-bottom: none;">
                    <h2 style="color: var(--ksp-blue, #00d2ff);">TUTORIAL TOUR</h2>
                </div>
                <p style="margin-bottom: 20px; text-align: center; font-size: 0.9rem; line-height: 1.4;">
                    Welcome to the KSP Idle-Game!<br>Would you like to take a short tour to learn the basics of navigation and controls?
                </p>
                <div class="esc-menu-buttons">
                    <button id="btn-skip-tutorial" class="ksp-button btn-red">Skip</button>
                    <button id="btn-confirm-tutorial" class="ksp-button btn-blue">Start Tour</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.promptModal);

        document.getElementById('btn-skip-tutorial').addEventListener('click', () => {
            this.promptModal.classList.add('hidden');
        });
        
        document.getElementById('btn-confirm-tutorial').addEventListener('click', () => {
            this.promptModal.classList.add('hidden');
            this.start();
        });

        this.messageBox = document.createElement('div');
        this.messageBox.id = 'tutorial-message-box';
        this.messageBox.className = 'hidden';
        document.body.appendChild(this.messageBox);
    },

    showPrompt() {
        if (this.active) return;
        
        if (!this.promptModal) this.createUI();
        if (!this.promptModal) return;

        this.promptModal.classList.remove('hidden');
    },

    setupEnvironment() {
        this.backupData = JSON.stringify(gameData);
        gameData.funds = 0;
        gameData.science = 40;
        
        gameData.completedContracts = gameData.completedContracts || [];
        gameData.claimedContracts = gameData.claimedContracts || [];
        
        gameData.completedContracts = gameData.completedContracts.filter(id => id !== 'start_funds');
        gameData.claimedContracts = gameData.claimedContracts.filter(id => id !== 'start_funds');

        if (gameData.upgrades) {
            for (const uKey in gameData.upgrades) {
                gameData.upgrades[uKey].unlocked = false;
                if (uKey === "commNet") continue;
                gameData.upgrades[uKey].req = []; 
            }
        }

        gameData.techDummies = [];

        for (const pKey in gameData.planets) {
            gameData.planets[pKey].unlocked = (pKey === 'kerbin' || pKey === 'kerbol');
            
            const wrapper = document.getElementById(`wrapper-${pKey}`);
            if (!wrapper) continue;
            
            const isVisible = (pKey === 'kerbin' || pKey === 'mun' || pKey === 'kerbol');
            wrapper.style.display = isVisible ? '' : 'none';
        }

        if (gameData.planets.kerbin?.units) {
            const kerbinUnits = gameData.planets.kerbin.units;
            for (const uKey in kerbinUnits) {
                kerbinUnits[uKey].owned = (uKey === 'rocket') ? 1 : 0; 
            }
            
            if (kerbinUnits.kerbalTraining) {
                kerbinUnits.kerbalTraining.baseCost = 15;
            }
        }

        // --- NEU: Mun Tutorial Konfiguration ---
        if (gameData.planets.mun) {
            gameData.planets.mun.unlockCost = 10;
            gameData.planets.mun.rocketUpgradeBaseCost = 1;
            gameData.planets.mun.unlockTime = 5; // Kürzere Dauer, damit der Spieler im Tutorial nicht zu lange warten muss
			gameData.planets.mun.baseTransferChance = 1.00;
        }

        // --- NEU: Tutorial Mission Belohnung (start_funds) ---
        const startContract = typeof contracts !== 'undefined' ? contracts.find(c => c.id === 'start_funds') : null;
        if (startContract) {
            startContract.originalRewardText = startContract.rewardText;
            startContract.originalReward = startContract.reward;
            startContract.rewardText = `+${formatNumber(2000)} ${ICON_FUNDS}`;
            startContract.reward = () => gameData.funds += 2000;
        }

		// Erzwingt den UI-Neuaufbau der Karte
        const startCard = document.getElementById('contract-card-start_funds');
        if (startCard) startCard.remove();
		
        this.injectCSS();

        selectPlanet('kerbol');
        recalculateCache();
        
        if (typeof updateHeader === 'function') updateHeader();
        if (typeof updatePanel === 'function') updatePanel();

        this.resetLaunchButton();

        document.querySelectorAll('.svg-orbit').forEach(el => {
            const isKerbin = el.classList.contains('svg-orbit-kerbin');
            const isMun = el.classList.contains('svg-orbit-mun');
            if (isKerbin || isMun) return;
            el.style.display = 'none';
        });
    },

    resetLaunchButton() {
        const btnClick = document.getElementById('btn-click');
        if (!btnClick) return;

        btnClick.innerHTML = 'Manual Launch!';
        btnClick.disabled = false;
        btnClick.classList.remove('disabled', 'disabled-buy');
    },

    injectCSS() {
        let styleEl = document.getElementById('tutorial-css');
        if (styleEl) return;

        styleEl = document.createElement('style');
        styleEl.id = 'tutorial-css';
        
        const allowedUnits = ['rocket', 'kerbalTraining', 'regolithLab'];

        let cssRules = `
            #tech-tree-canvas .upgrade-card:not(#upgrade-card-launchAbortSystem):not(#upgrade-card-commNet) {
                display: none !important;
            }
            #missions-container .action-card:not(#contract-card-start_funds),
            .contract-card:not(#contract-card-start_funds) {
                display: none !important;
            }
            #btn-unlock, 
            .btn-upgrade,
			#btn-buy-training,
			#btn-buy-rocket,
			.claim-mission-btn {
                pointer-events: none !important;
                opacity: 0.5 !important;
                filter: grayscale(100%) !important;
            }
        `;

        if (typeof unitDOMMapping === 'undefined') {
            styleEl.innerHTML = cssRules;
            document.head.appendChild(styleEl);
            return;
        }

        for (const uKey in unitDOMMapping) {
            if (allowedUnits.includes(uKey)) continue;
            
            const cardId = unitDOMMapping[uKey].cardId;
            if (!cardId) continue;
            
            cssRules += `#${cardId} { display: none !important; }\n`;
        }

        styleEl.innerHTML = cssRules;
        document.head.appendChild(styleEl);
    },
	
	unlockTransferInteraction() {
        const styleEl = document.getElementById('tutorial-css');
        if (!styleEl) return;

        styleEl.innerHTML += `
            #btn-unlock, 
            .btn-upgrade {
                pointer-events: auto !important;
                opacity: unset !important;
                filter: unset !important;
            }
        `;
    },
	
	unlockKerbalTrainingCenter() {
        const styleEl = document.getElementById('tutorial-css');
        if (!styleEl) return;

        styleEl.innerHTML += `
            #btn-buy-training {
                pointer-events: auto !important;
                opacity: unset !important;
                filter: unset !important;
            }
        `;
    },
	
	lockKerbalTrainingCenter() {
		const styleEl = document.getElementById('tutorial-css');
        if (!styleEl) return;

        styleEl.innerHTML += `
            #btn-buy-training {
                pointer-events: none !important;
                opacity: 0.5 !important;
                filter: grayscale(100%) !important;
            }
        `;
	},
	
	unlockClaimMission() {
        const styleEl = document.getElementById('tutorial-css');
        if (!styleEl) return;

        styleEl.innerHTML += ` 
            .claim-mission-btn {
                pointer-events: auto !important;
                opacity: unset !important;
                filter: unset !important;
            }
        `;
    },

    removeCSS() {
        const styleEl = document.getElementById('tutorial-css');
        if (!styleEl) return;
        styleEl.remove();
    },

    restoreEnvironment() {
        if (!this.backupData) return;

        const parsedData = JSON.parse(this.backupData);
        for (const key in gameData) {
            delete gameData[key];
        }
        Object.assign(gameData, parsedData);
        this.backupData = null;

		const missionContainer = document.getElementById('missions-container');
        if (missionContainer) missionContainer.innerHTML = '';

        // --- RESTORE: Tutorial Mission Belohnung (start_funds) ---
        const startContract = typeof contracts !== 'undefined' ? contracts.find(c => c.id === 'start_funds') : null;
        if (startContract && startContract.originalRewardText) {
            startContract.rewardText = startContract.originalRewardText;
            startContract.reward = startContract.originalReward;
            delete startContract.originalRewardText;
            delete startContract.originalReward;
        }

		// Karte auch beim Abbruch entfernen, damit der reguläre Text wiederhergestellt wird
        const startCard = document.getElementById('contract-card-start_funds');
        if (startCard) startCard.remove();
        this.removeCSS();

        for (const pKey in gameData.planets) {
            const wrapper = document.getElementById(`wrapper-${pKey}`);
            if (!wrapper) continue;
            wrapper.style.display = '';
        }

        document.querySelectorAll('.svg-orbit').forEach(el => {
            el.style.display = '';
        });

        recalculateCache();
        
        if (typeof updateHeader === 'function') updateHeader();
        if (typeof updatePanel === 'function') updatePanel();
        if (typeof renderUpgrades === 'function') renderUpgrades();
        if (typeof initializeMechJeb === 'function') initializeMechJeb();
		if (typeof updateMissions === 'function') updateMissions();

        selectPlanet(gameData.selectedPlanet);

        if (typeof saveGame === 'function') saveGame();
    },

    start() {
        if (this.active) return;
        
        if (typeof saveGame === 'function') saveGame();

        this.active = true;
        this.step = 1;
        this.setupEnvironment();
        if (this.messageBox) this.messageBox.style.pointerEvents = 'none';
        this.runStep();
    },

    runStep() {
        if (!this.active) return;
        this.clearHighlight();

        if (this.step === 1) this.stepOne();
        if (this.step === 2) this.stepTwo();
        if (this.step === 3) this.stepThree();
        if (this.step === 4) this.stepFour();
        if (this.step === 5) this.stepFive(); 
        if (this.step === 6) this.stepSix();
        if (this.step === 7) this.stepSeven();
        if (this.step === 8) this.stepEight();
        if (this.step === 9) this.stepNine();
        
        // --- NEUE SCHRITTE ---
        if (this.step === 10) this.stepTen();
        if (this.step === 11) this.stepEleven();
        if (this.step === 12) this.stepTwelve();
        if (this.step === 13) this.stepThirteen();
        if (this.step === 14) this.stepFourteen();
        if (this.step === 15) this.stepFifteen();
    },
    
    stepOne() {
        selectPlanet('kerbol');
        this.showMessage("Welcome to space!<br><br>Move the map by <b>clicking & dragging (Pan)</b> and zoom with the <b>mouse wheel</b>.<br><br>Now click on the planet <b>Kerbin</b> to focus it.");
        this.highlight('planet-kerbin');
        
        const checkKerbin = () => {
            if (gameData.selectedPlanet !== 'kerbin') return;
            document.removeEventListener('click', checkKerbin);
            this.step++;
            this.runStep();
        };
        document.addEventListener('click', checkKerbin);
    },
    
    stepTwo() {
        this.showMessage("Excellent! The camera is now locked on Kerbin.<br><br>You control your buildings and units in the right panel.<br><br>Click on <b>Manual Launch!</b> to launch your first rocket.");
        this.highlight('btn-click');

        const btnLaunch = document.getElementById('btn-click');
        if (!btnLaunch) return;
        
        const checkLaunch = () => {
            btnLaunch.removeEventListener('click', checkLaunch);
			document.removeEventListener('keydown', spaceHandler);
            this.step++;
            this.runStep();
        };
		
		const spaceHandler = (e) => {
            if (e.key !== ' ') return;
            checkLaunch();
        };
		
        btnLaunch.addEventListener('click', checkLaunch);
		document.addEventListener('keydown', spaceHandler);
    },

    stepThree() {
        this.showMessage("Perfect! You've gathered your first <b>Funds</b>.<br><br>Here you can keep track of your available <b>Funds</b> and <b>Science</b> points.<br><br><button id='btn-next-tutorial' class='ksp-button btn-blue' style='margin-top: 15px;'>Continue</button>");
        this.highlight('resource-display');

        const btnClick = document.getElementById('btn-click');
        if (btnClick) {
            btnClick.disabled = true;
            btnClick.classList.add('disabled', 'disabled-buy');
        }

        if (this.messageBox) {
            this.messageBox.style.pointerEvents = 'auto';
        }

        const btnNext = document.getElementById('btn-next-tutorial');
        if (!btnNext) return;

        btnNext.addEventListener('click', () => {
            if (this.messageBox) this.messageBox.style.pointerEvents = 'none';
            this.resetLaunchButton();
            this.step++;
            this.runStep();
        });
    },

    stepFour() {
        this.showMessage("Here is <b>Mission Control</b>.<br><br>Keep collecting funds until the <b>'The Space Program'</b> mission is 100% completed!");
        this.highlight('contract-card-start_funds');

        const checkContract = setInterval(() => {
            const contractDef = typeof contracts !== 'undefined' ? contracts.find(c => c.id === 'start_funds') : null;
            const isConditionMet = contractDef && contractDef.condition();
            const isCompleted = gameData.completedContracts && gameData.completedContracts.includes('start_funds');

            if (isConditionMet || isCompleted) { 
                clearInterval(checkContract);
                this.step++;
                this.runStep();
            }
        }, 500);
    },
    
    stepFive() {
        this.unlockClaimMission();
		
		this.showMessage("The mission is complete! Now click the <b>'Claim' button</b> to collect your reward.");
        this.highlight('#contract-card-start_funds button');

        const checkClaim = setInterval(() => {
            if (document.getElementById('contract-card-start_funds')) return;
            clearInterval(checkClaim);
            this.step++;
            this.runStep();
        }, 500);
    },

    stepSix() {
        this.unlockKerbalTrainingCenter();
		
		this.showMessage("You can buy units in the right panel with <b>Funds</b> to automate your progress. Some units generate <b>Funds</b>, while others generate <b>Science</b>.<br><br>Buy your first <b>Kerbal Training Center</b> to generate some <b>Science points</b>.");
        
        let targetId = 'unit-card-kerbalTraining';
        if (typeof unitDOMMapping !== 'undefined' && unitDOMMapping.kerbalTraining?.cardId) {
            targetId = unitDOMMapping.kerbalTraining.cardId;
        }
        this.highlight(targetId);

        const checkUnit = setInterval(() => {
            if (!gameData.planets?.kerbin?.units?.kerbalTraining) return;
            if (gameData.planets.kerbin.units.kerbalTraining.owned < 1) return;

            clearInterval(checkUnit);
            this.step++;
            this.runStep();
			this.lockKerbalTrainingCenter();
        }, 500);
    },

    stepSeven() {
        if (!gameData.upgrades) return;
        if (!gameData.upgrades.launchAbortSystem) return;

        if (typeof updateHeader === 'function') updateHeader();

        this.showMessage("To unlock new technologies, we need <b>Science Points</b>.<br>Open the <b>R&D Center</b> using the R&D button.");
        this.highlight('btn-rnd');

        const btnRnd = document.getElementById('btn-rnd');
        if (!btnRnd) return;

        const checkRnd = () => {
            btnRnd.removeEventListener('click', checkRnd);
            this.step++;
            this.runStep();
        };
        btnRnd.addEventListener('click', checkRnd);
    },

    stepEight() {
        this.showMessage("Welcome to the R&D center! Here you can research permanent upgrades.<br><br>Buy the <b>Launch Abort System</b> upgrade now.");
        
        // Kurzes Timeout, um sicherzustellen, dass renderUpgrades() den DOM-Tree aufgebaut hat
        setTimeout(() => {
            this.highlight('upgrade-card-launchAbortSystem');
        }, 150);

        const checkUpgrade = setInterval(() => {
            if (!gameData.upgrades) return;
            if (!gameData.upgrades.launchAbortSystem) return;
            if (!gameData.upgrades.launchAbortSystem.unlocked) return;

            clearInterval(checkUpgrade);
            this.step++;
            this.runStep();
        }, 500);
    },

    stepNine() {
        this.showMessage("Excellent! You have researched your first technology.<br><br>Close the R&D center to continue.");
        this.highlight('btn-rnd'); 

        const checkClose = setInterval(() => {
            const rndModal = document.getElementById('rnd-modal');
            if (!rndModal) return;
            if (!rndModal.classList.contains('hidden')) return;

            clearInterval(checkClose);
            this.step++;
            this.runStep();
        }, 500);
    },

    stepTen() {
        this.showMessage("There are many other celestial bodies to discover! Let's find out how to unlock them.<br><br><button id='btn-next-tutorial' class='ksp-button btn-blue' style='margin-top: 15px;'>Continue</button>");
        
        if (this.messageBox) this.messageBox.style.pointerEvents = 'auto';

        const btnNext = document.getElementById('btn-next-tutorial');
        if (!btnNext) return;

        btnNext.addEventListener('click', () => {
            if (this.messageBox) this.messageBox.style.pointerEvents = 'none';
            this.step++;
            this.runStep();
        }, { once: true });
    },

    stepEleven() {
        this.showMessage("Click on the <b>Mun</b> on the map to select it.");
        this.highlight('planet-mun');
		
		const checkMun = () => {
            if (gameData.selectedPlanet !== 'mun') return;
            document.removeEventListener('click', checkMun);
            clearInterval(checkInterval);
            this.step++;
            this.runStep();
        };
		
		document.addEventListener('click', checkMun);
        const checkInterval = setInterval(() => {
            if (gameData.selectedPlanet === 'mun') {
                document.removeEventListener('click', checkMun);
                clearInterval(checkInterval);
                this.step++;
                this.runStep();
            }
        }, 200);
    },

    stepTwelve() {
        this.unlockTransferInteraction();
		
		this.showMessage("This is the transfer panel. You have a certain <b>Success Chance</b> for the mission, which you can improve with rocket upgrades.<br><br>Start the transfer mission by clicking <b>Launch Transfer Mission</b>!");
        
        // Wir setzen ein Interval ein, da der Button möglicherweise kurz nach dem Klick asynchron vom UI gerendert wird
        const waitForBtn = setInterval(() => {
            const btnUnlock = document.getElementById('btn-unlock');
            if (!btnUnlock) return;

            clearInterval(waitForBtn);
            this.highlight('btn-unlock');
            
            const checkUnlock = () => {
                btnUnlock.removeEventListener('click', checkUnlock);
                this.step++;
                this.runStep();
            };
            btnUnlock.addEventListener('click', checkUnlock);
        }, 200);
    },

    stepThirteen() {
		
		this.showMessage("The rocket is on its way! Wait until the mission completes and the Mun is unlocked.");
        
        const checkUnlock = setInterval(() => {
            if (!gameData.planets.mun.unlocked) return;

            clearInterval(checkUnlock);
            this.step++;
            this.runStep();
        }, 500);
    },

    stepFourteen() {
        this.showMessage("Now that you have unlocked the Mun, you can also buy specific units here to generate additional <b>Funds</b> or <b>Science</b> points.<br><br><button id='btn-next-tutorial' class='ksp-button btn-blue' style='margin-top: 15px;'>Continue</button>");
        
        // HIER ANPASSEN: Ändere 'munRover' zu dem Key der Einheit aus der data.js
        let targetId = 'unit-card-munRover'; 
        if (typeof unitDOMMapping !== 'undefined' && unitDOMMapping.munRover?.cardId) {
            targetId = unitDOMMapping.munRover.cardId;
        }
        
        this.highlight(targetId);

        if (!this.messageBox) return;
        this.messageBox.style.pointerEvents = 'auto';

        const btnNext = document.getElementById('btn-next-tutorial');
        if (!btnNext) return;

        btnNext.addEventListener('click', () => {
            this.messageBox.style.pointerEvents = 'none';
            this.step++;
            this.runStep();
        }, { once: true });
    },

    stepFifteen() {
        this.showMessage("Very good! You have successfully completed your first mission, unlocked your first technology, and reached the Mun.<br><br>Tour complete! Fly safe!<br><br><button id='btn-finish-tutorial' class='ksp-button btn-blue' style='margin-top: 15px;'>Finish</button>");
        
        if (!this.messageBox) return;
        this.messageBox.style.pointerEvents = 'auto';

        const btnFinish = document.getElementById('btn-finish-tutorial');
        if (!btnFinish) return;
        
        btnFinish.addEventListener('click', () => this.end());
    },

    // --- HILFSMETHODEN (UNVERÄNDERT) ---

    showMessage(text) {
        if (!this.messageBox) return;
        this.messageBox.innerHTML = text;
        this.messageBox.classList.remove('hidden');
    },

    highlight(target) {
        let el = document.getElementById(target) || document.querySelector(target);
        if (!el) return;
		
		el.classList.add('tutorial-highlight');
    },

    clearHighlight() {
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
    },

    end() {
        this.active = false;
        if (!this.messageBox) return;
        
        this.messageBox.classList.add('hidden');
        this.messageBox.style.pointerEvents = 'none';
        this.clearHighlight();
        this.restoreEnvironment();
    }
};

document.addEventListener('DOMContentLoaded', () => Tutorial.init());