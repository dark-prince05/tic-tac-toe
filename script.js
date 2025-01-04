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

  let activePlayer = players[0].symbol === "X" ? players[0] : players[1];
  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const playRound = (row, column) => {
    board.placeSymbol(row, column, activePlayer);
    board.printBoard();
    if (board.checkWinner(activePlayer)) {
      console.log(activePlayer.name);
    }
    switchPlayer();
  };
  return {
    playRound,
    switchPlayer,
  };
}

function userInterface() {}
