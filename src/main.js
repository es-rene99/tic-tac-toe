const Main = (() => {
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
    function randomArrElement() {
      Math.floor(Math.random() * this.length); // https://www.geeksforgeeks.org/how-to-select-a-random-element-from-array-in-javascript/
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

    function isPositionInLimits(position) {
      const isPositionInLimits = (position < _BOARD_LIMIT_MAX && position > _BOARD_LIMIT_MIN);
      return Common.EvaluateConditionElseThrowErrorMsg(isPositionInLimits, 'Not valid position');
    }

    function isPositionAvailable(position) {
      const isPositionAvailable = (_board[position] === _DEFAULT_MARK_VALUE);
      return Common.EvaluateConditionElseThrowErrorMsg(isPositionAvailable, 'Not valid position');
    }

    function isPositionValid(position) {
      return isPositionAvailable(position) && isPositionInLimits(position);
    }

    function isNewMarkTypeAndPositionValid(newMark, position) {
      return GameBase.isMarkTypeValid(newMark) && isPositionValid(position);
    }

    function getAvailableBoardPositions() {
      const availablePositionIndexes = [..._board.keys()].filter(
        (index) => _board[index] === _DEFAULT_MARK_VALUE,
      );
      return availablePositionIndexes;
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
      getAvailableBoardPositions,
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

    function setBoardMark(position) {
      Board.setBoardMark(_markType, position);
    }

    return {
      getName, getMarkType, changeName, changeMarkType, _isPlayerNameEmpty, setBoardMark,
    };
  };

  const ComputerPlayer = ((markType) => {
    const prototype = Player(markType);
    function setBoardMark() {
      const availableBoardPositions = Board.getAvailableBoardPositions();
      const randomAvailablePosition = availableBoardPositions[Common.randomArrElement()];
      // TODO left here Board.setBoardMark
    }
    return { ...prototype };
  })();

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
        LogAndDisplayObjectState(msg, `Name: ${playerObj.getName()}, Mark: ${playerObj.getMarkType()}`);
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

  const UiHandler = (() => {
    const boardHtml = document.getElementById('board');
    function displayBoard() {
      const squareValues = Board.getBoard();
      const newSquareHtml = document.createElement('div');
      newSquareHtml.className = 'square';
      squareValues.forEach((squareValue) => {
        newSquareHtml.textContent = squareValue;
        boardHtml.appendChild(newSquareHtml);
      });
    }
    return { displayBoard };
  })();

  function init() {
    Board.initBoard();
    UiHandler.displayBoard();
  }

  return {
    Common, GameBase, Board, Player, ComputerPlayer, GameLogic, Tests, init,
  };
})();
