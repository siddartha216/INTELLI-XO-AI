let board = ["","","","","","","","",""];
let human = "X";
let ai = "O";
let gameActive = false;
let difficulty = "easy";
let playerName = "Player";

let playerScore = 0;
let computerScore = 0;

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const boardDiv = document.getElementById("board");
const statusText = document.getElementById("status");
const welcomeText = document.getElementById("welcome");

function startGame(level) {
    let nameInput = document.getElementById("playerName").value.trim();
    playerName = nameInput === "" ? "Player" : nameInput;

    difficulty = level;

    menu.classList.remove("active");
    game.classList.add("active");

    welcomeText.innerText = `👋 ${playerName}`;
    updateScore();

    restartGame();
}

function updateScore() {
    document.getElementById("playerScore").innerText = playerScore;
    document.getElementById("computerScore").innerText = computerScore;
}

function goBack() {
    game.classList.remove("active");
    menu.classList.add("active");
}

function createBoard() {
    boardDiv.innerHTML = "";
    board.forEach((cell, i) => {
        let btn = document.createElement("button");
        btn.classList.add("cell");
        btn.innerText = cell;
        btn.onclick = () => playerMove(i);
        boardDiv.appendChild(btn);
    });
}

function playerMove(i) {
    if (!gameActive || board[i] !== "") return;

    board[i] = human;
    createBoard();

    if (checkWinner(board, human)) {
        highlightWin(human);
        playerScore++;
        updateScore();
        statusText.innerText = `${playerName} wins 🎉`;
        gameActive = false;
        return;
    }

    if (isDraw()) {
        statusText.innerText = "Draw 🤝";
        gameActive = false;
        return;
    }

    statusText.innerText = "Computer thinking...";
    setTimeout(aiMove, 400);
}

function aiMove() {
    if (!gameActive) return;

    let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
    let move;

    if (difficulty === "easy") {
        move = empty[Math.floor(Math.random() * empty.length)];
    } else if (difficulty === "medium") {
        move = Math.random() < 0.5
            ? empty[Math.floor(Math.random()*empty.length)]
            : bestMove();
    } else {
        move = bestMove();
    }

    board[move] = ai;
    createBoard();

    if (checkWinner(board, ai)) {
        highlightWin(ai);
        computerScore++;
        updateScore();
        statusText.innerText = "Computer wins 🤖";
        gameActive = false;
        return;
    }

    if (isDraw()) {
        statusText.innerText = "Draw 🤝";
        gameActive = false;
        return;
    }

    statusText.innerText = "Your turn";
}

function bestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i=0;i<9;i++) {
        if (board[i] === "") {
            board[i] = ai;
            let score = minimax(board,0,false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(b, depth, isMax) {
    if (checkWinner(b, ai)) return 1;
    if (checkWinner(b, human)) return -1;
    if (b.every(c=>c!=="")) return 0;

    if (isMax) {
        let best = -Infinity;
        for (let i=0;i<9;i++) {
            if (b[i] === "") {
                b[i] = ai;
                best = Math.max(best, minimax(b, depth+1, false));
                b[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i=0;i<9;i++) {
            if (b[i] === "") {
                b[i] = human;
                best = Math.min(best, minimax(b, depth+1, true));
                b[i] = "";
            }
        }
        return best;
    }
}

function checkWinner(b, p) {
    const win = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return win.some(c => c.every(i => b[i] === p));
}

function highlightWin(player) {
    let cells = document.querySelectorAll(".cell");
    const win = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    win.forEach(c => {
        if (c.every(i => board[i] === player)) {
            c.forEach(i => cells[i].classList.add("win"));
        }
    });
}

function isDraw() {
    return board.every(c => c !== "");
}

function restartGame() {
    board = ["","","","","","","","",""];
    gameActive = true;
    statusText.innerText = "Your turn";
    createBoard();
}