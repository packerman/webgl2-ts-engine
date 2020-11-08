export type Integer = number;

export interface Root {
    scene?: number;
    scenes: Scene[];
    nodes: Node[];
    meshes: Mesh[];
    buffers: Buffer[];
    bufferViews: BufferView[];
    accessors: Accessor[];
    asset: Asset;
}

interface Scene {
    name?: string;
    nodes: Integer[];
}

interface Node {
    mesh?: Integer;
}

interface Mesh {
    primitives: Primitive[];
}

export enum Attribute {
    Position = "POSITION",
}

enum Mode {
    Points,
    Lines,
    LineLoop,
    LineStrip,
    Triangles,
    TriangleStrip,
    TriangleFan
}

interface Primitive {
    attributes: Partial<Record<Attribute, Integer>>;
    indices?: Integer;
    mode?: Mode;
}

interface Buffer {
    uri: string;
    byteLength: Integer;
}

interface BufferView {
    buffer: Integer;
    byteOffset?: Integer;
    byteLength: Integer;
    byteStride?: Integer;
    target: Target;
}

enum Target {
    ArrayBuffer = 34962,
    ElementArrayBuffer = 34963
}

interface Accessor {
    bufferView: Integer;
    byteOffset?: Integer;
    componentType: ComponentType;
    count: Integer;
    type: Type;
    max: number[],
    min: number[],
    normalized?: boolean,
}

enum ComponentType {
    Byte = 5120,
    UnsignedByte = 5121,
    Short = 5122,
    UnsignedShort = 5123,
    UnsignedInt = 5125,
    Float = 5126
}

enum Type {
    Scalar = "SCALAR",
    Vec2 = "VEC2",
    Vec3 = "VEC3",
    Vec4 = "VEC4",
    Mat2 = "MAT2",
    Mat3 = "MAT3",
    Mat4 = "MAT4"
}

export class Types {
    static getSize(type: Type): number {
        switch (type) {
            case Type.Scalar:
                return 1;
            case Type.Vec2:
                return 2;
            case Type.Vec3:
                return 3;
            case Type.Vec4:
                return 4;
            case Type.Mat2:
                return 4;
            case Type.Mat3:
                return 9;
            case Type.Mat4:
                return 16;
        }
    }
}

interface Asset {
    version: "2.0";
}
