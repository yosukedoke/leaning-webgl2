import { Matrix4, Vector3 } from "./types";

export type Uniform = {
  name: string;
  type: Matrix4 | Vector3;
};

export function create(name: string, type: Matrix4 | Vector3): Uniform {
  return {
    name,
    type,
  };
}

export function build(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  uniform: Uniform
): WebGLUniformLocation {
  const value = gl.getUniformLocation(program, uniform.name);
  if (!value) throw new Error("Uniform not found: " + uniform.name);
  return value;
}
