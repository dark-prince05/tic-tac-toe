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
    }

    return (
      (board[0][0].getSymbol() === player.symbol &&
        board[1][1].getSymbol() === player.symbol &&
        board[2][2].getSymbol() === player.symbol) ||
      (board[0][2].getSymbol() === player.symbol &&
        board[1][1].getSymbol() === player.symbol &&
        board[2][0].getSymbol() === player.symbol)
    );
  };

  const checkDraw = () => {
    let arr = [];
    board.forEach((row) => row.forEach((col) => arr.push(col.getSymbol())));
    for (const v of arr) {
      if (v === " ") return false;
    }
    return true;
  };

  const clearBoard = () => {
    board.forEach((row) => {
      row.forEach((col) => {
        col.putSymbol(" ");
      });
    });
  };

  return {
    getBoard,
    checkWinner,
    checkDraw,
    placeSymbol,
    clearBoard,
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

function gameController() {
  const board = gameBoard();
  const players = [
    { name: "Player One", symbol: "X", score: 0 },
    { name: "Player Two", symbol: "O", score: 0 },
  ];

  const updatePlayers = (
    newPlayerOneName,
    newPlayerOneSymbol,
    newPlayerTwoName,
    newPlayerTwoSymbol,
  ) => {
    players[0].name = newPlayerOneName;
    players[0].symbol = newPlayerOneSymbol;
    players[1].name = newPlayerTwoName;
    players[1].symbol = newPlayerTwoSymbol;
    activePlayer = players[0].symbol === "X" ? players[0] : players[1];
  };

  let activePlayer = players[0].symbol === "X" ? players[0] : players[1];

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  let win = false;
  let winner = "";

  const playRound = (row, column) => {
    if (!win && board.placeSymbol(row, column, activePlayer)) {
      if (board.checkWinner(activePlayer)) {
        winner = activePlayer.name;
        win = true;
        activePlayer.score++;
      } else if (board.checkDraw()) {
        winner = "Draw";
      } else {
        switchPlayer();
      }
    }
  };

  const reset = () => {
    winner = "";
    activePlayer = players[0].symbol === "X" ? players[0] : players[1];
    win = false;
  };

  const resetScore = () => {
    players[0].score = 0;
    players[1].score = 0;
  };

  return {
    playRound,
    switchPlayer,
    updatePlayers,
    getActivePlayer: () => activePlayer,
    players: () => players,
    getBoard: board.getBoard,
    getWinner: () => winner,
    reset,
    resetScore,
    clearBoard: () => board.clearBoard(),
  };
}

const getInfo = (function () {
  const p1Input = document.querySelector("#p1");
  const p2Input = document.querySelector("#p2");
  const p1Symbol = document.querySelector(".p1-symbol");
  const p2Symbol = document.querySelector(".p2-symbol");

  return {
    p1Name: () => (p1Input.value === "" ? "Player One" : p1Input.value),
    p2Name: () => (p2Input.value === "" ? "Player Two" : p2Input.value),
    p1Symbol: () => p1Symbol.textContent,
    p2Symbol: () => p2Symbol.textContent,
  };
})();

function userInterface() {
  let game = gameController();
  const ticTacToe = document.querySelector(".tic-tac-toe");
  const boardBoxes = document.querySelectorAll(".boxes");
  const board = game.getBoard();
  boardBoxes.forEach((box, index) => {
    // Calculate row and col based on the flat index
    const row = Math.floor(index / board.length); // Determine the row index
    const col = index % board.length; // Determine the column index

    box.addEventListener("mouseover", () => {
      if (box.textContent === " " && board[row][col].getSymbol() === " ") {
        box.textContent = game.getActivePlayer().symbol;
      }
    });
    box.addEventListener("mouseout", () => {
      if (board[row][col].getSymbol() === " ") {
        box.textContent = " ";
      }
    });
  });

  const updateBoard = () => {
    board.forEach((row, rI) => {
      row.forEach((col, cI) => {
        document.querySelector(`.row${rI}.col${cI}`).textContent =
          col.getSymbol();
      });
    });
  };

  const form = document.querySelector("form");
  const dialog = document.querySelector("dialog");

  const winnerAnnouncement = () => {
    const announcement = document.querySelector(".announcement");
    if (game.getWinner() !== "") {
      announcement.textContent = `${game.getWinner()} wins!`;
      dialog.showModal();
    }
    if (game.getWinner() === "Draw") {
      announcement.textContent = ` It's a Draw!`;
      dialog.showModal();
    }
  };

  const updatePlayerTurn = () => {
    const p1Score = document.querySelector(".p1Score");
    const p2Score = document.querySelector(".p2Score");
    p1Score.textContent =
      getInfo.p1Symbol() === "X"
        ? `${getInfo.p1Name()}: ${game.players()[0].score}`
        : `${getInfo.p2Name()}: ${game.players()[1].score}`;
    p2Score.textContent =
      getInfo.p2Symbol() === "O"
        ? `${getInfo.p2Name()}: ${game.players()[1].score}`
        : `${getInfo.p1Name()}: ${game.players()[0].score}`;
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

  const body = document.querySelector(".body");
  const boardStructure = document.querySelector(".board-structure");
  const playerInfo = document.querySelector("form");
  const playBtn = document.querySelector(".play-btn");

  const playMatch = () => {
    if (body.contains(boardStructure)) {
      body.removeChild(boardStructure);
    }
    playBtn.addEventListener("click", () => {
      game.updatePlayers(
        getInfo.p1Name(),
        getInfo.p1Symbol(),
        getInfo.p2Name(),
        getInfo.p2Symbol(),
      );
      if (body.contains(playerInfo)) {
        body.removeChild(playerInfo);
      }
      if (!body.contains(boardStructure)) {
        body.appendChild(boardStructure);
      }
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
      newGame();
      playAgain();
    });
  };

  const playAgain = () => {
    const playAgainBtn = document.querySelector(".play-again");
    playAgainBtn.addEventListener("click", () => {
      game.clearBoard();
      dialog.close();
      updateBoard();
      game.reset();
      updatePlayerTurn();
    });
  };

  const newGame = () => {
    const newGameBtn = document.querySelector(".new-game");
    newGameBtn.addEventListener("click", () => {
      dialog.close();
      form.reset();
      if (!body.contains(playerInfo)) {
        body.appendChild(playerInfo);
      }
      if (body.contains(boardStructure)) {
        body.removeChild(boardStructure);
      }
      game.updatePlayers(
        getInfo.p1Name(),
        getInfo.p1Symbol(),
        getInfo.p2Name(),
        getInfo.p2Symbol(),
      );
      userInterface();
      game.clearBoard();
      game.reset();
      game.resetScore();
    });
  };

  return {
    playMatch,
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

window.addEventListener("load", () => {
  form.reset();
});
