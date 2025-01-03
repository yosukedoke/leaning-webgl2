import { Mesh } from "../data/Mesh";
import { Attributes, Uniforms } from "../data/types";
import { build as buildAttribute, Attribute } from "./Attribute";
import initArrayBuffer from "./initArrayBuffer";
import initElementArrayBuffer from "./initElementArrayBuffer";
import { build as buildProgram, Program } from "./Program";
import { build as buildUniform, Uniform } from "./Uniform";
import useVao from "./useVao";

export type RenderContext = {
  buffers: {
    vertices: WebGLBuffer;
    indices: WebGLBuffer;
    normals: WebGLBuffer;
  };
  indicesLength: number;
  uniforms: Uniforms<WebGLUniformLocation>;
};

export function build(
  gl: WebGL2RenderingContext,
  vao: WebGLVertexArrayObject,
  mesh: Mesh,
  program: Program,
  attributes: Attributes<Attribute>,
  uniforms: Uniforms<Uniform>
): RenderContext {
  const program_ = buildProgram(gl, program);

  const aVertexPosition = buildAttribute(
      gl,
      program_,
      attributes.aVertexPosition
    ),
    aVertexNormal = buildAttribute(gl, program_, attributes.aVertexNormal);

  const uniforms_: Uniforms<WebGLUniformLocation> = Object.entries(
    uniforms
  ).reduce((acc, [name, uniform]) => {
    acc[name] = buildUniform(gl, program_, uniform);
    return acc;
  }, {} as Uniforms<WebGLUniformLocation>);

  const indicesLength = mesh.indices.length;

  const buffers = useVao(gl, vao, () => {
    const vertices = initArrayBuffer(gl, mesh.vertices, aVertexPosition);
    const normals = initArrayBuffer(gl, mesh.getNormals(), aVertexNormal);
    const indices = initElementArrayBuffer(gl, mesh.indices);
    return { vertices, indices, normals };
  });

  return { buffers, indicesLength, uniforms: uniforms_ };
}
