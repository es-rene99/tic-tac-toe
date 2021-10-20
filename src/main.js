const Common = (() => {
  function isEmpty(value) {
    if (typeof value !== 'undefined' && value) {
      return true;
    }
    return false;
    // * https://stackoverflow.com/questions/5515310/is-there-a-standard-function-to-check-for-null-undefined-or-blank-variables-in
  }
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
    isEmpty,
  };
})();

const GameBase = (() => {
  const _MARK_TYPES = ['O', 'X'];

  function isMarkTypeValid(newMark) {
    const condition = _MARK_TYPES.some((markType) => newMark === markType);
    return Common.EvaluateConditionElseThrowErrorMsg(condition, 'Not valid mark type');
  }
  return {
    _MARK_TYPES,
    isMarkTypeValid,
  };
})();

const Board = (() => {
  const _board = [];

  const _BOARD_LIMIT_MIN = 0;
  const _BOARD_LIMIT_MAX = 8;
  const _DEFAULT_MARK_VALUE = 'blank';

  function initBoard() {
    for (let index = _BOARD_LIMIT_MIN; index < _BOARD_LIMIT_MAX; index++) {
      _board[index] = _DEFAULT_MARK_VALUE;
    }
  }

  function isPositionValid(position) {
    const condition = (position < _BOARD_LIMIT_MAX && position > _BOARD_LIMIT_MIN);
    return Common.EvaluateConditionElseThrowErrorMsg(condition, 'Not valid position');
  }

  function isNewMarkTypeAndPositionValid(newMark, position) {
    return GameBase.isMarkTypeValid(newMark) && isPositionValid(position);
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

const Player = (markType) => {
  let _markType = markType;

  function changeMarkType(markType) {
    GameBase.isMarkTypeValid(markType);
    _markType = markType;
  }

  function getMarkType() {
    return _markType;
  }

  function setDefaultNameBasedOnMarkType() {
    return `Player ${_markType};`;
  }

  let _name = setDefaultNameBasedOnMarkType();

  function changeName(name) {
    _name = name;
  }

  function getName() {
    return _name;
  }

  function isPlayerNameEmpty(name) {
    Common.EvaluateConditionElseThrowErrorMsg((!Common.isEmpty(name), 'Name cannot be empty!'));
  }

  return {
    changeName, getName,
  };
};

// #region Tests
// * Board Module
// #region
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
// * Player Module
// #region
// #endregion
// #endregion
