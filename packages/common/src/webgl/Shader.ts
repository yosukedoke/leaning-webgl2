export const VERTEX_SHADER = 35633;
export const FRAGMENT_SHADER = 35632;

type VERTEX_SHADER = typeof VERTEX_SHADER;
type FRAGMENT_SHADER = typeof FRAGMENT_SHADER;

export type Shader = {
  type: VERTEX_SHADER | FRAGMENT_SHADER;
  source: string;
};

export function create(
  type: VERTEX_SHADER | FRAGMENT_SHADER,
  source: string
): Shader {
  return { type, source };
}

export function build(gl: WebGL2RenderingContext, shader: Shader): WebGLShader {
  const value = gl.createShader(shader.type);
  if (!value) throw new Error("Not exist script element");

  gl.shaderSource(value, shader.source);
  gl.compileShader(value);

  return value;
}
