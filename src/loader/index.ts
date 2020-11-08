import { GLBuffer, GLMesh, GLNode, GLPrimitive, GLScene } from "../gl";
import { ProgramFactory } from "../gl/program";
import { Attribute, Integer, Root, Types } from "../gltf";
import { requireNotNil } from "../util";
import { Loaded } from "./loaded";

export class GltfLoader {

    constructor(private readonly gl: WebGL2RenderingContext,
        private readonly programFactory: ProgramFactory) { }

    async load(uri: string): Promise<Loaded> {
        const response = await fetch(uri);
        const root: Root = await response.json();

        const bufferData = await this.loadBufferData(root.buffers.map((buffer => new URL(buffer.uri, uri).toString())));

        const buffers = root.bufferViews.map(bufferView => {
            const buffer = requireNotNil(this.gl.createBuffer(), "Cannot create a buffer");
            this.gl.bindBuffer(bufferView.target, buffer);
            const dataView = new DataView(bufferData[bufferView.buffer], bufferView.byteOffset, bufferView.byteLength);
            this.gl.bufferData(bufferView.target, dataView, this.gl.STATIC_DRAW);
            return new GLBuffer(this.gl, bufferView.target, buffer, bufferView.byteStride || 0);
        });

        const program = this.programFactory.whiteColor();
        program.use();

        const meshes = root.meshes.map(mesh => {
            const primitives = mesh.primitives.map(primitive => {
                const vertexArray = requireNotNil(this.gl.createVertexArray(), "Cannot create vertex array");
                this.gl.bindVertexArray(vertexArray);

                this.setAttribute(
                    primitive.attributes[Attribute.Position],
                    requireNotNil(program.attributeLocations.position, `Location not found`),
                    root, buffers);

                this.gl.bindVertexArray(null);

                const count = root.accessors[requireNotNil(primitive.attributes[Attribute.Position])].count;

                return new GLPrimitive(this.gl, program, vertexArray, primitive.mode || this.gl.TRIANGLES, count);
            });
            return new GLMesh(primitives);
        });

        const nodes = root.nodes.map(node => new GLNode(node.mesh != undefined ? meshes[node.mesh] : undefined));

        const scenes = root.scenes.map(scene => new GLScene(scene.nodes.map(index => nodes[index])));

        return new Loaded(scenes, root.scene);
    }

    private async loadBufferData(uris: string[]): Promise<ArrayBuffer[]> {
        const responses = await Promise.all(uris.map(uri => fetch(uri)));
        return Promise.all(responses.map(response => response.arrayBuffer()));
    }

    private setAttribute(index: Integer | undefined, location: GLint, root: Root, buffers: GLBuffer[]): void {
        const accessor = root.accessors[requireNotNil(index, "Accessor index not found")];
        const buffer = buffers[accessor.bufferView];
        buffer.bind();
        this.gl.enableVertexAttribArray(location);
        this.gl.vertexAttribPointer(location,
            Types.getSize(accessor.type),
            accessor.componentType,
            accessor.normalized || false,
            buffer.stride,
            accessor.byteOffset || 0);
        buffer.unbind();
    }
}
