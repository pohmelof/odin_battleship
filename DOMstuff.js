const renderBoard = function renderUserBoard(userName, size) {
    const userBoard = document.createElement('div');
    userBoard.classList.add('game-board');
    if (userName === 'computer') userBoard.classList.add('hidden');
    userBoard.id = userName;
    const blocks = []
    for (let i = 0; i < size ** 2; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.style.width = `${100/size}%`;
        block.style.height = `${100/size}%`;
        block.id = i;
        blocks.push(block);
    }
    userBoard.append(...blocks)
    return userBoard;
}

const renderPlacedShip = function renderPlacedShip(shipIndexes, shipName, board) {
    shipIndexes.forEach(index => {
        board[index].classList.add(shipName);
    })
}

const addDragAndDrop = function addDragAndDrop(user, size) {
    const allPlayerBlocks = document.querySelectorAll('#player div');
    const optionShips = Array.from(document.querySelectorAll('.ship'));
    let notDropped;
    let draggedShip;
    
    optionShips.forEach(ship => {
        ship.ondragstart = () => {
            return false;
        }
        ship.addEventListener('mousedown', (e) => {
            dragAndDrop(e);
        })
        ship.addEventListener('touchstart', (e) => {
            e.preventDefault();
            dragAndDrop(e);
        })
    
        function getCoords(elem) {
            var box = elem.getBoundingClientRect();
            return {
              top: box.top + scrollY,
              left: box.left + scrollX
            };
          }
    
        function getPointerCoords(e, type) {
            let x;
            let y;
            if (type === 'mousedown') {
                x = e.pageX;
                y = e.pageY;
            }
            if (type === 'touchstart') {
                x = e.targetTouches[0].pageX;
                y = e.targetTouches[0].pageY;
            }
    
            return {x, y};
        }
    
        function dragAndDrop(e) {
            const type = e.type;
            if (e.button === 2) return;
            draggedShip = e.target;
            let targetId;
            const {x, y} = getPointerCoords(e, type);
            const coords = getCoords(ship);
            const shiftX = x - coords.left;
            const shiftY = y - coords.top;
            ship.style.position = "absolute";
            move(e);
    
            function move(e) {
                const {x, y} = getPointerCoords(e, type);
                ship.style.left = x - shiftX + 'px';
                ship.style.top = y  - shiftY + 'px';
            }
            document.onmousemove = (e) => {
                drag(e);
            }
            ship.onmouseup = (e) => {
                drop(e);
            }
    
            document.ontouchmove = (e) => {
                drag(e)
            }
            ship.ontouchend = (e) => {
                drop(e)
            }
    
    
            function drag(e) {
                ship.style.pointerEvents = 'none';
                const {x, y} = getPointerCoords(e, type);
                const target = document.elementFromPoint(x, y);
                ship.style.pointerEvents = 'auto';
                if (target !== null && target.parentNode.id === 'player') {
                    targetId = target.id;
                    showTargetBlock(target.id);
                }
                move(e);
            }
    
            function drop(e) {
                document.onmousemove = null;
                ship.onmouseup = null;
                document.ontouchmove = null;
                ship.ontouchend = null;
                dropShip(targetId);
                removeHighlight();
            }
        }
        
    })
    
    function showTargetBlock(id) {
        removeHighlight();
        let currentShip = user.getUserShips()[draggedShip.id];
        const index = id;
        const {shipBlocks, valid } = user.getValidity('player', currentShip, size, index);
        if (valid) {
            shipBlocks.forEach(block => allPlayerBlocks[block].classList.add('dragover'));
        }
    }
    function removeHighlight() {
        const blocks = Array.from(document.querySelectorAll(`#player div`));
        blocks.forEach(block => block.classList.remove('dragover'));
    }
    function dropShip(id) {
        const ship = user.getUserShips()[draggedShip.id];
        const shipName = ship.getName();
        const dropped = user.placeShip(ship, id);
        notDropped = dropped ? dropped : false;
        if (!notDropped) {
            renderPlacedShip(user.findShip(shipName), shipName, allPlayerBlocks);
            draggedShip.remove();
        }
    }
}

const renderDraggableShips = function renderDraggableShips(ships) {
    const optionContainer = document.createElement('div');
    optionContainer.classList.add('option-container');

    for (let i = 0; i < ships.length; i++) {
        const shipName = ships[i].getName();

        const shipDiv = document.createElement('div');
        shipDiv.id = i;
        shipDiv.classList.add('ship', shipName, `${shipName}-preview`);
        shipDiv.draggable = true;


        optionContainer.appendChild(shipDiv);
    }

    return optionContainer;
}

function showMessage(msg) {
    const overlay = document.querySelector('.overlay');
    const message = document.querySelector('.message');
    message.innerHTML = msg;
    overlay.classList.remove('hidden');
}

function showGameOverMessage(msg) {
    showMessage(msg);
    document.querySelector('.btn-close').classList.add('hidden');
    document.querySelector('.btn-reset').classList.remove('hidden');

}

export {
        renderBoard, 
        renderPlacedShip, 
        addDragAndDrop, 
        renderDraggableShips, 
        showMessage,
        showGameOverMessage
    }