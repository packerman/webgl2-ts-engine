export class Color {

    constructor(
        readonly red: number,
        readonly green: number,
        readonly blue: number,
        readonly alpha: number) {}
}

class Colors {

    static fromRgbHex(hex: number): Color {
        return this.fromRgba((hex >> 16) & 0xff, (hex >> 8) & 0xff, hex & 0xff);
    }

    static fromRgba(red: number, green: number, blue: number, alpha = 0xff): Color {
        return new Color(red / 0xff, green / 0xff, blue / 0xff, alpha / 0xff);
    }
}

export const black = Colors.fromRgbHex(0x000000);
export const white = Colors.fromRgbHex(0xFFFFFF);
export const red = Colors.fromRgbHex(0xFF0000);
export const lime = Colors.fromRgbHex(0x00FF00);
export const blue = Colors.fromRgbHex(0x0000FF);
export const yellow = Colors.fromRgbHex(0xFFFF00);
export const cyan = Colors.fromRgbHex(0x00FFFF);
export const magenta = Colors.fromRgbHex(0xFF00FF);
export const silver = Colors.fromRgbHex(0xC0C0C0);
export const gray = Colors.fromRgbHex(0x808080);
export const maroon = Colors.fromRgbHex(0x800000);
export const olive = Colors.fromRgbHex(0x808000);
export const green = Colors.fromRgbHex(0x008000);
export const purple = Colors.fromRgbHex(0x800080);
export const teal = Colors.fromRgbHex(0x008080);
export const navy = Colors.fromRgbHex(0x000080);
