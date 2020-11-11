import { mat4 } from "gl-matrix";
import { GLBuffer, GLMesh, GLNode, GLDefaultPrimitive, GLScene, GLIndexedPrimitive, GLPrimitive } from "../gl";
import { GLProgram, ProgramFactory } from "../gl/program";
import { Attribute, Integer, Primitive, Root, Types, Node } from "../gltf";
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
                const glPrimitive = this.createGLPrimitive(primitive, root, program, buffers);
                this.unbindArrays();
                return glPrimitive;
            });
            return new GLMesh(primitives);
        });

        const nodes = root.nodes.map(node => new GLNode(
            this.createTransform(node),
            node.mesh != undefined ? meshes[node.mesh] : undefined));

        const scenes = root.scenes.map(scene => new GLScene(scene.nodes.map(index => nodes[index])));

        return new Loaded(scenes, root.scene);
    }

    private async loadBufferData(uris: string[]): Promise<ArrayBuffer[]> {
        const responses = await Promise.all(uris.map(uri => fetch(uri)));
        return Promise.all(responses.map(response => response.arrayBuffer()));
    }

    private createGLPrimitive(primitive: Primitive, root: Root, program: GLProgram, buffers: GLBuffer[]): GLPrimitive {
        const vertexArray = requireNotNil(this.gl.createVertexArray(), "Cannot create vertex array");
            this.gl.bindVertexArray(vertexArray);

            this.setAttribute(
                primitive.attributes[Attribute.Position],
                requireNotNil(program.attributeLocations.position, `Location not found`),
                root, buffers);

            if (primitive.indices !== undefined) {
                const accessor = root.accessors[primitive.indices];
                const buffer = buffers[accessor.bufferView];
                buffer.bind();

                return new GLIndexedPrimitive(this.gl, program, vertexArray, primitive.mode || this.gl.TRIANGLES, accessor.count, accessor.componentType);
            }

            const count = root.accessors[requireNotNil(primitive.attributes[Attribute.Position])].count;
            return new GLDefaultPrimitive(this.gl, program, vertexArray, primitive.mode || this.gl.TRIANGLES, count);
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
    }

    private createTransform(node: Node): mat4 {
        if (node.matrix) {
            const out = mat4.create();
            return mat4.copy(out, node.matrix);
        } else if (node.translation || node.rotation || node.scale) {
            const out = mat4.create();
            return mat4.fromRotationTranslationScale(out,
                node.rotation || [0, 0, 0, 1],
                node.translation || [0, 0, 0],
                node.scale || [1, 1, 1]);
        } else {
            return mat4.create();
        }
    }

    private unbindArrays(): void {
        this.gl.bindVertexArray(null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }
}
