const Common = (() => {
  function EvaluateConditionElseThrowErrorMsg(condition, msg) {
    try {
      if (condition) {
        return true;
      }
      throw (new Error(msg));
    } catch (err) {
      console.log(err);
    }
  }
  return {
    EvaluateConditionElseThrowErrorMsg,
  };
})();

const Board = (() => {
  const _board = [];
  const _MARK_TYPES = ['O', 'X'];
  const _BOARD_LIMIT_MIN = 0;
  const _BOARD_LIMIT_MAX = 8;
  const _DEFAULT_MARK_VALUE = 'blank';

  function initBoard() {
    for (let index = _BOARD_LIMIT_MIN; index < _BOARD_LIMIT_MAX; index++) {
      _board[index] = _DEFAULT_MARK_VALUE;
    }
  }

  function isMarkTypeValid(newMark) {
    const condition = _MARK_TYPES.some((markType) => newMark === markType);
    return Common.EvaluateConditionElseThrowErrorMsg(condition, 'Not valid mark type');
  }

  function isPositionValid(position) {
    const condition = (position < _BOARD_LIMIT_MAX && position > _BOARD_LIMIT_MIN);
    return Common.EvaluateConditionElseThrowErrorMsg(condition, 'Not valid position');
  }

  function isNewMarkTypeAndPositionValid(newMark, position) {
    return isMarkTypeValid(newMark) && isPositionValid(position);
  }

  function setBoardMark(newMark, position) {
    if (isNewMarkTypeAndPositionValid(newMark, position)) {
      _board[position] = newMark;
    }
  }

  function getBoard() {
    return _board;
  }
  return {
    initBoard,
    setBoardMark,
    getBoard,
  };
})();

// #region Tests
// * Board Module
function LogAndDisplayBoardState(msg) {
  console.log(`\n ${msg} \n`);
  console.log(Board.getBoard());
}
Board.initBoard();
LogAndDisplayBoardState('Blank board');
Board.setBoardMark('X', 1);
LogAndDisplayBoardState('2nd position in board as X');
Board.setBoardMark('O', 0);
LogAndDisplayBoardState('1st position in board as O');
Board.setBoardMark('O', 10);
LogAndDisplayBoardState('Return error invalid position');
Board.setBoardMark('Y', '2');
LogAndDisplayBoardState('Return error invalid mark');
// #endregion
