/**
 * @jest-environment jsdom
 */

import { user } from "./user";



describe('User factory tests:', () => {
    const testName = 'Nebuchadnezzar';
    const testUser = user(testName);

    test('GetUserName(): returns user name(string)', () => {
        expect(testUser.getUserName()).toEqual(testName);
    })
    test('GetUserShips(): returns array of ship objects', () => {
        expect(Array.isArray(testUser.getUserShips())).toBe(true);

    })
})