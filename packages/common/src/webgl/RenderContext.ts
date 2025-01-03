import { Mesh } from "../data/Mesh";
import useVao from "./useVao";
import useBindBuffer from "./useBindBuffer";

function buildArrayBuffer(
  gl: WebGL2RenderingContext,
  values: number[],
  attribute: GLint
): WebGLBuffer {
  const buffer = gl.createBuffer();
  useBindBuffer(gl, buffer, gl.ARRAY_BUFFER, () => {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0);
  });
  return buffer;
}

function buildElementArrayBuffer(
  gl: WebGL2RenderingContext,
  values: number[]
): WebGLBuffer {
  const buffer = gl.createBuffer();
  useBindBuffer(gl, buffer, gl.ELEMENT_ARRAY_BUFFER, () => {
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(values),
      gl.STATIC_DRAW
    );
  });
  return buffer;
}

export function buildRenderBuffers(
  gl: WebGL2RenderingContext,
  vao: WebGLVertexArrayObject,
  mesh: Mesh,
  aVertexPosition: GLuint,
  aVertexNormal: GLuint
): RenderBuffers {
  return useVao(gl, vao, () => {
    const vertices = buildArrayBuffer(gl, mesh.vertices, aVertexPosition);
    const normals = buildArrayBuffer(gl, mesh.getNormals(), aVertexNormal);
    const indices = buildElementArrayBuffer(gl, mesh.indices);
    const count = mesh.indices.length;
    return { vertices, indices, normals, count };
  });
}

export type RenderBuffers = {
  vertices: WebGLBuffer;
  indices: WebGLBuffer;
  normals: WebGLBuffer;
  count: number;
};

export type MaterialUniforms = {
  uMaterialDiffuse: WebGLUniformLocation;
};

export type LightUniforms = {
  uLightDiffuse: WebGLUniformLocation;
  uLightDirection: WebGLUniformLocation;
};

export type ProjectionUniforms = {
  uNormalMatrix: WebGLUniformLocation;
  uModelViewMatrix: WebGLUniformLocation;
  uProjectionMatrix: WebGLUniformLocation;
};

export type RenderContext = ProjectionUniforms &
  MaterialUniforms &
  LightUniforms &
  RenderBuffers;
