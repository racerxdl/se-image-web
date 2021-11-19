import {NewVector2, Vector2, Vector2Mul} from "../image/vector"

interface TextSurface {
    TextureSize: Vector2
    SurfaceSize: Vector2
    SufaceName: string
    FontSize: number
}

interface TextSurfaceProvider {
    BlockName: string
    TextSurfaces: Array<TextSurface | null>
}


const NewTextSurface = (surfaceName: string, textureSize: Vector2, surfaceSize?: Vector2, fontSize: number = 0.1): TextSurface => {
    if (!surfaceSize) {
        surfaceSize = textureSize
    }
    return {
        TextureSize: textureSize,
        SurfaceSize: surfaceSize,
        SufaceName: surfaceName,
        FontSize: fontSize,
    }
}

const NewTextSurfaceProvider = (blockName: string, surfaceCount: number = 1): TextSurfaceProvider => ({
    BlockName: blockName,
    TextSurfaces: Array(surfaceCount),
})

// Initializations from https://github.com/Whiplash141/Whips-Image-Converter/blob/develop/WhipsImageConverter/TextSurfaceProvider.cs
const StandardSize: Vector2 = {X: 512, Y: 512}

const Lcd = NewTextSurfaceProvider("LCD Panel");
const WideLcd = NewTextSurfaceProvider("Wide LCD Panel");
const LargeCornerLcd = NewTextSurfaceProvider("Large Corner LCD");
const SmallCornerLcd = NewTextSurfaceProvider("Small Corner LCD");
const TextPanel = NewTextSurfaceProvider("Text Panel");
const LargeProgrammableBlock = NewTextSurfaceProvider("Large Programmable Block", 2);
const SmallProgrammableBlock = NewTextSurfaceProvider("Small Programmable Block", 2);
const ConsoleBlock = NewTextSurfaceProvider("Console Block", 4);
const FighterCockpit = NewTextSurfaceProvider("Fighter Cockpit", 6);
const LargeCockpit = NewTextSurfaceProvider("Large Cockpit", 6);
const SmallCockpit = NewTextSurfaceProvider("Small Cockpit", 4);
const LargeIndustrialCockpit = NewTextSurfaceProvider("Large Industrial Cockpit", 6);
const SmallIndustrialCockpit = NewTextSurfaceProvider("Small Industrial Cockpit", 5);
const LargeFlightSeat = NewTextSurfaceProvider("Flight Seat");
const LargeControlStation = NewTextSurfaceProvider("Control Station");

Lcd.TextSurfaces[0] = NewTextSurface("ScreenArea", StandardSize);
WideLcd.TextSurfaces[0] = NewTextSurface("ScreenArea", NewVector2(1024, 512));
LargeCornerLcd.TextSurfaces[0] = NewTextSurface("ScreenArea", StandardSize, NewVector2(512, 86), 0.4);
SmallCornerLcd.TextSurfaces[0] = NewTextSurface("ScreenArea", StandardSize, NewVector2(512, 144), 0.2);
TextPanel.TextSurfaces[0] = NewTextSurface("ScreenArea", StandardSize, NewVector2(512, 307.2));

LargeProgrammableBlock.TextSurfaces[0] = NewTextSurface("Large Display", StandardSize, NewVector2(512, 320));
LargeProgrammableBlock.TextSurfaces[1] = NewTextSurface("Keyboard", StandardSize, NewVector2(512, 204.8));

SmallProgrammableBlock.TextSurfaces[0] = NewTextSurface("Large Display", Vector2Mul(StandardSize, 0.5));
SmallProgrammableBlock.TextSurfaces[1] = NewTextSurface("Keyboard", NewVector2(256, 128), NewVector2(256, 90.09091));

ConsoleBlock.TextSurfaces[0] = NewTextSurface("Projection Area", NewVector2(512, 512), NewVector2(512, 512));
ConsoleBlock.TextSurfaces[1] = NewTextSurface("Large Display", NewVector2(256, 256), NewVector2(256, 175));
ConsoleBlock.TextSurfaces[2] = NewTextSurface("Numpad", NewVector2(128, 128), NewVector2(85.33334, 128));
ConsoleBlock.TextSurfaces[3] = NewTextSurface("Keyboard", NewVector2(256, 128), NewVector2(256, 128));

FighterCockpit.TextSurfaces[0] = NewTextSurface("Top Center Screen", NewVector2(256, 256), NewVector2(256, 153.6));
FighterCockpit.TextSurfaces[1] = NewTextSurface("Top Left Screen", NewVector2(128, 128), NewVector2(128, 85.33334));
FighterCockpit.TextSurfaces[2] = NewTextSurface("Top Right Screen", NewVector2(128, 128), NewVector2(128, 85.33334));
FighterCockpit.TextSurfaces[3] = NewTextSurface("Keyboard", NewVector2(256, 128), NewVector2(256, 109.7143));
FighterCockpit.TextSurfaces[4] = NewTextSurface("Bottom Center Screen", NewVector2(256, 256), NewVector2(204.8, 256));
FighterCockpit.TextSurfaces[5] = NewTextSurface("Numpad", NewVector2(128, 128), NewVector2(102.4, 128));

