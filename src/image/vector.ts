interface Vector2 {
    X: number
    Y: number
}

const NewVector2 = (x: number, y: number): Vector2 => ({X: x, Y: y});
const Vector2Mul = (a: Vector2, v: number): Vector2 => ({X: a.X * v, Y: a.Y * v})

export {
    NewVector2,
    Vector2Mul,
}

export type {
    Vector2,
}