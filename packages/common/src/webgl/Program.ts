import { Shader, build as buildShader } from "./Shader";

export type Program = {
  shaders: Shader[];
  addShaders: (...shaders: Shader[]) => void;
  removeShaders: (...shaders: Shader[]) => void;
};

export function create(...inputShaders: Shader[]): Program {
  const _shaders = [...inputShaders];

  return {
    get shaders() {
      return _shaders;
    },
    addShaders: (...shaders: Shader[]) => {
      _shaders.push(...shaders);
    },
    removeShaders: (...shaders: Shader[]) => {
      for (const shader of shaders) {
        const index = _shaders.indexOf(shader);
        if (index !== -1) {
          _shaders.splice(index, 1);
        }
      }
    },
  };
}

export function build(
  gl: WebGL2RenderingContext,
  program: Program
): WebGLProgram {
  const value = gl.createProgram();
  program.shaders
    .map((s) => buildShader(gl, s))
    .forEach((shader) => gl.attachShader(value, shader));
  gl.linkProgram(value);
  gl.useProgram(value);
  return value;
}
