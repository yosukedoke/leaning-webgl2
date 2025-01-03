import { Mesh } from "../data/Mesh";
import { Attributes, Uniforms } from "../data/types";
import aspectRacio from "../math/aspectRacio";
import radian from "../math/radian";
import useVao from "./useVao";

import "../math/mat4";

import getWebgl from "./getWebgl";
import { Uniform } from "./Uniform";
import { create as createProgram, build as buildProgram } from "./Program";
import { Shader } from "./Shader";
import { Attribute } from "./Attribute";
import {
  buildUniforms,
  buildRenderBuffers,
  RenderContext,
} from "./RenderContext";
export { getWebgl };

function useWebGL(gl: WebGL2RenderingContext) {
  const vao: WebGLVertexArrayObject = gl.createVertexArray();
  const program = createProgram();

  return {
    addShader(...shaders: Shader[]) {
      program.addShaders(...shaders);
    },
    build(
      mesh: Mesh,
      attributes: Attributes<Attribute>,
      uniforms: Uniforms<Uniform>
    ): RenderContext {
      const program_ = buildProgram(gl, program);
      return {
        count: mesh.indices.length,
        uniforms: buildUniforms(gl, program_, uniforms),
        buffers: buildRenderBuffers(gl, vao, program_, mesh, attributes),
      };
    },
    render({ count, uniforms, buffers }: RenderContext) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      const modelViewMatrix = mat4.create(),
        projectionMatrix = mat4.create(),
        normalMatrix = mat4.create();

      // We will discuss these operations in later chapters
      mat4.perspective(
        projectionMatrix,
        radian(45),
        aspectRacio(gl.canvas),
        0.1,
        10000
      );
      mat4.identity(modelViewMatrix);
      mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -1.5]);

      mat4.copy(normalMatrix, modelViewMatrix);
      mat4.invert(normalMatrix, normalMatrix);
      mat4.transpose(normalMatrix, normalMatrix);

      gl.uniformMatrix4fv(uniforms.uNormalMatrix, false, normalMatrix);
      gl.uniformMatrix4fv(uniforms.uProjectionMatrix, false, projectionMatrix);
      gl.uniformMatrix4fv(uniforms.uModelViewMatrix, false, modelViewMatrix);

      const lightDiffuseColor = [0.1, 0.1, 1];
      const lightDirection = [0, 1, 1];
      const sphereColor = [0.5, 0.8, 0.1];
      gl.uniformMatrix4fv(uniforms.uMaterialDiffuse, false, sphereColor);
      gl.uniformMatrix4fv(uniforms.uLightDiffuse, false, lightDiffuseColor);
      gl.uniformMatrix4fv(uniforms.uLightDirection, false, lightDirection);

      useVao(gl, vao, () => {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
        gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      });
    },
  };
}

export default useWebGL;
