const FloydSteinberg = [
    [7, 0, 1],
    [1, 1, 1],
    [5, 1, 0],
    [3, 1, -1]
]

const JuNiNi = [
    [7, 0, 1],
    [5, 0, 2],
    [3, 1, -2],
    [5, 1, -1],
    [7, 1, 0],
    [5, 1, 1],
    [3, 1, 2],
    [1, 2, -2],
    [3, 2, -1],
    [5, 2, 0],
    [3, 2, 1],
    [1, 2, 2]
]

const Stucci = [
    [8, 0, 1],
    [4, 0, 2],
    [2, 1, -2],
    [4, 1, -1],
    [8, 1, 0],
    [4, 1, 1],
    [2, 1, 2],
    [1, 2, -2],
    [2, 2, -1],
    [4, 2, 0],
    [2, 2, 1],
    [1, 2, 2]
]

const Sierra3 = [
    [5, 0, 1],
    [3, 0, 2],
    [2, 1, -2],
    [4, 1, -1],
    [5, 1, 0],
    [4, 1, 1],
    [2, 1, 2],
    [2, 2, -1],
    [3, 2, 0],
    [2, 2, 1]
]

const Sierra2 = [
    [4, 0, 1],
    [3, 0, 2],
    [1, 1, -2],
    [2, 1, -1],
    [3, 1, 0],
    [2, 1, 1],
    [1, 1, 2]
]

const SierraLite = [
    [2, 0, 1],
    [1, 1, -1],
    [1, 1, 0],
]

const GetFilterDivisor = (filter: Array<Array<number>>): number => {
    let divisor = 0;
    for (let i = 0; i < filter[0].length; i++) {
        divisor += filter[i][0]
    }

    return divisor;
}

const FilterByName: { [key: string]: Array<Array<number>> } = {
    FloydSteinberg,
    JuNiNi,
    Stucci,
    Sierra3,
    Sierra2,
    SierraLite,
}

export {
    FloydSteinberg,
    JuNiNi,
    Stucci,
    Sierra3,
    Sierra2,
    SierraLite,
    GetFilterDivisor,
    FilterByName,
}
