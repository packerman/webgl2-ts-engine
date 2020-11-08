import { Color, gray } from "./color";
import { ProgramBuilder, ProgramFactory } from "./gl/program";
import { KhronosSamples } from "./known-models";
import { GltfLoader } from "./loader";

window.onload = (): void => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    const gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error('WebGL2 is not available');
        return;
    }
    console.log(`WebGL version = ${gl.getParameter(gl.VERSION)}`);
    console.log(`WebGL vendor = ${gl.getParameter(gl.VENDOR)}`);
    console.log(`WebGL renderer = ${gl.getParameter(gl.RENDERER)}`);

    const onResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    };
    onResize();
    window.addEventListener('resize', onResize);

    setClearColor(gl, gray);

    const programBuilder = new ProgramBuilder(gl);
    const programFactory = new ProgramFactory(gl, programBuilder);

    const loader = new GltfLoader(gl, programFactory);
    loader.load(KhronosSamples.getSampleUri(KhronosSamples.names.length - 1))
        .then(loaded => {
            gl.clear(gl.COLOR_BUFFER_BIT);
            loaded.renderScene();
        });
};

function setClearColor(gl: WebGL2RenderingContext, color: Color) {
    gl.clearColor(color.red, color.blue, color.green, color.alpha);
}
