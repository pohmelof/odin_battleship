import { getValidIndexes} from "../utils.js";

const gameboard = function createGameboard(user, size) {
    
    // array to keep user gameboard in check
    // -1 === free block
    // shipObject  will be placed in each block
    let gameboard = Array(size**2).fill(-1);

    const resetGameboard = function resetGameboard() {
        gameboard = Array(size**2).fill(-1);
    }

    // get array of blocks to place a ship in 
    // and (valid === true) if all blocks are empty
    const getValidity = function getValidity(userName, ship, width, startIndex) {
        let {shipBlocks, valid} = getValidIndexes(userName, ship, width, startIndex)
        if (shipBlocks.length === 0) return {shipBlocks, valid};

        valid = shipBlocks.every(shipBlock => gameboard[shipBlock] === -1);
        return { shipBlocks, valid };
    }

    // get all blocks around the ship
    // place array with ship names into each reserved block in gameboard
    // if block is array, append ship name
    const reserve = function placeReserveBlocks(index, size, ship) {
        let reserveBlocks = [];

        if (index % size !== 0) {
            reserveBlocks.push(index-size-1, index-1, index+size-1);
        }
        if (index % size !== size - 1) {
            reserveBlocks.push(index-size+1, index+1, index+size+1);
        }
        reserveBlocks.push(index+size, index-size);
        reserveBlocks = reserveBlocks.filter(block => block >= 0 && block < size**2)
        for (let block of reserveBlocks) {
            if (gameboard[block] === -1) gameboard[block] = [ship.getName()];
            if (Array.isArray(gameboard[block])
                && !gameboard[block].includes(ship.getName())) 
                {
                    gameboard[block].push(ship.getName())
                } 
        }
    }

    const placeShip = function placeShip(ship, startIndex) {
        const {shipBlocks, valid} = getValidity(user, ship, size, startIndex);
        if (valid) {
            shipBlocks.forEach((block) => {
                gameboard[block] = ship;
            })
            shipBlocks.forEach(block => {
                reserve(block, size, ship)
            })
        } else {
            if (user === 'computer') placeShip(ship);
            if (user === 'player') return true;
        }
    }
    
    const findShip = function findShip(shipName) {
        const shipIndexes = [];
        for (let i = 0; i < gameboard.length; i++) {
            if (typeof gameboard[i] === 'object'
                && !Array.isArray(gameboard[i])
                && gameboard[i].getName() === shipName) {
                shipIndexes.push(i);
            }
        }
        
        return shipIndexes;
    }

    const getReservedBlocks = function getReservedBlocks(shipName) {
        const indexes = [];
        for (let i = 0; i < gameboard.length; i++) {
            if (Array.isArray(gameboard[i])) {
                if (gameboard[i].includes(shipName)) indexes.push(i);
            }
        }
        return indexes;
    }

    const handleMove = function handleMove(index) {
        if(gameboard[index] === -1 || Array.isArray(gameboard[index])) return false;
        gameboard[index].takeDamage();
        return {
            isAlive: gameboard[index].isAlive(),
            shipName: gameboard[index].getName()
        }
    }

    return {
            placeShip, 
            findShip, 
            getValidity, 
            handleMove, 
            getReservedBlocks, 
            resetGameboard
        }
}

export {gameboard}