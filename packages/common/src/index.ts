console.log("common/src/index.js");
import Mesh from "./data/Mesh";
import { Attributes, Uniforms } from "./data/types";
import getElement from "./dom/getElement";
import getScriptText from "./dom/getScriptText";
import useWebGL, { getWebgl } from "./webgl";

import vertices from "./data/vertices";
import indices from "./data/indices";
import {
  create as Shader,
  VERTEX_SHADER,
  FRAGMENT_SHADER,
} from "./webgl/Shader";
import { create as createAttribute } from "./webgl/Attribute";
import { create as createUniform } from "./webgl/Uniform";
import { Matrix4, Vector3 } from "./webgl/types";

const mesh = Mesh.create(vertices, indices);

function createApp() {
  const gl = getWebgl(getElement<HTMLCanvasElement>("#webgl-canvas"), "webgl2");
  const webgl = useWebGL(gl);

  webgl.addShader(
    Shader(
      VERTEX_SHADER,
      getScriptText(getElement<HTMLScriptElement>("#vertex-shader"))
    ),
    Shader(
      FRAGMENT_SHADER,
      getScriptText(getElement<HTMLScriptElement>("#fragment-shader"))
    )
  );

  const attributes = {
    aVertexPosition: createAttribute("aVertexPosition", Vector3),
    aVertexNormal: createAttribute("aVertexNormal", Vector3),
  };

  const uniforms = {
    uProjectionMatrix: createUniform("uProjectionMatrix", Matrix4),
    uModelViewMatrix: createUniform("uModelViewMatrix", Matrix4),
    uNormalMatrix: createUniform("uNormalMatrix", Matrix4),
    uMaterialDiffuse: createUniform("uMaterialDiffuse", Vector3),
    uLightDiffuse: createUniform("uLightDiffuse", Vector3),
    uLightDirection: createUniform("uLightDirection", Vector3),
  };

  const context = webgl.build(mesh, attributes, uniforms);

  return () => {
    webgl.render(context);
  };
}

const render = createApp();

render();
