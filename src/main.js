/* eslint-disable no-use-before-define */
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
        console.error(err);
        GameLogic.setErrorMsg(err.message);
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
    const _DEFAULT_MARK_VALUE = '';

    function initBoard() {
      for (let index = _BOARD_LIMIT_MIN; index <= _BOARD_LIMIT_MAX; index++) {
        _board[index] = _DEFAULT_MARK_VALUE;
      }
    }

    function isPositionInLimits(position) {
      const isPositionInLimits = (position <= _BOARD_LIMIT_MAX && position >= _BOARD_LIMIT_MIN);
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
      getName, getMarkType, changeName, changeMarkType, _isPlayerNameEmpty, setBoardMark, _markType,
    };
  };

  const ComputerPlayer = ((markType) => {
    const prototype = Player(markType);
    function setBoardMark() {
      const availableBoardPositions = Board.getAvailableBoardPositions();
      const randomAvailablePosition = availableBoardPositions[Common.randomArrElement()];
      // TODO Board.setBoardMark
    }
    return { ...prototype };
  })();

  const GameLogic = (() => {
    let errorMsg;
    let _userMarkType;
    let _computerMarkType;
    // TODO need to do it random or by pick at the beginning
    const _player1 = Player('X');
    const _player2 = Player('O');
    const currentPlayer = Player();

    function pickUserMarkType(markType) {
      if (GameBase.isMarkTypeValid(markType)) {
        _userMarkType = markType;
      }
    }
    function pickComputerMarkType() {
      if (_userMarkType === 'O') {
        _computerMarkType = 'X';
      } else {
        _computerMarkType = 'O';
      }
    }
    function setErrorMsg(msg) {
      errorMsg = msg;
    }
    function clearErrorMsg() {
      errorMsg = '';
    }

    function getErrorMsg() {
      return errorMsg;
    }

    function setDefaultPlayer() {
      Object.assign(currentPlayer, _player1);
    }

    function switchPlayer() {
      const isMarkTypeFromCurrentPlayerEqualToPlayer1 = currentPlayer.getMarkType()
        === _player1.getMarkType();
      if (isMarkTypeFromCurrentPlayerEqualToPlayer1) {
        Object.assign(currentPlayer, _player2);
      } else {
        Object.assign(currentPlayer, _player1);
      }
    }

    function determineIfVictory(currentPlayerMark) {
      const boardMarks = Board.getBoard();

      // TODO Need to do logic for multiple winning conditions
      const victoryConditions = {
        isVictoryByRowMatch() {
          const winningIndexesList = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
          return winningIndexesList.some(
            (winningIndexes) => winningIndexes.every(
              (winningIndex) => currentPlayerMark === boardMarks[winningIndex],
            ),
          );
        },
        isVictoryByColumnMatch() {

        },
        isVictoryByDiagonalMatch() {

        },
      };

      if (victoryConditions.isVictoryByColumnMatch()
        || victoryConditions.isVictoryByDiagonalMatch()
        || victoryConditions.isVictoryByRowMatch()) {
        return true;
      }
      return false;
    }

    return {
      switchPlayer, currentPlayer, setDefaultPlayer, setErrorMsg, getErrorMsg, clearErrorMsg,
    };
  })();

  const UiHandler = (() => {
    const boardHtml = document.getElementById('board');
    const SQUARE_INDEX_ATTR = 'data-square-index';

    function createBoard() {
      const squareValues = Board.getBoard();
      squareValues.forEach((squareValue, index) => {
        const newSquareHtml = document.createElement('div');
        newSquareHtml.className = 'square';
        newSquareHtml.setAttribute(SQUARE_INDEX_ATTR, index);
        newSquareHtml.textContent = squareValue;
        newSquareHtml.addEventListener('click', addMark);
        boardHtml.appendChild(newSquareHtml);
      });
    }
    function refreshBoard() {
      boardHtml.innerHTML = '';
      GameLogic.clearErrorMsg();
      createBoard();
    }

    function addMark() {
      const markIndex = this.getAttribute(SQUARE_INDEX_ATTR);
      GameLogic.currentPlayer.setBoardMark(markIndex);
      const isRoundWithNoErrors = GameLogic.getErrorMsg();
      if (!isRoundWithNoErrors) {
        GameLogic.switchPlayer();
      }
      refreshBoard();
    }

    return { createBoard };
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

  function init() {
    GameLogic.setDefaultPlayer();
    Board.initBoard();
    UiHandler.createBoard();
    // * Console log tests
    // Main.Tests.BoardTests.executeTests();
  }

  return {
    Tests, init,
  };
})();

Main.init();
