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
            moveHero(heroNameToHero(msg.hero), Direction.LEFT);
            break;
        case 'move-right':
            // Logic to move right
            moveHero(heroNameToHero(msg.hero), Direction.RIGHT);
            break;
        case 'move-up':
            // Logic to move up
            moveHero(heroNameToHero(msg.hero), Direction.UP);
            break;
        case 'move-down':
            // Logic to move down
            moveHero(heroNameToHero(msg.hero), Direction.DOWN);
            break;
        case 'explore':
            if (msg.direction == "right") {
                exploreTile(Direction.RIGHT, -400, -400);
            }
            else if (msg.direction == "left") {
                exploreTile(Direction.LEFT, -400, -400);
            }
            else if (msg.direction == "up") {
                exploreTile(Direction.UP, -400, -400);
            }
            else if (msg.direction == "down") {
                exploreTile(Direction.DOWN, -400, -400);
            }
        // Handle allowed direction selection.
        case 'select-up':
            gameState.allowedDirections.push(Direction.UP);
            break;
        case 'select-down':
            gameState.allowedDirections.push(Direction.DOWN);
            break;
        case 'select-left':
            gameState.allowedDirections.push(Direction.LEFT);
            break;
        case 'select-right':
            gameState.allowedDirections.push(Direction.RIGHT);
            break;
        case 'deselect-up':
            gameState.allowedDirections = gameState.allowedDirections.filter((d) => d !== Direction.UP);
            break;
        case 'deselect-down':
            gameState.allowedDirections = gameState.allowedDirections.filter((d) => d !== Direction.DOWN);
            break;
        case 'deselect-left':
            gameState.allowedDirections = gameState.allowedDirections.filter((d) => d !== Direction.LEFT);
            break;
        case 'deselect-right':
            gameState.allowedDirections = gameState.allowedDirections.filter((d) => d !== Direction.RIGHT);
            break;
        // Generate tiles for number of players
        case 'generate-tiles':
            generateTiles(msg.numPlayers);
            break;
        case 'start-game':
            // 1. Move the starting tile to the center.
            showGameTile(1);
            var tile = getGameTile(1);
            setTileLocation(tile, 0, 0);
            // 2. Shuffle and flip over all the other tiles and move them to the side.
            for (let i = 2; i <= gameState.numTiles; i++) {
                hideGameTile(i);
                tile = getGameTile(i);
                setTileLocation(tile, -1200, -1200);
            }
            shuffleGameTiles();
            // 3. Place the heros on the starting tile.
            // TODO: randomize starting position
            // TODO: make sure they're at the top
            setHeroLocation(Hero.MAGE, 200, 200);
            setHeroLocation(Hero.ELF, 100, 200);
            setHeroLocation(Hero.DWARF, 100, 100);
            setHeroLocation(Hero.BARBARIAN, 200, 100);
            // TODO: Add other game-starting logic.
            // setInterval(updateTimer, 1000)
            break;
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
};
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["DOWN"] = 1] = "DOWN";
    Direction[Direction["LEFT"] = 2] = "LEFT";
    Direction[Direction["RIGHT"] = 3] = "RIGHT";
})(Direction || (Direction = {}));
var Hero;
(function (Hero) {
    Hero[Hero["MAGE"] = 0] = "MAGE";
    Hero[Hero["ELF"] = 1] = "ELF";
    Hero[Hero["BARBARIAN"] = 2] = "BARBARIAN";
    Hero[Hero["DWARF"] = 3] = "DWARF"; // orange
})(Hero || (Hero = {}));
var Tile;
(function (Tile) {
    Tile[Tile["NONE"] = 0] = "NONE";
    Tile[Tile["EXPLORE"] = 1] = "EXPLORE";
})(Tile || (Tile = {}));
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
const heroNameToHero = (heroName) => {
    if (heroName == "Mage") {
        return Hero.MAGE;
    }
    else if (heroName == "Elf") {
        return Hero.ELF;
    }
    else if (heroName == "Barbarian") {
        return Hero.BARBARIAN;
    }
    else if (heroName == "Dwarf") {
        return Hero.DWARF;
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
// TODO: the game tiles must be the bottom N tiles right now
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
const setTileLocation = (tile, x, y) => {
    tile.x = x;
    tile.y = y;
};
// This function is used to place the hero on the tile at (x, y)
// where (x, y) is the location of the top left corner. This should
// be used with portals and starting locations.
const setHeroLocation = (hero, x, y) => {
    let heroNode = getHeroNode(hero);
    heroNode.x = x + 10;
    heroNode.y = y + 10;
};
const moveHero = (hero, dir) => {
    let heroNode = getHeroNode(hero);
    let invalidMove = false;
    let destX = heroNode.x;
    let destY = heroNode.y;
    switch (dir) {
        case Direction.UP:
            destY = heroNode.y - 100;
            break;
        case Direction.DOWN:
            destY = heroNode.y + 100;
            break;
        case Direction.LEFT:
            destX = heroNode.x - 100;
            break;
        case Direction.RIGHT:
            destX = heroNode.x + 100;
            break;
    }
    // Check if we landed on an explore tile
    // Check for invalid things
    if (!invalidMove) {
        heroNode.x = destX;
        heroNode.y = destY;
    }
};
// Flip over the next tile and place it such that the arrow is facing
// dir and is located at (x, y)
const exploreTile = (exploreDirection, x, y) => {
    let page = getGamepageNode();
    let exploredTile;
    // 1. Flip over the next tile
    for (const node of page.children) {
        const i = parseInt(node.name);
        if (node.type != "INSTANCE" || i < 1 || i > gameState.numTiles) {
            continue;
        }
        // If the cover is on, remove it.
        if (node.children[18].visible) {
            exploredTile = node;
            node.children[18].visible = false;
            break;
        }
    }
    // 2. Determine where the arrow is and where it's facing
    let arrowCell;
    let arrowDirection;
    for (const node of exploredTile.children) {
        // This is a tile
        if (node.type != "GROUP") {
            continue;
        }
        arrowCell = node;
        let tileType = node.children[1].name.split('/');
        // If this is an explore tile
        if (tileType.length == 2 && tileType[0] == "Arrow") {
            arrowDirection = tileType[1];
            break;
        }
    }
    // 3. Rotate the arrow so that it's pointing in the same direction as dir
    // TODO: don't just use conditionals lol
    switch (exploreDirection) {
        case Direction.RIGHT:
            setTileLocation(exploredTile, x, y + 300);
            if (arrowDirection == "Up") {
                exploredTile.rotation = -90;
            }
            else if (arrowDirection == "Left") {
                exploredTile.rotation = 180;
                exploredTile.y = exploredTile.y;
            }
            else if (arrowDirection == "Down") {
                exploredTile.rotation = 90;
            }
            break;
        case Direction.LEFT:
            setTileLocation(exploredTile, x, y + 200);
            if (arrowDirection == "Up") {
                exploredTile.rotation = -90;
            }
            else if (arrowDirection == "Down") {
                exploredTile.rotation = 90;
            }
            else if (arrowDirection == "Right") {
                exploredTile.rotation = 180;
            }
            break;
        case Direction.UP:
            setTileLocation(exploredTile, x + 300, y - 400);
            if (arrowDirection == "Left") {
                exploredTile.rotation = -90;
            }
            else if (arrowDirection == "Down") {
                exploredTile.rotation = 180;
            }
            else if (arrowDirection == "Right") {
                exploredTile.rotation = 90;
            }
            break;
        case Direction.DOWN:
            setTileLocation(exploredTile, x - 200, y + 500);
            if (arrowDirection == "Up") {
                exploredTile.rotation = 180;
            }
            else if (arrowDirection == "Left") {
                exploredTile.rotation = 90;
            }
            else if (arrowDirection == "Right") {
                exploredTile.rotation = -90;
            }
            break;
    }
    console.log(arrowDirection, exploredTile.x, exploredTile.y, arrowCell.x, arrowCell.y);
};
// 1. Determine which side you’re expanding on (need tile rotation and explore property)
// 2. Check every tile to see what arrow you have
// 3. Based on the arrow direction, rotate it
// 4. Determine offset between arrow and top left
// 5. Set tile to be one space to the right (on the side you’re expanding on)
