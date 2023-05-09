function getValidStartIndex(size, length, isVertical, index) {
    let randomIndex = Math.floor(Math.random() * size ** 2);
    if (index) randomIndex = Number(index);
    let validIndex;

    if (!isVertical) {
        validIndex = randomIndex <= size**2 - length ? randomIndex : size**2 - length;
        if (validIndex % size + length <= size) {
            return validIndex;
        } else {
            return getValidStartIndex(size, length, isVertical);
        }
    } else {
        validIndex =  randomIndex <= size**2 - size * (length-1) ? randomIndex : randomIndex - size * length + size;
        if (validIndex + (length-1) * size < size**2) {
            return validIndex;
        } else {
            return getValidStartIndex(size, length, isVertical);
        }
    }
}

const getValidIndexes = function getValidIndexes(userName, ship, size, startIndex) {
    let valid = true;
    let shipBlocks = [];
    let isVertical = userName === 'player' ? ship.isVertical() : Math.random() < 0.5;
    let validIndex = getValidStartIndex(size, ship.getLength(), isVertical, startIndex);
    if (userName === 'player' && Number(startIndex) !== validIndex) {
        valid = false;
        return {shipBlocks, valid}
    };

    for (let i = 0; i< ship.getLength(); i++) {
        if (!isVertical) {
            shipBlocks.push(validIndex + i);
        } else {
            shipBlocks.push(validIndex + i * size);
        }
    }

    return { shipBlocks, valid };
}


export {getValidIndexes}