'use strict';

const gameForm = document.getElementById('game-form');
const gameTable = document.getElementById('game-table');
const outputTable = document.getElementById('game-output');

const sleepMS = 100;

let hasGameStarted = false;
let currentPlayers = [];

function gameStartHandler(event) {
  event.preventDefault();

  startGame();
}

function startGame() {
  resetGame(true);

  hasGameStarted = true;
  formButtonToggler();

  createPlayersInDom();

  startRacing();
}

function gameResetHandler(event) {
  event.preventDefault();

  resetGame();
}

function resetGame(hardReset = false) {
  hasGameStarted = false;
  formButtonToggler();

  // Step 7
  if (hardReset) {
    removePlayersFromDOM();
  } else {
    resetPlayersPosition();
  }

  resetOutputTable();
}

function createPlayersInDom() {
  currentPlayers = [];

  const numberOfPlayers = getNumberOfPlayers();

  // Populate array with objects
  for (let index = 1; index < numberOfPlayers + 1; index++) {
    const imagePath = `img/car${index}.png`;

    // Step 2
    currentPlayers.push({ playerNumber: index, score: 0, imagePath });
  }

  // Create DOM game table
  currentPlayers.forEach((player) => {
    const carContainerElement = document.createElement('li');
    carContainerElement.classList.add('car-container');

    const labelElement = document.createElement('label');
    labelElement.textContent = `Player ${player.playerNumber}`;

    const carLaneElement = document.createElement('div');
    carLaneElement.id = `car-lane-${player.playerNumber}`;
    carLaneElement.classList.add('car-lane');

    const carImageElement = document.createElement('img');
    carImageElement.id = `player-${player.playerNumber}`;
    carImageElement.classList.add('car');
    carImageElement.src = player.imagePath;
    carImageElement.alt = `Car of player ${player.playerNumber}`;
    // Step 3
    carImageElement.style.marginLeft = '0px';

    const finishLineElement = document.createElement('div');
    finishLineElement.classList.add('finish-line');

    carContainerElement.appendChild(labelElement);

    carContainerElement.appendChild(carLaneElement);
    carLaneElement.appendChild(carImageElement);

    carContainerElement.appendChild(finishLineElement);

    gameTable.appendChild(carContainerElement);
  });
}

function removePlayersFromDOM() {
  gameTable.innerHTML = '';
}

function resetPlayersPosition() {
  for (const player of currentPlayers) {
    const playerElement = document.getElementById(
      `player-${player.playerNumber}`
    );

    movePlayerTo(player, '0%');
  }
}

async function startRacing() {
  let winner = undefined;

  const scoreToWin = getScoreToWin();

  winnerLoop: while (!winner) {
    for (const player of currentPlayers) {
      await sleep(sleepMS);

      const playerElement = document.getElementById(
        `player-${player.playerNumber}`
      );

      const turnCarAdvantage = calculateCarAdvantage();

      player.score += turnCarAdvantage;

      if (player.score > scoreToWin) {
        player.score = scoreToWin;
      }

      // Step 5
      movePlayerTo(player, `${player.score}%`);

      // console.log(player);

      // Step 9
      if (player.score >= scoreToWin) {
        winner = player;
        break winnerLoop;
      }
    }
  }

  createOutputTable();
}

function movePlayerTo(player, position) {
  const playerElement = document.getElementById(
    `player-${player.playerNumber}`
  );

  playerElement.animate([{ marginLeft: position }], {
    duration: sleepMS,
    easing: 'ease-in-out',
    fill: 'both',
  }).onfinish = () => {
    playerElement.style.marginLeft = position;
  };
}

// Step 10
function createOutputTable() {
  outputTable.hidden = false;

  // Sort by score
  const playersSortedByScore = currentPlayers.sort(function (a, b) {
    return a.score - b.score;
  });
  const tableBody = outputTable.getElementsByTagName('tbody')[0];

  for (const player of playersSortedByScore) {
    const tableRow = tableBody.insertRow(0);

    const playerNumberTableData = tableRow.insertCell();
    playerNumberTableData.textContent = player.playerNumber;

    const playerScoreTableData = tableRow.insertCell();
    playerScoreTableData.textContent = player.score;
  }
}

function resetOutputTable() {
  outputTable.hidden = true;

  outputTable.getElementsByTagName('tbody')[0].innerHTML = '';
}

function formButtonToggler() {
  const gameFormSubmitButton = document.getElementById('submit-btn');
  const gameFormResetButton = document.getElementById('reset-btn');

  if (hasGameStarted) {
    gameFormSubmitButton.hidden = true;
    gameFormResetButton.hidden = false;
    return;
  }

  gameFormSubmitButton.hidden = false;
  gameFormResetButton.hidden = true;
}

function getNumberOfPlayers() {
  return Number(document.getElementById('number-of-players-select').value);
}

function getScoreToWin() {
  return Number(document.getElementById('score-to-win-input').value);
}

// Step 8
function calculateCarAdvantage() {
  const randomNumberBetween1And10 = Math.floor(Math.random() * 10) + 1;

  return randomNumberBetween1And10;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

gameForm.addEventListener('submit', gameStartHandler);

gameForm.addEventListener('reset', gameResetHandler);
