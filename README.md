# Kerbal Clicker Program
A web-based incremental/clicker game inspired by the theme and aesthetics of **Kerbal Space Program (KSP)**. Build your space agency's economy, research new technologies, and explore the solar system—all managed from a dynamic, cartoon-style interactive star map.

## Overview
In KSP Idle-Game, you act as the mission director. The core loop revolves around generating passive income through buildings, managing resources, and unlocking advanced technologies. The entire game is built using **HTML, CSS, and Vanilla JavaScript**.

### Play the Game
You can play the game directly in your browser! It is fully compatible with **GitHub Pages**. 
**[Play KSP Idle-Game Here](https://joshua97979.github.io/KerbalClickerProgram/)**

## Key Features

- **Interactive Solar System Map:** A fullscreen, cartoon-style map acts as the game's background. Orbital paths are rendered using a dedicated SVG layer.
- **Economy System:** Purchase buildings on the right-side Action Panel to generate passive income. Advanced buildings and units become available after being unlocked in the Tech Tree.
- **Research & Development (R&D):** Unlock new action cards, upgrades, and capabilities through a dedicated technology tree.
- **Asteroid Mining:** Randomly spawning asteroids travel across the map and can be clicked for interactive rewards.
- **Time Warp & Prestige System:** Speed up in-game time to accelerate passive resource generation. Use the Prestige mechanic to reset your current progress in exchange for powerful permanent time-multipliers.

## Technology & Project Structure

This project uses zero external frameworks (Vanilla JS) and utilizes Flexbox and absolute positioning for its UI overlays.

To ensure maximum maintainability, the game logic is strictly modularized:

* `index.html` - The main entry point and UI skeleton.
* `style.css` - Contains all styling, animations, and responsive layout rules.
* `data.js` - Contains all static game data and configurations (planets, contracts, upgrades). Has zero DOM dependencies.
* `audio.js` - Encapsulates all audio objects, sound effects, volume controls, and mute states.
* `techTree.js` - Manages the R&D center logic and the rendering of the technology tree.
* `ui.js` - Handles all DOM updates, element caching, text formatting, and manages the UI performance pool.
* `asteroids.js` - Controls the random generation, movement logic, and click-handling of asteroids on the interactive map.
* `game.js` - The core application. Controls the main game loop, the save system, camera movement, and general user interactions.
