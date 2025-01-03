import { WegGLMatrix4, WegGLVector3 } from "./types";

export type Attribute = {
  name: string;
  type: WegGLMatrix4 | WegGLVector3;
};

export function create(
  name: string,
  type: WegGLMatrix4 | WegGLVector3
): Attribute {
  return {
    name,
    type,
  };
}

export function build(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  attribute: Attribute
): GLint {
  const location = gl.getAttribLocation(program, attribute.name);
  if (location === -1) {
    throw new Error("Attribute not found: " + attribute.name);
  }
  return location;
}
