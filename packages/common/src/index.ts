import { create as createMesh } from "./data/Mesh";
import getElement from "./dom/getElement";
import getScriptText from "./dom/getScriptText";
import useWebGL, {
  Color,
  createCamera,
  createLignt,
  getWebglContext,
  WEBGL2,
} from "./webgl";

import vertices from "./data/vertices";
import indices from "./data/indices";

import {
  create as createShader,
  VERTEX_SHADER,
  FRAGMENT_SHADER,
} from "./webgl/Shader";

const mesh = createMesh(vertices, indices);

// Mesh == vertices + indices
// Material = color, texture, shaders
// Model = Mesh + Material + Transform

function createApp() {
  const canvas = getElement<HTMLCanvasElement>("#canvas");
  const gl = getWebglContext(canvas, WEBGL2);
  const webgl = useWebGL(gl);

  webgl.addShader(
    createShader(
      VERTEX_SHADER,
      getScriptText(getElement<HTMLScriptElement>("#vertex-shader"))
    ),
    createShader(
      FRAGMENT_SHADER,
      getScriptText(getElement<HTMLScriptElement>("#fragment-shader"))
    )
  );

  const camera = createCamera(45);
  const light = createLignt([1, 1, 1], [0, -1, -1]);

  const color: Color = [0.5, 0.8, 0.1];

  webgl.attachColor(color);
  webgl.attachLight(light);

  const context = webgl.context(mesh);

  return {
    resize() {
      const width = window.innerWidth;
      const height = window.innerHeight - 32;
      webgl.resize({ width, height });
      return this;
    },
    render() {
      webgl.render(camera, context);
      return this;
    },
    init() {
      this.resize();
      return this;
    },
  };
}

const app = createApp();

window.onresize = () => {
  app.resize();
};

const loop = () => {
  app.render();
  requestAnimationFrame(loop);
};

app.init().render();
loop();
