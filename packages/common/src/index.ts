import Mesh from "./data/Mesh";
import getElement from "./dom/getElement";
import getScriptText from "./dom/getScriptText";
import useWebGL, { Color, createCamera, createLignt, getWebgl } from "./webgl";

import vertices from "./data/vertices";
import indices from "./data/indices";
import {
  create as createShader,
  VERTEX_SHADER,
  FRAGMENT_SHADER,
} from "./webgl/Shader";

const mesh = Mesh.create(vertices, indices);

// Mesh == vertices + indices
// Material = color, texture, shaders
// Model = Mesh + Material + Transform

function createApp() {
  const gl = getWebgl(getElement<HTMLCanvasElement>("#webgl-canvas"), "webgl2");
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

  return () => {
    webgl.render(camera, context);
  };
}

const render = createApp();

render();
