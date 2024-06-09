const candies = ["Blue", "Orange-Striped-Vertical", "Green", "Yellow-Wrapped", "Red-Wrapped", "Purple"];
const rows = 9;
const columns = 9;
let score = 0;
let currTile;
let otherTile;
let board = [];
let gameActive = true;

window.onload = function () {
    loadHighScore();
    startGame();

    //1/10th of a second
    setTimeout(function () {
        window.setInterval(function () {
            crushCandy();
            slideCandy();
            generateCandy();
            saveHighScore(); // Lagrer highscore
        }, 100);
    }, 1000); // Legger til en forsinkelse på 1 sekund
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

// Generer spillbrettet med lazy loading
function startGame() {
    score = 0;
    document.getElementById("score").innerText = score;
    movesLeft = 12;
    document.getElementById("movesLeft").innerText = movesLeft;

    if (!gameActive) {
        gameActive = true;
    }

    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";
    board = [];

    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < columns; c++) {
            const tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";
            tile.loading = "lazy";  // Lazy loading av bilder
            tile.classList.add("tile");

            if (gameActive) {
                tile.addEventListener("dragstart", dragStart);
                tile.addEventListener("dragover", dragOver);
                tile.addEventListener("dragenter", dragEnter);
                tile.addEventListener("dragleave", dragLeave);
                tile.addEventListener("drop", dragDrop);
                tile.addEventListener("dragend", dragEnd);
            }

            boardElement.appendChild(tile);
            row.push(tile);
        }
        board.push(row);
    }

    removeInitialMatches();
}

function removeInitialMatches() {
    let initialMatches = true;
    while (initialMatches) {
        initialMatches = false;

        // Check for rows with three same candies
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns - 2; c++) {
                const candy1 = board[r][c];
                const candy2 = board[r][c + 1];
                const candy3 = board[r][c + 2];
                if (candy1.src == candy2.src && candy2.src == candy3.src) {
                    candy1.src = "./images/" + randomCandy() + ".png";
                    candy2.src = "./images/" + randomCandy() + ".png";
                    candy3.src = "./images/" + randomCandy() + ".png";
                    initialMatches = true;
                }
            }
        }

        // Check for columns with three same candies
        for (let c = 0; c < columns; c++) {
            for (let r = 0; r < rows - 2; r++) {
                const candy1 = board[r][c];
                const candy2 = board[r + 1][c];
                const candy3 = board[r + 2][c];
                if (candy1.src == candy2.src && candy2.src == candy3.src) {
                    candy1.src = "./images/" + randomCandy() + ".png";
                    candy2.src = "./images/" + randomCandy() + ".png";
                    candy3.src = "./images/" + randomCandy() + ".png";
                    initialMatches = true;
                }
            }
        }
    }
}

function dragStart() {
    //this refers to tile that was clicked on for dragging
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {
}

function dragDrop() {
    //this refers to the target tile that was dropped on
    otherTile = this;
}

function dragEnd() {
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    const currCoords = currTile.id.split("-"); // id="0-0" -> ["0", "0"]
    const r = parseInt(currCoords[0]);
    const c = parseInt(currCoords[1]);

    const otherCoords = otherTile.id.split("-");
    const r2 = parseInt(otherCoords[0]);
    const c2 = parseInt(otherCoords[1]);

    const moveLeft = c2 == c - 1 && r == r2;
    const moveRight = c2 == c + 1 && r == r2;

    const moveUp = r2 == r - 1 && c == c2;
    const moveDown = r2 == r + 1 && c == c2;

    const isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        const currImg = currTile.src;
        const otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        const validMove = checkValid();
        if (!validMove) {
            const currImg = currTile.src;
            const otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;
        }
    }
}

function crushCandy() {
    //crushFive();
    //crushFour();
    crushThree();
    document.getElementById("score").innerText = score;
}

function crushThree() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            const candy1 = board[r][c];
            const candy2 = board[r][c + 1];
            const candy3 = board[r][c + 2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            const candy1 = board[r][c];
            const candy2 = board[r + 1][c];
            const candy3 = board[r + 2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }
}

