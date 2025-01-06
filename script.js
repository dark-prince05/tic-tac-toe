const gameBoard = function () {
  const row = 3;
  const column = 3;
  let board = [];

  for (let i = 0; i < row; i++) {
    board[i] = [];
    for (let j = 0; j < column; j++) {
      board[i].push(cell());
    }
  }

  const getBoard = () => board;

  const printBoard = () => {
    const s = board.map((row) => row.map((column) => column.getSymbol()));
    console.log(s);
  };

  const placeSymbol = (row, column, player) => {
    if (board[row][column].getSymbol() === " ") {
      board[row][column].putSymbol(player.symbol);
      return true;
    } else {
      return false;
    }
  };

  const checkWinner = (player) => {
    for (let i = 0; i < board.length; i++) {
      if (
        board[i][0].getSymbol() === player.symbol &&
        board[i][1].getSymbol() === player.symbol &&
        board[i][2].getSymbol() === player.symbol
      ) {
        return true;
      }
      if (
        board[0][i].getSymbol() === player.symbol &&
        board[1][i].getSymbol() === player.symbol &&
        board[2][i].getSymbol() === player.symbol
      ) {
        return true;
      }
      if (
        (board[0][0].getSymbol() === player.symbol &&
          board[1][1].getSymbol() === player.symbol &&
          board[2][2].getSymbol() === player.symbol) ||
        (board[0][2].getSymbol() === player.symbol &&
          board[1][1].getSymbol() === player.symbol &&
          board[2][0].getSymbol() === player.symbol)
      ) {
        return true;
      }
    }
  };
  return {
    getBoard,
    checkWinner,
    placeSymbol,
    printBoard,
  };
};

function cell() {
  let symbol = " ";

  const putSymbol = (playerSymbol) => {
    symbol = playerSymbol;
  };

  const getSymbol = () => symbol;

  return {
    putSymbol,
    getSymbol,
  };
}

function gameController(
  playerOneName = "Player One",
  playerOneSymbol = "X",
  playerTwoName = "Player Two",
  playerTwoSymbol = "O",
) {
  const board = gameBoard();
  const players = [
    { name: playerOneName, symbol: playerOneSymbol },
    { name: playerTwoName, symbol: playerTwoSymbol },
  ];
  let win = false;
  let activePlayer = players[0].symbol === "X" ? players[0] : players[1];
  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  let winner = "";
  const playRound = (row, column) => {
    if (!win) {
      if (board.placeSymbol(row, column, activePlayer)) {
        board.printBoard();
        if (board.checkWinner(activePlayer)) {
          console.log(activePlayer.name);
          winner = activePlayer.name;
          win = true;
        }
        switchPlayer();
      }
    }
  };
  return {
    playRound,
    switchPlayer,
    getActivePlayer: () => activePlayer,
    getBoard: board.getBoard,
    getWinner: () => winner,
    getWin: () => win,
  };
}

const getInfo = (function () {
  const p1Input = document.querySelector("#p1");
  const p2Input = document.querySelector("#p2");
  const p1Symbol = document.querySelector(".p1-symbol");
  const p2Symbol = document.querySelector(".p2-symbol");

  return {
    p1Name: () => p1Input.value,
    p2Name: () => p2Input.value,
    p1Symbol: () => p1Symbol.textContent,
    p2Symbol: () => p2Symbol.textContent,
  };
})();

function userInterface() {
  const game = gameController(
    getInfo.p1Name(),
    getInfo.p1Symbol(),
    getInfo.p2Name(),
    getInfo.p2Symbol(),
  );

  const ticTacToe = document.querySelector(".tic-tac-toe");
  const updateBoard = () => {
    ticTacToe.textContent = "";
    const board = game.getBoard();
    board.forEach((row, rI) => {
      row.forEach((col, cI) => {
        const box = document.createElement("button");
        box.classList.add(`row${rI}`, `col${cI}`);
        box.textContent = col.getSymbol();
        ticTacToe.append(box);
      });
    });
  };

  const winnerAnnouncement = () => {
    const dialog = document.querySelector("dialog");
    const announcement = document.querySelector(".announcement");
    if (game.getWin()) {
      announcement.textContent = `The Winner is ${game.getWinner()}`;
      dialog.showModal();
    }
  };

  const updatePlayerTurn = () => {
    const p1Score = document.querySelector(".p1Score");
    const p2Score = document.querySelector(".p2Score");
    p1Score.textContent =
      getInfo.p1Symbol() === "X" ? getInfo.p1Name() : getInfo.p2Name();
    p2Score.textContent =
      getInfo.p2Symbol() === "O" ? getInfo.p2Name() : getInfo.p1Name();
    if (game.getActivePlayer().name == getInfo.p1Name()) {
      p2Score.style.background = "";
      p2Score.style.color = "";
      p1Score.style.background = "#00246b";
      p1Score.style.color = "#ffffff";
    } else {
      p1Score.style.background = "";
      p1Score.style.color = "";
      p2Score.style.background = "#00246b";
      p2Score.style.color = "#ffffff";
    }
  };

  const playMatch = () => {
    const body = document.querySelector("body");
    const boardStructure = document.querySelector(".board-structure");
    const playerInfo = document.querySelector(".player-info");
    const playBtn = document.querySelector(".play-btn");
    body.removeChild(boardStructure);
    playBtn.addEventListener("click", () => {
      body.removeChild(playerInfo);
      body.append(boardStructure);
      updateBoard();
      updatePlayerTurn();
    });

    ticTacToe.addEventListener("click", (e) => {
      const row = e.target.classList[0];
      const col = e.target.classList[1];
      game.playRound(row.slice(-1), col.slice(-1));
      updateBoard();
      updatePlayerTurn();
      winnerAnnouncement();
    });
  };
  return {
    playMatch,
    updateBoard,
  };
}
const ui = userInterface();
ui.playMatch();

const changeSymbol = document.querySelectorAll(".sChange");
changeSymbol.forEach((btn) => {
  btn.addEventListener("click", () => {
    changeSymbol[0].textContent =
      changeSymbol[0].textContent === "X" ? "O" : "X";
    changeSymbol[1].textContent =
      changeSymbol[1].textContent === "O" ? "X" : "O";
  });
});
