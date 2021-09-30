const Board = (() => {
  const _MARK_TYPES = ['O', 'X'];
  const _boardMarks = {
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
    5: undefined,
    6: undefined,
    7: undefined,
    8: undefined,
    9: undefined,
  };
  const _BOARD_LIMIT_MAX = 9;
  const _BOARD_LIMIT_MIN = 1;
  function isPositionValid(position) {
    return position > _BOARD_LIMIT_MAX || position < _BOARD_LIMIT_MIN;
  }
  function isMarkTypeValid(newMark) {
    _MARK_TYPES.some((markType) => newMark === markType);
  }
  function isNewMarkTypeAndPositionValid(newMark, position) {
    return isMarkTypeValid(newMark) && isPositionValid(position);
  }
  function setBoardMark(position, newMark) {
    if (isNewMarkTypeAndPositionValid) {
      _boardMarks[position] = newMark;
    } else {
      // TODO handle error
    }
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
console.log(`${Board.setGameBoardData('2', 'X')}`);
console.log(`${Board.getGameBoardData()}`); // Return boardMarks with the position of X in the 2nd cell
console.log(`${Board.setGameBoardData('1', 'O')}`);
console.log(`${Board.getGameBoardData()}`); // Return boardMarks with the position of O in the 1st cell
console.log(`${Board.setGameBoardData('10', 'O')}`); // Return error
console.log(`${Board.setGameBoardData('2', 'Y')}`); // Return error
