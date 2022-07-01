import cloneDeep from "lodash.clonedeep";

/**
 * @template T
 */
export default class Matrix<T> {
    data: T[];
    size: number;
    /**
     * @param {number} n The size of the square matrix
     * @param {T} defaultValue The default value
     */
    constructor(n: number, defaultValue?: T) {
        this.data = new Array(n * n);
        this.size = n;

        if (defaultValue !== undefined) {
            for (let i = 0; i < n * n; i++) {
                this.data[i] = defaultValue;
            }
        }
    }

    get(row: number, column: number): T {
        if (row < this.size && column < this.size && row >= 0 && column >= 0) {
            return this.data[column + row * this.size];
        } else {
            throw new Error("row or column out of range");
        }
    }

    set(row: number, column: number, value: T) {
        if (row < this.size && column < this.size && row >= 0 && column >= 0) {
            this.data[column + row * this.size] = value;
        } else {
            throw new Error("row or column out of range");
        }
    }

    getCell(row: number, column: number): MatrixCell<T> {
        if (row < this.size && column < this.size && row >= 0 && column >= 0) {
            return new MatrixCell(row, column, this);
        } else {
            throw new Error("row or column out of range");
        }
    }

    [Symbol.iterator](): Iterator<MatrixCell<T>> {
        return new MatrixCellIterator(this);
    }

    forEach(callback: (value: T, row: number, column: number) => void) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                callback(this.get(i, j), i, j);
            }
        }
    }

    static clone<E>(obj: Matrix<E>): Matrix<E> {
        const result = new Matrix<E>(obj.size);
        result.data = cloneDeep(obj.data);
        return result;
    }
}

class MatrixCellIterator<T> implements Iterator<MatrixCell<T>> {
    i: number;
    constructor(private matrix: Matrix<T>) {
        this.i = 0;
    }

    next(): IteratorResult<MatrixCell<T>> {
        if (this.i < this.matrix.data.length) {
            const value = {
                value: this.matrix.getCell(
                    Math.floor(this.i / this.matrix.size),
                    this.i % this.matrix.size
                ),
                done: false,
            };
            this.i++;
            return value;
        } else {
            return {
                value: null,
                done: true,
            };
        }
    }
}

export class MatrixCell<T> {
    row: number;
    column: number;
    matrix: Matrix<T>;

    constructor(row: number, column: number, matrix: Matrix<T>) {
        this.row = row;
        this.column = column;
        this.matrix = matrix;
    }

    value(): T {
        return this.matrix.get(this.row, this.column);
    }

    setValue(value: T) {
        this.matrix.set(this.row, this.column, value);
    }

    neighbors(): MatrixCell<T>[] {
        const res: MatrixCell<T>[] = [];
        for (
            let i = Math.max(this.row - 1, 0);
            i <= Math.min(this.row + 1, this.matrix.size - 1);
            i++
        ) {
            for (
                let j = Math.max(this.column - 1, 0);
                j <= Math.min(this.column + 1, this.matrix.size - 1);
                j++
            ) {
                if (i !== this.row || j !== this.column) {
                    res.push(new MatrixCell(i, j, this.matrix));
                }
            }
        }
        return res;
    }
}
