import { user } from "./factories/user.js";
import { renderBoard, addDragAndDrop, renderDraggableShips} from "./DOMstuff.js";
import { addGameLogic } from "./gameLogic.js";


const size = 10;
const player = user('player', size);
const computer = user('computer', size);

function game(player, computer) {
    const playerGameboardDiv = document.querySelector('.gameboard-player');
    const computerGameboardDiv = document.querySelector('.gameboard-computer');
    const computerDiv = renderBoard('computer', size);
    playerGameboardDiv.append(renderBoard('player', size));
    computerGameboardDiv.append(computerDiv, renderDraggableShips(player.getUserShips()));

    // place computer ships
    computer.getUserShips().forEach(ship => computer.placeShip(ship))
    // show computer ships for testing
    // computer.getUserShips().forEach(ship => {
    //     const indexes = computer.findShip(ship.getName());
    //     const compBlocks = document.getElementById('computer').childNodes;
    //     for (let index of indexes) {
    //         compBlocks[index].classList.add(ship.getName())
    //     }
    // })

    // drag player ships
    addDragAndDrop(player, size);

    // game logic
    addGameLogic(player, computer, size);
}

game(player, computer);

const rotateBtn = document.querySelector('.btn-rotate');
const closeBtn = document.querySelector('.btn-close');
const resetBtn = document.querySelector('.btn-reset');

// ship rotation
rotateBtn.addEventListener('click', () => {
    const ships = Array.from(document.querySelectorAll('.ship'));
    ships.forEach(ship => {
        const height = ship.offsetHeight;
        const width = ship.offsetWidth;
        const blockSize = height > width ? width : height;
        const targetShip = player.getUserShips()[ship.id];
        ship.style.width = !targetShip.isVertical() ? `${blockSize}px` : `${targetShip.getLength() * blockSize}px`;
        ship.style.height = targetShip.isVertical() ? `${blockSize}px` : `${targetShip.getLength() * blockSize}px`;
        targetShip.rotate();
    })
})

closeBtn.addEventListener('click', (e) => {
    e.target.parentNode.classList.add('hidden');
})

resetBtn.addEventListener('click', () => {
    document.querySelector('.gameboard-player').innerHTML = '';
    document.querySelector('.gameboard-computer').innerHTML = '';
    document.querySelector('.overlay').classList.add('hidden');
    closeBtn.classList.remove('hidden');
    resetBtn.classList.add('hidden');
    player.resetGame();
    computer.resetGame();
    game(player, computer);
})

