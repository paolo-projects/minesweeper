import Board from "../minesweeper/board";

test("Successfully create the board", () => {
    const board = new Board({
        size: 8,
        bombsCount: 18,
    });

    for (const v of board.getBoard()) {
        expect(v).toBe("unknown");
    }
});

test("Board with no bombs should give won first try", () => {
    const board = new Board({
        size: 8,
        bombsCount: 0,
    });

    const result = board.test(0, 0);
    expect(result).toBe("won");
});

test("Board with bombs should always give safe at first try", () => {
    const board = new Board({
        size: 8,
        bombsCount: 15,
    });

    const row = Math.round(Math.random() * 7);
    const col = Math.round(Math.random() * 7);
    const result = board.test(row, col);
    expect(result).toBe("safe");
});
