# MineSweeper

An implementation of the logic of the minesweeper game.

## Installation

Install from the NPM registry:

```sh
npm i @paoloinfante/minesweeper
```

## Docs

The game is built around the `Board` class. The contructor accepts an object with (for now) two options:

```typescript
export interface BoardOptions {
    size: number;
    bombsCount: number;
}
```

The game can be "played" by calling the `test()` method:

```typescript
test(row: number, column: number): TestResult
```

accepting the current row/column position where the user has clicked. The `TestResult` object returned by the method
is:

```typescript
type TestResult = "safe" | "bomb" | "won"
```

The current board is stored inside the class and can be retrieved through the `getBoard()` method,
returning a `Matrix<DisplayedCell>` object. The `DisplayedCell` object is:

```typescript
type DisplayedCell = "unknown" | "bomb" | "empty" | number
```

where `unknown` is a cell that has not been touched, `empty` is an empty cell (with no bombs in the surroundings),
`bomb` is a cell where the user hit a bomb. When the cell value is a number it's the number of bombs surrounding the cell.

### Example

```typescript
const game = new Board({
  size: 8,
  bombsCount: 12
});

// It's equivalent to the user clicking the top-left cell. The first cell is safe and the rest of the board
// is randomly populated with bombs
const result = game.test(0, 0);
// result is "safe"

const board = game.getBoard();

// Do something with the updated board
```
