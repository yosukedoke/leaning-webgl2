import { Mesh } from "../data/Mesh";
import { Attributes, Uniforms } from "../data/types";

import aspectRacio from "../math/aspectRacio";
import radian from "../math/radian";

import { create as createUniform, Uniform } from "./Uniform";
import { create as createProgram, build as buildProgram } from "./Program";
import { Shader } from "./Shader";
import { Attribute } from "./Attribute";

import {
  buildUniforms,
  buildRenderBuffers,
  RenderContext,
} from "./RenderContext";

import useBindBuffer from "./useBindBuffer";
import useVao from "./useVao";

import { Matrix4 } from "./types";
import "../math/mat4";

import getWebgl from "./getWebgl";
export { getWebgl };

type Camera = {
  matrix: number[];
  rotate: number;
};
export function createCamera(rotate: number): Camera {
  return { matrix: mat4.create(), rotate };
}

type Light = {
  diffuseColor: [r: number, g: number, b: number];
  direction: [x: number, y: number, x: number];
};
export function createLignt(
  diffuseColor: [r: number, g: number, b: number],
  direction: [x: number, y: number, x: number]
): Light {
  return { diffuseColor, direction };
}

function useWebGL(gl: WebGL2RenderingContext) {
  const vao: WebGLVertexArrayObject = gl.createVertexArray();
  const program = createProgram();

  const sphereColor = [0.5, 0.8, 0.1];
  const modelViewMatrix = mat4.create(),
    normalMatrix = mat4.create();

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
    render(
      camera: Camera,
      light: Light,
      { count, uniforms, buffers }: RenderContext
    ) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      // We will discuss these operations in later chapters
      mat4.perspective(
        camera.matrix,
        radian(camera.rotate),
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
      gl.uniformMatrix4fv(uniforms.uProjectionMatrix, false, camera.matrix);

      gl.uniformMatrix4fv(uniforms.uModelViewMatrix, false, modelViewMatrix);
      gl.uniformMatrix4fv(uniforms.uMaterialDiffuse, false, sphereColor);

      gl.uniformMatrix4fv(uniforms.uLightDiffuse, false, light.diffuseColor);
      gl.uniformMatrix4fv(uniforms.uLightDirection, false, light.direction);

      useVao(gl, vao, () => {
        useBindBuffer(gl, buffers.indices, gl.ELEMENT_ARRAY_BUFFER, () => {
          gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
        });
      });
    },
  };
}

export default useWebGL;
