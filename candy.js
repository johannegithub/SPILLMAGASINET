const candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
const rows = 9;
const columns = 9;
let score = 0;
let currTile;
let otherTile;
let board = [];

window.onload = function () {
    startGame();

    //1/10th of a second
    setTimeout(function () {
        window.setInterval(function () {
            crushCandy();
            slideCandy();
            generateCandy();
        }, 100);
    }, 1000); // Legger til en forsinkelse på 1 sekund

    loadHighScore();
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]; //0 - 5.99
}
function startGame() {
    score = 0; // Reset score to 0
    document.getElementById("score").innerText = score; // Update the score display
    board = []; // Clear the board array
    document.getElementById("board").innerHTML = ""; // Clear the board display

    // Generating the game board
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < columns; c++) {
            const tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";

            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart); //click on a candy, initialize drag process
            tile.addEventListener("dragover", dragOver);  //clicking on candy, moving mouse to drag the candy
            tile.addEventListener("dragenter", dragEnter); //dragging candy onto another candy
            tile.addEventListener("dragleave", dragLeave); //leave candy over another candy
            tile.addEventListener("drop", dragDrop); //dropping a candy over another candy
            tile.addEventListener("dragend", dragEnd); //after drag process completed, we swap candies

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    removeInitialMatches();

    console.log(board);
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