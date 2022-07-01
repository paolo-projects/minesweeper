import Matrix, { MatrixCell } from "../utils/matrix";

export interface BoardOptions {
    size: number;
    bombsCount: number;
}

export type DisplayedCell = "unknown" | "bomb" | "empty" | number;
export type TestResult = "safe" | "bomb" | "won";
export type BoardEntry = {
    row: number;
    column: number;
    value: DisplayedCell;
};

export default class Board {
    public size: number;
    public bombsCount: number;

    private displayed: Matrix<DisplayedCell>;
    private neighboringBombs: Matrix<number>;
    private bombs: Matrix<boolean>;
    private generated: boolean;
    private boom: boolean;

    constructor(options: BoardOptions) {
        if (options.bombsCount > options.size * options.size * 0.8) {
            throw new Error(
                "More than the 80% of the board is covered in bombs. Do you think it is fair???"
            );
        }

        this.size = options.size;
        this.bombsCount = options.bombsCount;
        this.displayed = new Matrix<DisplayedCell>(options.size, "unknown");
        this.neighboringBombs = new Matrix<number>(options.size, 0);
        this.bombs = new Matrix<boolean>(options.size, false);
        this.generated = false;
        this.boom = false;
    }

    generate(excludeRow: number, excludeColumn: number) {
        this.boom = false;

        const bombsArr: number[] = [];
        const rowSize = 1.0 / this.size;
        const columnSize = rowSize / this.size;
        // Add into bombs N random numbers between 0 and 1
        // where N is the bombs count
        for (let i = 0; i < this.bombsCount; i++) {
            bombsArr.push(Math.random());
        }

        // Set the bombs into the matrix
        while (bombsArr.length) {
            let bomb = bombsArr.splice(0, 1)[0];

            let bombRow = Math.floor(bomb / rowSize);
            let bombColumn = Math.floor(
                (bomb - bombRow * rowSize) / columnSize
            );

            // Get a new bomb position if the bomb is on the point to exclude
            // or if the spot is already occupied by another bomb
            while (
                (bombRow === excludeRow && bombColumn === excludeColumn) ||
                this.bombs.get(bombRow, bombColumn) === true
            ) {
                bomb = Math.random();

                bombRow = Math.floor(bomb / rowSize);
                bombColumn = Math.floor(
                    (bomb - bombRow * rowSize) / columnSize
                );
            }

            this.bombs.set(bombRow, bombColumn, true);

            this.neighboringBombs
                .getCell(bombRow, bombColumn)
                .neighbors()
                .forEach((cell) => {
                    cell.setValue(cell.value() + 1);
                });
        }

        this.generated = true;
    }

    test(row: number, column: number): TestResult {
        if (!this.generated) {
            this.generate(row, column);
        }

        if (this.boom) {
            throw new Error("The game is lost!");
        }

        if (this.bombs.get(row, column) === true) {
            this.displayed.set(row, column, "bomb");
            this.boom = true;
            return "bomb";
        } else {
            this.updateDisplayed(this.neighboringBombs.getCell(row, column));

            return this.didIWin() ? "won" : "safe";
        }
    }

    didIWin(): boolean {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (
                    !this.bombs.get(i, j) &&
                    this.displayed.get(i, j) == "unknown"
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    updateDisplayed(
        cell: MatrixCell<number>,
        visited: [number, number][] = []
    ) {
        if (this.displayed.get(cell.row, cell.column) === "unknown") {
            visited.push([cell.row, cell.column]);
            if (cell.value() > 0) {
                this.displayed.set(cell.row, cell.column, cell.value());
            } else {
                this.displayed.set(cell.row, cell.column, "empty");
                const neighbors = cell.neighbors();
                neighbors.forEach((neighbour) => {
                    if (
                        !visited.find(
                            (c) =>
                                c[0] === neighbour.row &&
                                c[1] === neighbour.column
                        )
                    ) {
                        this.updateDisplayed(neighbour, visited);
                    }
                });
            }
        }
    }

    getBoard(): Matrix<DisplayedCell> {
        return this.displayed;
    }

    getBoardArray(): BoardEntry[] {
        const result: BoardEntry[] = [];
        this.displayed.forEach((value, row, column) => {
            result.push({
                row,
                column,
                value,
            });
        });
        return result;
    }
}
