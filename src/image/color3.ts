// Based on https://github.com/Whiplash141/Whips-Image-Converter/blob/develop/WhipsImageConverter/Color3.cs

const ColorAdd = (a: Color, b: Color): Color => ({R: a.R + b.R, G: a.G + b.G, B: a.B + b.B, A: a.A})
const ColorSub = (a: Color, b: Color): Color => ({R: a.R - b.R, G: a.G - b.G, B: a.B - b.B, A: a.A})
const ColorMul = (a: Color, b: number): Color => ({
    R: Math.round(a.R * b),
    G: Math.round(a.G * b),
    B: Math.round(a.B * b),
    A: a.A
})
const ColorDiv = (a: Color, b: number): Color => ColorMul(a, 1.0 / b)

const NewColor = (r: number, g: number, b: number, a: number): Color => ({R: r, G: g, B: b, A: a})

export {
    ColorAdd,
    ColorSub,
    ColorMul,
    ColorDiv,
    NewColor,
}