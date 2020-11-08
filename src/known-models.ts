export class KhronosSamples {

    static names = [
        'TriangleWithoutIndices',
        'Triangle'
    ];

    static getSampleUri(sampleId: string | number): string {
        const name = typeof sampleId === 'number' ? this.names[sampleId] : sampleId;
        return `https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/${name}/glTF/${name}.gltf`;
    }
}
