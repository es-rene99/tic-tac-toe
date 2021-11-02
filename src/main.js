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
  function randomBoolean() {
    return Math.random() < 0.5;
  }
  return {
    EvaluateConditionElseThrowErrorMsg,
    isEmpty,
    randomBoolean,
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

  function changeMarkType(newMarkType) {
    if (GameBase.isMarkTypeValid(newMarkType)) {
      _markType = newMarkType;
    }
  }

  function getMarkType() {
    return _markType;
  }

  function _setDefaultNameBasedOnMarkType() {
    return `Player ${_markType}`;
  }

  let _name = _setDefaultNameBasedOnMarkType();

  function _isPlayerNameEmpty(name) {
    Common.EvaluateConditionElseThrowErrorMsg((!Common.isEmpty(name), 'Name cannot be empty!'));
  }

  function changeName(name) {
    if (!_isPlayerNameEmpty(name)) {
      _name = name;
    }
  }

  function getName() {
    return _name;
  }

  return {
    getName, getMarkType, changeName, changeMarkType, _isPlayerNameEmpty,
  };
};

const GameLogic = (() => {
  let userMarkType;
  let computerMarkType;

  function pickUserMarkType(markType) {
    if (GameBase.isMarkTypeValid(markType)) {
      userMarkType = markType;
    }
  }
  function pickComputerMarkType() {
    if (userMarkType === 'O') {
      computerMarkType = 'X';
    } else {
      computerMarkType = 'O';
    }
  }

  function startGame() {
    Board.initBoard();
  }
})();

const Tests = (() => {
  function TestLog(msg) {
    console.log(`\n ${msg} \n`);
  }
  function LogAndDisplayObjectState(msg, objStateMethod) {
    TestLog(msg);
    console.log(objStateMethod);
  }
  const BoardTests = (() => {
    function LogAndDisplayBoardName(msg) {
      LogAndDisplayObjectState(msg, Board.getBoard());
    }
    // TODO need to refactor executeTests
    function executeTests() {
      Board.initBoard();
      LogAndDisplayBoardName('Blank board');
      Board.setBoardMark('X', 1);
      LogAndDisplayBoardName('2nd position in board as X');
      Board.setBoardMark('O', 0);
      LogAndDisplayBoardName('1st position in board as O');
      Board.setBoardMark('O', 10);
      LogAndDisplayBoardName('Return error invalid position');
      Board.setBoardMark('Y', '2');
      LogAndDisplayBoardName('Return error invalid mark');
    }
    return {
      executeTests,
    };
  })();

  const PlayerTests = (() => {
    function LogAndDisplayPlayerState(msg, playerObj) {
      LogAndDisplayObjectState(msg, `Name: ${playerObj.getName()}, Mark: ${playerObj.getMarkType()} `);
    }
    function executeTests() {
      const playerTest = Player('O');
      LogAndDisplayPlayerState('Created Player', playerTest);
      playerTest.changeName('Mark');
      LogAndDisplayPlayerState('Changed name', playerTest);
      playerTest.changeMarkType('O');
      LogAndDisplayPlayerState('Changed mark', playerTest);
      playerTest.changeMarkType('3');
      LogAndDisplayPlayerState('Wrong mark', playerTest);
      playerTest.changeName('');
      LogAndDisplayPlayerState('Empty name!', playerTest);
    }
    return {
      executeTests,
    };
  })();

  return {
    BoardTests, PlayerTests,
  };
})();

Tests.PlayerTests.executeTests();
