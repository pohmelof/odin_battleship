import { showMessage, showGameOverMessage } from "./DOMstuff.js";

const addGameLogic = function addGameLogic(player, computer, size) {
    const startBtn = document.querySelector('.btn-startgame');

    let gameOver = false;
    let playerTurn = true;
    let gameStarted = false;

    let computerMoves = {
        preferredMoves: [],
        firstHit: undefined,
        secondHit: undefined,
        isVertical: null,
        maxShipLength: Math.max(...computer.getUserShips().map(ship => ship.getLength()))
    }

    function toggleVisibility(element) {
        element.classList.toggle('hidden');
    }

    function startGame() {
        if (gameStarted) return;
        const optionContainer = document.querySelector('.option-container');
        if (optionContainer.children.length != 0) {
            const message = `<h1>Please place all ships first</h1>`;
            showMessage(message);
        } else {
            const computerDiv = document.getElementById('computer');
            gameStarted = true;
            toggleVisibility(optionContainer);
            toggleVisibility(computerDiv);
            const allBlocks = document.querySelectorAll('#computer div');
            allBlocks.forEach(block => block.addEventListener('click', handleClick2))
        }
    }

    const handleClick2 = function handleClick2(e) {
        if (gameOver) return;
        if (!playerTurn) return;
        if (e.target.classList.contains('hit') || e.target.classList.contains('miss')) return;
        const target = e.target;
        makeMove(computer, target, player);
        
        playerTurn = false;
        setTimeout(computerTurn, 3);
    }


    function computerTurn() {
        if (!gameOver) {
            const moves = computerMoves.preferredMoves;
            let index = Math.floor(Math.random() * size**2);
            if (moves.length > 0) {
                index = moves[Math.floor(Math.random() * moves.length)];
                moves.splice(moves.indexOf(index), 1);
            }
            const block = document.getElementById('player').children[index];
            if (block.classList.contains('hit') || block.classList.contains('miss')) {
                computerTurn();
            } else {
                const isAlive = makeMove(player, block, computer);
                Array.from(block.parentElement.children).forEach(child => child.classList.remove('trace-move'));
                block.classList.add('trace-move');
                if (block.classList.contains('hit') && isAlive) {
                    const index = Number(block.id);
                    determineBestMove(computerMoves, index);
                };

            }     
        }

        playerTurn = true;
    }


    function makeMove(opponent, block, user) {
        const index = Number(block.id);
        const move = opponent.handleMove(index);
        const board = document.getElementById(opponent.getUserName()).childNodes;
        if (move === false) {
            block.classList.add('miss');
        } else {
            if (!move.isAlive) {
                const shipIndexes = opponent.findShip(move.shipName);
                const reservedBlocks = opponent.getReservedBlocks(move.shipName);
                shipIndexes.forEach(index => board[index].classList.add(move.shipName));
                reservedBlocks.forEach(index => board[index].classList.add('miss'));
                if (opponent.getUserName() === 'player') {
                    resetComputerMoves();
                }
                block.classList.add('hit');
                if (opponent.isGameOver()) {
                    user.win();
                    gameOver = true;
                    const message = `<h1>${opponent.getUserName() === 'computer' ? 'Player' : 'Computer'} has won!</h1>
                                     <h1>Player wins: ${opponent.getUserName() === 'computer' ? user.getWinNum() : opponent.getWinNum()}</h1>
                                     <h1>Computer wins: ${opponent.getUserName() === 'player' ? user.getWinNum() : opponent.getWinNum()}</h1>`
                    showGameOverMessage(message);
                }
            } else {
                block.classList.add('hit');
            }
        }
        return move.isAlive;
    }



    function resetComputerMoves() {
            computerMoves.preferredMoves = [];
            computerMoves.firstHit = undefined;
            computerMoves.secondHit = undefined;
            computerMoves.isVertical = null;
            computerMoves.maxShipLength = Math.max(...computer.getUserShips().map(ship => ship.getLength()));
    }


    function determineBestMove(obj, index) {
        if (index % size !== 0) obj.preferredMoves.push(index-1);
        if (index+1 % size !== 0 ) obj.preferredMoves.push(index+1);
        if (index -10 >= 0) obj.preferredMoves.push(index-10);
        if (index+10 < size**2) obj.preferredMoves.push(index+10);

        if (obj.firstHit === undefined) {
            obj.firstHit = index;
        } else if (obj.secondHit === undefined) {
            obj.secondHit = index;
            obj.isVertical = Math.abs(obj.firstHit - obj.secondHit) === size;
        }

        if (obj.firstHit && obj.secondHit) {
            if (obj.isVertical) {
                obj.preferredMoves = obj.preferredMoves.filter(move => move % size === obj.firstHit % size);
            }
            if (!obj.isVertical) {
                obj.preferredMoves = obj.preferredMoves.filter(move => Math.abs(move - obj.firstHit) <= obj.maxShipLength);
            }
        }
        obj.preferredMoves = [...new Set(obj.preferredMoves)];;
    }





    startBtn.addEventListener('click', startGame);

}

export {addGameLogic}