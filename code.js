// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
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
const gameState = {
    allowedDirections: []
};
const checkValidDirection = (direction) => {
    return gameState.allowedDirections.indexOf(direction) !== -1;
};
const generateTiles = (numPlayers) => {
    // TODO: Generate the right move cards for the number of players
};
const flipTimer = () => {
    const timerEl = figma.currentPage.findOne((node) => node.name === 'Timer' && node.type === 'TEXT');
    const timeTokens = timerEl.characters.split(':');
    const currRemainingTime = parseInt(timeTokens[0]) * 60 + parseInt(timeTokens[1]);
    const flippedRemainingTime = 60 * 3 - currRemainingTime;
    const minutes = Math.floor(flippedRemainingTime / 60);
    const seconds = flippedRemainingTime - minutes * 60;
    const newTime = `${minutes}:${(`0${seconds}`).slice(-2)}`;
    figma.loadFontAsync(timerEl.fontName).then(() => {
        timerEl.deleteCharacters(0, timerEl.characters.length);
        timerEl.insertCharacters(0, newTime);
    });
};
