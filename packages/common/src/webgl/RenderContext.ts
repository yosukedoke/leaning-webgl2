import { Mesh } from "../data/Mesh";
import { Attributes, Uniforms } from "../data/types";
import { build as buildAttribute, Attribute } from "./Attribute";
import { build as buildProgram, Program } from "./Program";
import { build as buildUniform, Uniform } from "./Uniform";
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
  program: WebGLProgram,
  mesh: Mesh,
  attributes: Attributes<Attribute>
): RenderBuffers {
  const aVertexPosition = buildAttribute(
    gl,
    program,
    attributes.aVertexPosition
  );
  const aVertexNormal = buildAttribute(gl, program, attributes.aVertexNormal);

  return useVao(gl, vao, () => {
    const vertices = buildArrayBuffer(gl, mesh.vertices, aVertexPosition);
    const normals = buildArrayBuffer(gl, mesh.getNormals(), aVertexNormal);
    const indices = buildElementArrayBuffer(gl, mesh.indices);
    return { vertices, indices, normals };
  });
}

export type RenderBuffers = {
  vertices: WebGLBuffer;
  indices: WebGLBuffer;
  normals: WebGLBuffer;
};

export function buildUniforms(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  uniforms: Uniforms<Uniform>
): Uniforms<WebGLUniformLocation> {
  return Object.entries(uniforms).reduce((acc, [name, uniform]) => {
    acc[name] = buildUniform(gl, program, uniform);
    return acc;
  }, {} as Uniforms<WebGLUniformLocation>);
}

export type RenderContext = {
  buffers: RenderBuffers;
  count: number;
  uniforms: Uniforms<WebGLUniformLocation>;
};
