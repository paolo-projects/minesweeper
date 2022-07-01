import Matrix, { MatrixCell } from "../utils/matrix";

test("Matrix default initialization", () => {
    const m1 = new Matrix<number>(2, 0);
    expect(m1.data).toHaveLength(4);
    m1.forEach((v) => expect(v).toBe(0));

    const m2 = new Matrix<string>(5, "ciao");
    expect(m2.data).toHaveLength(5 * 5);
    m2.forEach((v) => expect(v).toBe("ciao"));
});

test("Matrix cell neighbours should be correct", () => {
    const m = new Matrix<number>(3, 0);
    // prettier-ignore
    {
    m.set(0, 0, 5);     m.set(0, 1, 10);    m.set(0, 2, 15);
    m.set(1, 0, 1);     m.set(1, 1, 4);     m.set(1, 2, 7);
    m.set(2, 0, 8);     m.set(2, 1, 23);    m.set(2, 2, 85);
    }

    let n = m.getCell(0, 0).neighbors();
    expect(n).toHaveLength(3);
    expect(n).toContainEqual(m.getCell(0, 1));
    expect(n).toContainEqual(m.getCell(1, 1));
    expect(n).toContainEqual(m.getCell(1, 0));

    n = m.getCell(1, 1).neighbors();
    expect(n).toHaveLength(8);
    expect(n).toContainEqual(m.getCell(0, 0));
    expect(n).toContainEqual(m.getCell(0, 1));
    expect(n).toContainEqual(m.getCell(0, 2));
    expect(n).toContainEqual(m.getCell(1, 0));
    expect(n).toContainEqual(m.getCell(1, 2));
    expect(n).toContainEqual(m.getCell(2, 0));
    expect(n).toContainEqual(m.getCell(2, 1));
    expect(n).toContainEqual(m.getCell(2, 2));
});

test("matrix iterator", () => {
    const m = new Matrix<number>(3, 0);

    const vals = [5, 10, 15, 1, 4, 7, 8, 23, 85];
    // prettier-ignore
    {
    m.set(0, 0, vals[0]);     m.set(0, 1, vals[1]);    m.set(0, 2, vals[2]);
    m.set(1, 0, vals[3]);     m.set(1, 1, vals[4]);     m.set(1, 2, vals[5]);
    m.set(2, 0, vals[6]);     m.set(2, 1, vals[7]);    m.set(2, 2, vals[8]);
    }

    let i = 0;
    for (const c of m) {
        expect(c.value()).toBe(vals[i++]);
    }
});

test("matrix clone", () => {
    const m = new Matrix<number>(2, 0);
    expect(m.get(0, 1)).toBe(0);

    const m2 = Matrix.clone(m);
    expect(m2.get(0, 1)).toBe(0);

    m2.set(0, 1, 555);
    expect(m2.get(0, 1)).toBe(555);
    expect(m.get(0, 1)).toBe(0);
});
