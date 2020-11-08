import { GLProgram } from "./program";

export class GLBuffer {

    constructor(private readonly gl: WebGL2RenderingContext,
        readonly target: GLenum,
        readonly buffer: WebGLBuffer,
        readonly stride: GLsizei
        ) {}

    bind(): void {
        this.gl.bindBuffer(this.target, this.buffer);
    }

    unbind(): void {
        this.gl.bindBuffer(this.target, null);
    }
}

export class GLPrimitive {

    constructor(private readonly gl: WebGL2RenderingContext,
        private readonly program: GLProgram,
        private readonly vertexArray: WebGLVertexArrayObject,
        private readonly mode: GLenum,
        private readonly count: GLsizei) {}

    draw(): void {
        this.program.use();
        this.gl.bindVertexArray(this.vertexArray);
        this.gl.drawArrays(this.mode, 0, this.count);
        this.gl.bindVertexArray(null);
        this.gl.useProgram(null);
    }
}

export class GLMesh {

    constructor(private readonly primitives: GLPrimitive[]) {}

    draw(): void {
        this.primitives.forEach(primitive => primitive.draw());
    }
}

export class GLNode {

    constructor(private readonly mesh?: GLMesh) {}

    draw(): void {
        this.mesh?.draw();
    }
}

export class GLScene {

    constructor(private readonly nodes: GLNode[],
        readonly name?: string) {}

    draw(): void {
        this.nodes.forEach(node => node.draw());
    }
}
