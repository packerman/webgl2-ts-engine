import { requireNotNil } from "../util";
import whiteColorVertex from "../shaders/white-color.vert";
import whiteColorFragment from "../shaders/white-color.frag";

export class ProgramBuilder {

    constructor(private readonly gl: WebGL2RenderingContext) {}

    buildProgram(vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram | null {
        const vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
        if (!vertexShader) {
            return null;
        }
        const fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);
        if (!fragmentShader) {
            return null;
        }
        return this.linkProgram(vertexShader, fragmentShader);
    }

    private linkProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLShader | null {
        const { gl } = this;
        const program = gl.createProgram();
        if (!program) {
            console.error("Cannot create program");
            return null;
        }
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(`Cannot link program: ${gl.getProgramInfoLog(program)}`);
            return null;
        }
        return program;
    }

    private compileShader(source: string, type: GLenum): WebGLShader | null {
        const { gl } = this;
        const shader = gl.createShader(type);
        if (!shader) {
            console.error("Cannot create shader");
            return null;
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(`Cannot compile shader: ${gl.getShaderInfoLog(shader)}`);
            return null;
        }
        return shader;
    }
}

type AttributeSpecifications = {
    readonly position: string;
    readonly normal?: string;
};

type AttributeLocations = {
    readonly position: GLint;
    readonly normal?: GLint;
};

type UniformSpecifications = {
    readonly modelMatrix?: string,
}

type UniformLocations = {
    readonly modelMatrix?: WebGLUniformLocation;
}

export class GLProgram {

    constructor(private readonly gl: WebGL2RenderingContext,
        private readonly program: WebGLProgram,
        readonly attributeLocations: AttributeLocations,
        readonly uniformLocations: UniformLocations) {}

    use(): void {
        this.gl.useProgram(this.program);
    }
}

export class ProgramFactory {

    constructor(private readonly gl: WebGL2RenderingContext,
        private readonly programBuilder: ProgramBuilder) {}

    whiteColor(): GLProgram {
        return this.createProgram(whiteColorVertex, whiteColorFragment, {
            position: "position"
        },
        {});
    }

    private createProgram(vertexShader: string, fragmentShader: string,
        attributeSpecifications: AttributeSpecifications,
        uniformSpecifications: UniformSpecifications): GLProgram {
        const program = requireNotNil(this.programBuilder.buildProgram(vertexShader, fragmentShader), "Cannot build program");
        const locations = {
            position: this.gl.getAttribLocation(program, attributeSpecifications.position),
            normal: attributeSpecifications.normal ? this.gl.getAttribLocation(program, attributeSpecifications.normal) : undefined,
        };
        const uniforms = {
            modelMatrix: uniformSpecifications.modelMatrix ? this.gl.getUniformLocation(program, uniformSpecifications.modelMatrix) : undefined,
        };
        return new GLProgram(this.gl, program, locations, uniforms);
    }
}
