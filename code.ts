// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { height: 300, width: 300 });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  switch (msg.type) {
    // Handle movement
    case 'move-left':
      // Logic to move left
      break
    case 'move-right':
      // Logic to move right
      break
    case 'move-up':
      // Logic to move up
      break
    case 'move-down':
      // Logic to move down
      break

    // Handle allowed direction selection.
    case 'select-up':
      gameState.allowedDirections.push(Directions.UP)
      break
    case 'select-down':
      gameState.allowedDirections.push(Directions.DOWN)
      break
    case 'select-left':
      gameState.allowedDirections.push(Directions.LEFT)
      break
    case 'select-right':
      gameState.allowedDirections.push(Directions.RIGHT)
      break
    case 'deselect-up':
      gameState.allowedDirections = gameState.allowedDirections.filter((d) => d !== Directions.UP)
      break
    case 'deselect-down':
      gameState.allowedDirections = gameState.allowedDirections.filter((d) => d !== Directions.DOWN)
      break
    case 'deselect-left':
      gameState.allowedDirections = gameState.allowedDirections.filter((d) => d !== Directions.LEFT)
      break
    case 'deselect-right':
      gameState.allowedDirections = gameState.allowedDirections.filter((d) => d !== Directions.RIGHT)
      break

    // Generate tiles for number of players
    case 'generate-tiles':
      generateTiles(msg.numPlayers)
      break

    case 'start-game':
      // TODO: Add other game-starting logic.
      setInterval(updateTimer, 1000)
      break
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
}

enum Directions {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

type GameState = {
  allowedDirections: Directions[],
  // TODO: Add more game-state specific values here.
}

const gameState: GameState = {
  allowedDirections: [],
}

const checkValidDirection = (direction: Directions) => {
  return gameState.allowedDirections.indexOf(direction) !== -1
}

const generateTiles = (numPlayers: number) => {
  // TODO: Generate the right move cards for the number of players
}

const updateTimer = () => {
  updateTimerInSeconds(getTimerInSeconds() - 1)
}

// TODO: Use this method when a player gets placed on a timer tile.
const flipTimer = () => {
  const currRemainingTime = getTimerInSeconds()
  const flippedRemainingTime = 60 * 3 - currRemainingTime
  updateTimerInSeconds(flippedRemainingTime)
}

const getTimerInSeconds = () => {
  const timerEl = figma.currentPage.findOne((node) => node.name === 'Timer' && node.type === 'TEXT') as TextNode
  const timeTokens = timerEl.characters.split(':')

  return parseInt(timeTokens[0]) * 60 + parseInt(timeTokens[1])
}

const updateTimerInSeconds = (timerInSeconds: number) => {
  const timerEl = figma.currentPage.findOne((node) => node.name === 'Timer' && node.type === 'TEXT') as TextNode

  const minutes = Math.floor(timerInSeconds / 60)
  const seconds = timerInSeconds - minutes * 60
  const newTime = `${minutes}:${(`0${seconds}`).slice(-2)}`

  figma.loadFontAsync(timerEl.fontName as FontName).then(() => {
    timerEl.deleteCharacters(0, timerEl.characters.length)
    timerEl.insertCharacters(0, newTime)
  })
}
