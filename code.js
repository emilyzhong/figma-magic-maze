// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { height: 600, width: 300 });
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    switch (msg.type) {
        // Handle movement
        case 'move-left':
            // Logic to move left
            break;
        case 'move-right':
            // Logic to move right
            break;
        case 'move-up':
            // Logic to move up
            break;
        case 'move-down':
            // Logic to move down
            break;
        // Handle allowed direction selection.
        case 'select-up':
            gameState.allowedDirections.push(Directions.UP);
            break;
        case 'select-down':
            gameState.allowedDirections.push(Directions.DOWN);
            break;
        case 'select-left':
            gameState.allowedDirections.push(Directions.LEFT);
            break;
        case 'select-right':
            gameState.allowedDirections.push(Directions.RIGHT);
            break;
        case 'deselect-up':
            gameState.allowedDirections = gameState.allowedDirections.filter((d) => d !== Directions.UP);
            break;
        case 'deselect-down':
            gameState.allowedDirections = gameState.allowedDirections.filter((d) => d !== Directions.DOWN);
            break;
        case 'deselect-left':
            gameState.allowedDirections = gameState.allowedDirections.filter((d) => d !== Directions.LEFT);
            break;
        case 'deselect-right':
            gameState.allowedDirections = gameState.allowedDirections.filter((d) => d !== Directions.RIGHT);
            break;
        // Generate tiles for number of players
        case 'generate-tiles':
            generateTiles(msg.numPlayers);
            break;
        case 'start-game':
            // 1. Move the starting tile to the center.
            showGameTile(1);
            var tile = getGameTile(1);
            moveTile(tile, 0, 0);
            // 2. Shuffle and flip over all the other tiles and move them to the side.
            shuffleGameTiles();
            for (let i = 2; i <= gameState.numTiles; i++) {
                hideGameTile(i);
                tile = getGameTile(i);
                moveTile(tile, -1200, -1200);
            }
            // 3. Place the heros on the starting tile.
            // TODO: randomize starting position
            moveHero(Hero.MAGE, 200, 200);
            moveHero(Hero.ELF, 100, 200);
            moveHero(Hero.DWARF, 100, 100);
            moveHero(Hero.BARBARIAN, 200, 100);
            // TODO: Add other game-starting logic.
            setInterval(updateTimer, 1000);
            break;
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
};
var Directions;
(function (Directions) {
    Directions[Directions["UP"] = 0] = "UP";
    Directions[Directions["DOWN"] = 1] = "DOWN";
    Directions[Directions["LEFT"] = 2] = "LEFT";
    Directions[Directions["RIGHT"] = 3] = "RIGHT";
})(Directions || (Directions = {}));
var Hero;
(function (Hero) {
    Hero[Hero["MAGE"] = 0] = "MAGE";
    Hero[Hero["ELF"] = 1] = "ELF";
    Hero[Hero["BARBARIAN"] = 2] = "BARBARIAN";
    Hero[Hero["DWARF"] = 3] = "DWARF"; // orange
})(Hero || (Hero = {}));
const GAME_PAGENAME = "Game (play here)";
const gameState = {
    allowedDirections: [],
    // TODO: This should be determined by the player
    numTiles: 12,
    tiles: []
};
const checkValidDirection = (direction) => {
    return gameState.allowedDirections.indexOf(direction) !== -1;
};
const generateTiles = (numPlayers) => {
    // TODO: Generate the right move cards for the number of players
};
const updateTimer = () => {
    updateTimerInSeconds(getTimerInSeconds() - 1);
};
// TODO: Use this method when a player gets placed on a timer tile.
const flipTimer = () => {
    const currRemainingTime = getTimerInSeconds();
    const flippedRemainingTime = 60 * 3 - currRemainingTime;
    updateTimerInSeconds(flippedRemainingTime);
};
const getTimerInSeconds = () => {
    const timerEl = figma.currentPage.findOne((node) => node.name === 'Timer' && node.type === 'TEXT');
    const timeTokens = timerEl.characters.split(':');
    return parseInt(timeTokens[0]) * 60 + parseInt(timeTokens[1]);
};
const updateTimerInSeconds = (timerInSeconds) => {
    const timerEl = figma.currentPage.findOne((node) => node.name === 'Timer' && node.type === 'TEXT');
    const minutes = Math.floor(timerInSeconds / 60);
    const seconds = timerInSeconds - minutes * 60;
    const newTime = `${minutes}:${(`0${seconds}`).slice(-2)}`;
    figma.loadFontAsync(timerEl.fontName).then(() => {
        timerEl.deleteCharacters(0, timerEl.characters.length);
        timerEl.insertCharacters(0, newTime);
    });
};
const heroToHeroName = (hero) => {
    switch (hero) {
        case Hero.MAGE:
            return "Mage";
        case Hero.ELF:
            return "Elf";
        case Hero.DWARF:
            return "Dwarf";
        case Hero.BARBARIAN:
            return "Barbarian";
        default:
            throw Error("uh-oh");
    }
};
const getGamepageNode = () => {
    for (const page of figma.root.children) {
        if (page.name == GAME_PAGENAME) {
            return page;
        }
    }
    figma.notify("Couldn't find game page");
    figma.closePlugin();
};
// Returns the game tile from cache. If the cache is empty, populate the cache with game tiles.
const getGameTile = (i) => {
    console.assert(0 < i && i <= gameState.numTiles, `Expected ${i} to be between 0 and ${gameState.numTiles}`);
    if (gameState.tiles.length === 0) {
        // leave an empty space for 0-th tile
        gameState.tiles = new Array(gameState.numTiles + 1);
        const page = getGamepageNode();
        for (const node of page.children) {
            if (node.type == "INSTANCE") {
                const i = parseInt(node.name);
                gameState.tiles[i] = node;
            }
        }
    }
    return gameState.tiles[i];
};
const showGameTile = (i) => {
    let tile = getGameTile(i);
    tile.children[18].visible = false;
};
const hideGameTile = (i) => {
    var tile = getGameTile(i);
    tile.children[18].visible = true;
};
const shuffleGameTiles = () => {
    const page = getGamepageNode();
    let arr = Array.from(page.children);
    for (let i = 0; i < gameState.numTiles; i++) {
        const offset = Math.floor(Math.random() * (gameState.numTiles - i));
        const tmp = gameState.tiles[i];
        arr[i] = gameState.tiles[i + offset];
        arr[i + offset] = tmp;
    }
    for (const tile of arr) {
        page.appendChild(tile);
    }
};
const getHeroNode = (hero) => {
    const page = getGamepageNode();
    for (const node of page.children) {
        if (node.name === heroToHeroName(hero)) {
            return node;
        }
    }
};
const moveTile = (tile, x, y) => {
    tile.x = x;
    tile.y = y;
};
// This function is used to place the hero on the tile at (x, y)
// where (x, y) is the location of the top left corner.
const moveHero = (hero, x, y) => {
    let heroNode = getHeroNode(hero);
    heroNode.x = x + 10;
    heroNode.y = y + 10;
};
