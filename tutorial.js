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
		// Falls UI noch nicht existiert, explizit erstellen
		if (!this.promptModal) {
            this.createUI();
        }
        if (this.active) return;
        if (!this.promptModal) return;
        this.promptModal.classList.remove('hidden');
    },

    setupEnvironment() {
        this.backupData = JSON.stringify(gameData);
        gameData.funds = 0;

        for (const pKey in gameData.planets) {
            gameData.planets[pKey].unlocked = (pKey === 'kerbin' || pKey === 'kerbol');
            
            const isVisible = (pKey === 'kerbin' || pKey === 'mun' || pKey === 'kerbol');
            const wrapper = document.getElementById(`wrapper-${pKey}`);
            if (!wrapper) continue;
            wrapper.style.display = isVisible ? '' : 'none';
        }

        if (!gameData.planets.kerbin) return;
        if (!gameData.planets.kerbin.units) return;

        const kerbinUnits = gameData.planets.kerbin.units;
        const unitKeys = Object.keys(kerbinUnits);
        const secondUnitKey = unitKeys.find(k => k !== 'rocket');

        for (const uKey of unitKeys) {
            if (uKey !== 'rocket' && uKey !== secondUnitKey) {
                delete kerbinUnits[uKey];
                continue;
            }
            kerbinUnits[uKey].owned = (uKey === 'rocket') ? 1 : 0; 
        }

        if (typeof unitDOMMapping !== 'undefined') {
            for (const uKey in unitDOMMapping) {
                const prefix = unitDOMMapping[uKey].prefix;
                const btn = document.getElementById(`btn-buy-${prefix}`);
                if (!btn) continue;
                
                const card = btn.closest('.unit-card') || btn.parentElement;
                if (!card) continue;
                
                card.style.display = (uKey === 'rocket' || uKey === secondUnitKey) ? '' : 'none';
            }
        }

        selectPlanet('kerbol');
        recalculateCache();
        
        if (typeof updateHeader === 'function') updateHeader();
        if (typeof updatePanel === 'function') updatePanel();

        document.querySelectorAll('.svg-orbit').forEach(el => {
            const isKerbin = el.classList.contains('svg-orbit-kerbin');
            const isMun = el.classList.contains('svg-orbit-mun');
            if (isKerbin || isMun) return;
            el.style.display = 'none';
        });
    },

    restoreEnvironment() {
        if (!this.backupData) return;

        const parsedData = JSON.parse(this.backupData);
        for (const key in gameData) {
            delete gameData[key];
        }
        Object.assign(gameData, parsedData);
        this.backupData = null;

        for (const pKey in gameData.planets) {
            const wrapper = document.getElementById(`wrapper-${pKey}`);
            if (!wrapper) continue;
            wrapper.style.display = '';
        }

        if (typeof unitDOMMapping !== 'undefined') {
            for (const uKey in unitDOMMapping) {
                const prefix = unitDOMMapping[uKey].prefix;
                const btn = document.getElementById(`btn-buy-${prefix}`);
                if (!btn) continue;
                
                const card = btn.closest('.unit-card') || btn.parentElement;
                if (!card) continue;
                
                card.style.display = '';
            }
        }

        document.querySelectorAll('.svg-orbit').forEach(el => {
            el.style.display = '';
        });

        recalculateCache();
        
        if (typeof updateHeader === 'function') updateHeader();
        if (typeof updatePanel === 'function') updatePanel();
        if (typeof renderUpgrades === 'function') renderUpgrades();

        selectPlanet(gameData.selectedPlanet);

        // Nach der Wiederherstellung den echten Spielstand direkt abspeichern
        if (typeof saveGame === 'function') saveGame();
    },

    start() {
        if (this.active) return;
        
        // Echten Spielstand sichern, bevor das Tutorial die Daten verändert
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
            this.step++;
            this.runStep();
        };
        btnLaunch.addEventListener('click', checkLaunch);
    },
    
    stepThree() {
        this.showMessage("Perfect! You've gathered your first funds.<br><br>Keep collecting resources, buy upgrades in the R&D center, and unlock new planets.<br><br>Tour complete! Fly safe!<br><br><button id='btn-finish-tutorial' class='ksp-button btn-blue' style='margin-top: 15px;'>Finish</button>");
        
        if (this.messageBox) this.messageBox.style.pointerEvents = 'auto';

        const btnFinish = document.getElementById('btn-finish-tutorial');
        if (!btnFinish) return;
        
        btnFinish.addEventListener('click', () => {
            this.end();
        });
    },

    showMessage(text) {
        if (!this.messageBox) return;
        this.messageBox.innerHTML = text;
        this.messageBox.classList.remove('hidden');
    },

    highlight(id) {
        const el = document.getElementById(id);
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
        if (this.messageBox) {
            this.messageBox.classList.add('hidden');
            this.messageBox.style.pointerEvents = 'none';
        }
        this.clearHighlight();
        this.restoreEnvironment();
    }
};

document.addEventListener('DOMContentLoaded', () => Tutorial.init());