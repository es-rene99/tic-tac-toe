const Board = (() => {
  const _MARK_TYPES = ['O', 'X'];
  const _boardMarks = {};
  const _BOARD_LIMITS = [1, 9];
  function setBoardMark(markType, position) {

  }
  function getGameBoardData() {
    return _boardMarks;
  }
  return {
    setGameBoardData: setBoardMark,
    getGameBoardData,
  };
})();

// * Tests
//  Board Module
console.log(`${Board.setGameBoardData('X', '2')}`);
console.log(`${Board.getGameBoardData()}`); // Return boardMarks with the position of X in the 2nd cell
console.log(`${Board.setGameBoardData('O', '1')}`);
console.log(`${Board.getGameBoardData()}`); // Return boardMarks with the position of O in the 1st cell
console.log(`${Board.setGameBoardData('O', '10')}`); // Return error
console.log(`${Board.setGameBoardData('O', '0')}`); // Return error
