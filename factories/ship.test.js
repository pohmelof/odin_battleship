import { ship } from "./ship";

const length = 4;
const battleship = ship('battleship', length);

describe('Ship factory tests:', () => {
    test('getName: Returns ship name', ()=> {
        expect(battleship.getName()).toEqual('battleship');
    });
    test('getLength: Returns ship length', () => {
        expect(battleship.getLength()).toEqual(length);
    });
    test('isAlive: Returns true if ship HP > 0', () => {
        expect(battleship.isAlive()).toBe(true);
    })
    test('If ship damaged >= length ship is sunk', () => {
        battleship.takeDamage(length);
        expect(battleship.isAlive()).toBe(false);
    })
    test('Initially horizontal', () => {
        expect(battleship.isVertical()).toBe(false);
    })
    test('Rotates with rotate()', () => {
        battleship.rotate();
        expect(battleship.isVertical()).toBe(true);
    })
})