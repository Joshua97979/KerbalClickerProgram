// audio.js
// Kapselt die Steuerung aller Audio-Objekte, Lautstärkeregler und Stummschalt-Zustände.

const bgMusic = document.getElementById('bg-music');
const musicToggleBtns = document.querySelectorAll('.music-toggle-btn');
const sliderMusic = document.getElementById('slider-music');
const sliderSound = document.getElementById('slider-sound');
const soundToggleBtns = document.querySelectorAll('.sound-toggle-btn');

let isMusicPlaying = false;
let isSoundEnabled = false;
let currentSoundVolume = 1.0;

const sfxClick = new Audio('sounds/sfx/ButtonClick.mp3');
const sfxMission = new Audio('sounds/sfx/MissionComplete.mp3');
const sfxPlanet = new Audio('sounds/sfx/SelectPlanet.mp3');
const sfxInfoOpen = new Audio('sounds/sfx/InfoPanelOpen.mp3');
const sfxTransferComplete = new Audio('sounds/sfx/TransferMissionCompleted.mp3');
const sfxTransferFailed = new Audio('sounds/sfx/TransferMissionFailed.mp3');

function initAudio() {
    const savedMusicVolume = localStorage.getItem('kspMusicVolume');
    const savedSoundVolume = localStorage.getItem('kspSoundVolume');

    if (sliderMusic) {
        if (savedMusicVolume !== null) sliderMusic.value = savedMusicVolume;
        const maxMusic = parseFloat(sliderMusic.max || 100);
        const valMusic = parseFloat(sliderMusic.value);
        if (bgMusic) bgMusic.volume = maxMusic <= 1 ? valMusic : valMusic / maxMusic;
    } else if (bgMusic && savedMusicVolume !== null) {
        const val = parseFloat(savedMusicVolume);
        bgMusic.volume = val > 1 ? val / 100 : val;
    }

    if (sliderSound) {
        if (savedSoundVolume !== null) sliderSound.value = savedSoundVolume;
        const maxSound = parseFloat(sliderSound.max || 100);
        const valSound = parseFloat(sliderSound.value);
        currentSoundVolume = maxSound <= 1 ? valSound : valSound / maxSound;
    } else if (savedSoundVolume !== null) {
        const val = parseFloat(savedSoundVolume);
        currentSoundVolume = val > 1 ? val / 100 : val;
    }

    const savedAudioState = sessionStorage.getItem('kspAudioState');
    sessionStorage.removeItem('kspAudioState');
    if (!savedAudioState) return;

    const audioState = JSON.parse(savedAudioState);
    isSoundEnabled = audioState.sound;

    if (!audioState.music) return;
    if (!bgMusic) return;

    isMusicPlaying = true;
    bgMusic.play().catch(err => {
        console.warn('Browser blockiert Autoplay nach Reload:', err);
        isMusicPlaying = false;
        updateMusicIcons();
    });
}

function updateMusicIcons() {
    musicToggleBtns.forEach(btn => {
        const icon = btn.querySelector('img');
        if (!icon) return;

        if (!isMusicPlaying) {
            icon.src = 'textures/MusicOff_Icon.png';
            icon.alt = 'Music Off';
            return;
        }
        
        icon.src = 'textures/MusicOn_Icon.png';
        icon.alt = 'Music On';
    });
}

function updateSoundIcons() {
    soundToggleBtns.forEach(btn => {
        const icon = btn.querySelector('img');
        if (!icon) return;

        if (!isSoundEnabled) {
            icon.src = 'textures/SoundOff_Icon.png';
            icon.alt = 'Sound Off';
            return;
        }

        icon.src = 'textures/SoundOn_Icon.png';
        icon.alt = 'Sound On';
    });
}

function playSFX(audioObj) {
    if (!isSoundEnabled) return;
    if (!audioObj) return;
    
    const sound = audioObj.cloneNode(); 
    sound.volume = currentSoundVolume; 
    sound.play().catch(err => console.warn('Audio play blocked by browser:', err));
}

function setupAudioListeners() {
    musicToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!bgMusic) return;

            if (isMusicPlaying) {
                bgMusic.pause();
                isMusicPlaying = false;
                updateMusicIcons();
                return;
            }

            bgMusic.play().catch(err => console.warn('Audio play blocked by browser:', err));
            isMusicPlaying = true;
            updateMusicIcons();
        });
    });

    if (sliderMusic) {
        sliderMusic.addEventListener('input', (e) => {
            const max = parseFloat(e.target.max || 100);
            const val = parseFloat(e.target.value);
            const vol = max <= 1 ? val : val / max; 
            
            if (bgMusic) bgMusic.volume = vol;
            localStorage.setItem('kspMusicVolume', val);
            
            if (vol === 0 && isMusicPlaying) {
                isMusicPlaying = false;
                if (bgMusic) bgMusic.pause();
                updateMusicIcons();
                return;
            }
            
            if (vol > 0 && !isMusicPlaying) {
                isMusicPlaying = true;
                if (bgMusic) bgMusic.play().catch(err => console.warn('Audio play blocked:', err));
                updateMusicIcons();
            }
        });
    }

    soundToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isSoundEnabled) {
                isSoundEnabled = false;
                updateSoundIcons();
                return;
            }

            isSoundEnabled = true;
            updateSoundIcons();
        });
    });

    if (sliderSound) {
        sliderSound.addEventListener('input', (e) => {
            const max = parseFloat(e.target.max || 100);
            const val = parseFloat(e.target.value);
            const vol = max <= 1 ? val : val / max;
            
            currentSoundVolume = vol;
            localStorage.setItem('kspSoundVolume', val);

            if (vol === 0 && isSoundEnabled) {
                isSoundEnabled = false;
                updateSoundIcons();
                return;
            }
            
            if (vol > 0 && !isSoundEnabled) {
                isSoundEnabled = true;
                updateSoundIcons();
            }
        });
        
        sliderSound.addEventListener('change', (e) => {
            const max = parseFloat(e.target.max || 100);
            const val = parseFloat(e.target.value);
            const vol = max <= 1 ? val : val / max;
            
            if (vol === 0) return;

            playSFX(sfxClick);
        });
    }
}

// Initialisierung
initAudio();
setupAudioListeners();