LargeCockpit.TextSurfaces[0] = NewTextSurface("Top Center Screen", NewVector2(256, 256), NewVector2(256, 177.2308));
LargeCockpit.TextSurfaces[1] = NewTextSurface("Top Left Screen", NewVector2(256, 256), NewVector2(256, 192));
LargeCockpit.TextSurfaces[2] = NewTextSurface("Top Right Screen", NewVector2(256, 256), NewVector2(256, 192));
LargeCockpit.TextSurfaces[3] = NewTextSurface("Keyboard", NewVector2(256, 256), NewVector2(256, 146.2857));
LargeCockpit.TextSurfaces[4] = NewTextSurface("Bottom Left Screen", NewVector2(256, 256), NewVector2(256, 199.1111));
LargeCockpit.TextSurfaces[5] = NewTextSurface("Bottom Right Screen", NewVector2(256, 256), NewVector2(256, 199.1111));

SmallCockpit.TextSurfaces[0] = NewTextSurface("Top Center Screen", NewVector2(256, 256), NewVector2(256, 256));
SmallCockpit.TextSurfaces[1] = NewTextSurface("Top Left Screen", NewVector2(256, 256), NewVector2(256, 192));
SmallCockpit.TextSurfaces[2] = NewTextSurface("Top Right Screen", NewVector2(256, 256), NewVector2(256, 192));
SmallCockpit.TextSurfaces[3] = NewTextSurface("Keyboard", NewVector2(256, 256), NewVector2(256, 139.6364));

LargeIndustrialCockpit.TextSurfaces[0] = NewTextSurface("Large Display", NewVector2(256, 256), NewVector2(256, 153.6));
LargeIndustrialCockpit.TextSurfaces[1] = NewTextSurface("Top Left Screen", NewVector2(256, 256), NewVector2(256, 179.2));
LargeIndustrialCockpit.TextSurfaces[2] = NewTextSurface("Top Center Screen", NewVector2(256, 256), NewVector2(256, 179.2));
LargeIndustrialCockpit.TextSurfaces[3] = NewTextSurface("Top Right Screen", NewVector2(256, 256), NewVector2(256, 153.6));
LargeIndustrialCockpit.TextSurfaces[4] = NewTextSurface("Keyboard", NewVector2(256, 256), NewVector2(256, 153.6));
LargeIndustrialCockpit.TextSurfaces[5] = NewTextSurface("Numpad", NewVector2(256, 256), NewVector2(204.8, 256));

SmallIndustrialCockpit.TextSurfaces[0] = NewTextSurface("Top Left Screen", NewVector2(256, 256), NewVector2(256, 182.8571));
SmallIndustrialCockpit.TextSurfaces[1] = NewTextSurface("Top Center Screen", NewVector2(256, 256), NewVector2(256, 170.6667));
SmallIndustrialCockpit.TextSurfaces[2] = NewTextSurface("Top Right Screen", NewVector2(256, 256), NewVector2(256, 182.8571));
SmallIndustrialCockpit.TextSurfaces[3] = NewTextSurface("Keyboard", NewVector2(256, 128), NewVector2(256, 128));
SmallIndustrialCockpit.TextSurfaces[4] = NewTextSurface("Numpad", NewVector2(128, 128), NewVector2(106.6667, 128));

LargeFlightSeat.TextSurfaces[0] = NewTextSurface("Large Display", NewVector2(512, 128), NewVector2(512, 113.7778));
LargeControlStation.TextSurfaces[0] = NewTextSurface("Large Display", NewVector2(512, 512), NewVector2(512, 307.2));

const TextSurfaceProviders: Array<TextSurfaceProvider> = [
    Lcd,
    WideLcd,
    LargeCornerLcd,
    SmallCornerLcd,
    TextPanel,
    LargeProgrammableBlock,
    SmallProgrammableBlock,
    ConsoleBlock,
    FighterCockpit,
    LargeCockpit,
    SmallCockpit,
    LargeIndustrialCockpit,
    SmallIndustrialCockpit,
    LargeFlightSeat,
    LargeControlStation,
]

const ProviderByName : {[key: string]:TextSurfaceProvider} = {}

TextSurfaceProviders.forEach((provider) => ProviderByName[provider.BlockName] = provider)

export {
    StandardSize,
    Lcd,
    WideLcd,
    LargeCornerLcd,
    SmallCornerLcd,
    TextPanel,
    LargeProgrammableBlock,
    SmallProgrammableBlock,
    ConsoleBlock,
    FighterCockpit,
    LargeCockpit,
    SmallCockpit,
    LargeIndustrialCockpit,
    SmallIndustrialCockpit,
    LargeFlightSeat,
    LargeControlStation,
    TextSurfaceProviders,
    ProviderByName,
}

export type {
    TextSurface,
    TextSurfaceProvider,
}