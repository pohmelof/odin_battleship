import { getValidStartIndex, getValidity } from "./utils";

describe("Utility functions tests:", () => {
    test('If provided index is valid, returns it', () => {
        expect(getValidStartIndex(10, 3, false, 4)).toEqual(4);
    });
    test('If index is invalid, returns random valid index', () => {
        expect(getValidStartIndex(10, 3, true, 83)).not.toBe(83);
    });
    test('If no index provided, returns random valid index:', () => {
        const index = getValidStartIndex(10, 3, true);
        expect(index).toEqual(getValidStartIndex(10, 3, true, index))
    })
})