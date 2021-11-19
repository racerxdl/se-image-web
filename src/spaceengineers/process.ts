import {ColorAdd, ColorMul, ColorSub, NewColor} from "../image/color3";
import {BIT_SPACING, fakeTransparency} from "./constants";
import {GetFilterDivisor} from "../image/dither";

const GetClosestColor = (pixelColor: Color): Color => NewColor(
    Math.round(pixelColor.R / BIT_SPACING) * BIT_SPACING,
    Math.round(pixelColor.G / BIT_SPACING) * BIT_SPACING,
    Math.round(pixelColor.B / BIT_SPACING) * BIT_SPACING,
    pixelColor.A);

const PixelAt = (data: ImageData, x: number, y: number): Color => {
    const p = 4 * (y * data.width + x) // RGBA
    if (p >= data.data.length - 4) {
        return NewColor(0, 0, 0, 0)
    }
    return NewColor(data.data[p], data.data[p + 1], data.data[p + 2], data.data[p + 3])
}

const SetPixelAt = (data: ImageData, x: number, y: number, c: Color) => {
    const p = 4 * (y * data.width + x) // RGBA
    if (p >= data.data.length - 4) {
        return NewColor(0, 0, 0, 0)
    }

    data.data[p] = c.R
    data.data[p + 1] = c.G
    data.data[p + 2] = c.B
    data.data[p + 3] = c.A
}

const FilterCanvas = (canvas: HTMLCanvasElement, filter: Array<Array<number>>, bgcolor?: Color) => {
    if (!bgcolor) {
        bgcolor = NewColor(0, 0, 0, 255)
    }

    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const { width, height } = canvas;
    const divisor = GetFilterDivisor(filter)

    for (let row = 0; row < width; row++) {
        for (let col = 0; col < height; col++) {
            const oldColor = PixelAt(imageData, row, col)
            const newColor = GetClosestColor(oldColor)
            let error = ColorSub(oldColor, newColor)

            if (oldColor.A < 36) {
                SetPixelAt(imageData, row, col, bgcolor)
                error = bgcolor
            } else {
                SetPixelAt(imageData, row, col, newColor)
            }

            for (let i = 0; i < filter[0].length; i++) {
                const factor = filter[i][0] / divisor; //factor
                const rowIndex = filter[i][1] + row; //adjusted row
                const colIndex = filter[i][2] + col; //adjusted column
                const c = PixelAt(imageData, rowIndex, colIndex)
                const err = ColorMul(error, factor)
                SetPixelAt(imageData, rowIndex, colIndex, ColorAdd(c, err))
            }
        }
    }

    ctx.putImageData(imageData, 0, 0)
}

const ColorToChar = (r: number, g: number, b: number) : string => {
    const c = (Math.round(r / BIT_SPACING) << 6) + (Math.round(g / BIT_SPACING) << 3) + (Math.round(b / BIT_SPACING));
    return String.fromCharCode(0xe100 + c)
}

const buildImageString = (canvas: HTMLCanvasElement, extra?: string) : string => {
    let result = ""
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const width = imageData.width;
    const height = imageData.height;

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const c = PixelAt(imageData, row, col)
            const colorChar = (c.A >= 36) ? ColorToChar(c.R, c.G, c.B) : fakeTransparency;
            result += colorChar
        }

        if (row + 1 < height) {
            result += "\n"
        }
    }
    // Add Comment at end
    result += `SEI${extra}`
    return result
}

export {
    GetClosestColor,
    FilterCanvas,
    buildImageString,
}