function checkValid() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            const candy1 = board[r][c];
            const candy2 = board[r][c + 1];
            const candy3 = board[r][c + 2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            const candy1 = board[r][c];
            const candy2 = board[r + 1][c];
            const candy3 = board[r + 2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }
    return false;
}

function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }
        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function generateCandy() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('backgroundMusic');
    const playButton = document.getElementById('playButton');
    const pauseButton = document.getElementById('pauseButton');

    playButton.addEventListener('click', () => {
        music.play();
    });

    pauseButton.addEventListener('click', () => {
        music.pause();
    });
});

let highscore = 0; // Legg til denne linjen for å initialisere highscore

function loadHighScore() {
    const savedHighscore = localStorage.getItem("highscore");
    if (savedHighscore !== null) {
        highscore = parseInt(savedHighscore); // Oppdaterer highscore
        document.getElementById("highscoreValue").innerText = highscore;
    }
}

function saveHighScore() {
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
        document.getElementById("highscoreValue").innerText = highscore;
    }
}

window.onload = function () {
    loadHighScore();
    startGame();

    //1/10th of a second
    setTimeout(function () {
        window.setInterval(function () {
            crushCandy();
            slideCandy();
            generateCandy();
            saveHighScore(); // Lagrer highscore
        }, 100);
    }, 1000); // Legger til en forsinkelse på 1 sekund
}

let movesLeft = 12; // Legg til denne linjen for å spore antall trekk

function dragEnd() {
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    const currCoords = currTile.id.split("-"); // id="0-0" -> ["0", "0"]
    const r = parseInt(currCoords[0]);
    const c = parseInt(currCoords[1]);

    const otherCoords = otherTile.id.split("-");
    const r2 = parseInt(otherCoords[0]);
    const c2 = parseInt(otherCoords[1]);

    const moveLeft = c2 == c - 1 && r == r2;
    const moveRight = c2 == c + 1 && r == r2;

    const moveUp = r2 == r - 1 && c == c2;
    const moveDown = r2 == r + 1 && c == c2;

    const isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        const currImg = currTile.src;
        const otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        const validMove = checkValid();
        if (!validMove) {
            const currImg = currTile.src;
            const otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;
        } else {
            moveMade(); // Øker telleren for trekk
        }
    }
}

function moveMade() {
    movesLeft--;
    document.getElementById("movesLeft").innerText = movesLeft; // Oppdaterer antall trekk på skjermen

    if (movesLeft <= 0) {
        endGame(); // Kall endGame() hvis antall trekk er 0 eller mindre
    }
}

function endGame() {
    // Implementer logikken for hva som skal skje når spillet er over
    document.getElementById("gameOverButton").style.display = "block"; // Viser knappen "GAME OVER"
    document.getElementById("restartButton").style.display = "block"; // Viser restartknappen
    movesLeft = 0; // Sett antall trekk til 0 for å unngå negative verdier
    gameActive = false; // Setter spillet som inaktivt

    // Deaktiver dra- og slippfunksjonalitet
    document.querySelectorAll(".tile").forEach(tile => {
        tile.removeEventListener("dragstart", dragStart);
        tile.removeEventListener("dragover", dragOver);
        tile.removeEventListener("dragenter", dragEnter);
        tile.removeEventListener("dragleave", dragLeave);
        tile.removeEventListener("drop", dragDrop);
        tile.removeEventListener("dragend", dragEnd);
    });
}

function restartGame() {
    // Gjemmer knappen "GAME OVER" og restartknappen
    document.getElementById("gameOverButton").style.display = "none";
    document.getElementById("restartButton").style.display = "none";

    // Tilbakestiller antall trekk og score til standardverdier
    movesLeft = 12; 
    document.getElementById("movesLeft").innerText = movesLeft; 
    score = 0;
    document.getElementById("score").innerText = score;

    // Starter ikke spillet på nytt, bare tilbakestiller score og antall trekk
}
