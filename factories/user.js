import { ship } from "./ship.js";
import { gameboard } from "./gameboard.js";

const user = function createUser(name, size) {
    const {placeShip, findShip, getValidity, handleMove, getReservedBlocks, resetGameboard} = gameboard(name, size);

    let winNum = 0;

    const createFleet = function() {
        const destroyer = ship('destroyer', 2);
        const submarine = ship('submarine', 3);
        const cruiser = ship('cruiser', 3);
        const battleship = ship('battleship', 4);
        const carrier = ship('carrier', 5);
        
        return [destroyer, submarine, cruiser, battleship, carrier];
    }
    let userShips = createFleet();
    const resetGame = function resetGame() {
        userShips = createFleet();
        resetGameboard();
    }

    const getUserShips = function getUserShips() {
        return userShips;
    }
    const getUserName = function getUserName() {
        return name;
    }
    const isGameOver = function isGameOver() {
        return userShips.every(ship => !ship.isAlive());
    }
    const getWinNum = function getWinNum() {
        return winNum;
    }
    const win = function win() {
        winNum += 1;
    }

    return {
            getUserName, 
            getUserShips, 
            placeShip, 
            findShip, 
            getValidity, 
            handleMove, 
            getReservedBlocks,
            isGameOver,
            getWinNum,
            win,
            resetGame
        };
}

export {user}