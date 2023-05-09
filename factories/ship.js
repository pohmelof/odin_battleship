const ship = function createShip(name, length) {
    const ship_params = {
        name: name,
        length,
        hitpoints: length,
        isVertical: false
    };

    const getName = () => {
        return ship_params.name;
    }
    const getLength = () => {
        return ship_params.length;
    }
    const isVertical = () => {
        return ship_params.isVertical;
    }
    const isAlive = () => {
        return ship_params.hitpoints > 0;
    }
    const takeDamage = (num = 1) => {
        ship_params.hitpoints -= num;
    }
    const rotate = () => {
        ship_params.isVertical = !ship_params.isVertical;
    }

    return {getName, getLength, isAlive, takeDamage, isVertical, rotate};
}

export {ship};