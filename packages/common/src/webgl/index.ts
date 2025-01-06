import { Mesh } from "../data/Mesh";

import { mat4, Mat4 } from "gl-matrix";
import aspectRacio from "../math/aspectRacio";
import radian from "../math/radian";

import { create as createUniform, build as buildUniform } from "./Uniform";
import { create as createProgram, build as buildProgram } from "./Program";
import { Shader } from "./Shader";
import {
  create as createAttribute,
  build as buildAttribute,
} from "./Attribute";

import { buildRenderBuffers, RenderContext } from "./RenderContext";

import useBindBuffer from "./useBindBuffer";
import useVao from "./useVao";

import { WegGLMatrix4, WegGLVector3 } from "./types";

import getWebglContext, { WEBGL2 } from "./getWebglContext";
export { getWebglContext, WEBGL2 };

type Camera = {
  matrix: Mat4;
  rotate: number;
};
export function createCamera(rotate: number): Camera {
  return { matrix: mat4.create(), rotate };
}

export type Color = [r: number, g: number, b: number];
export type Vector3 = [x: number, y: number, x: number];

type Light = {
  diffuseColor: Color;
  direction: [x: number, y: number, x: number];
};
export function createLignt(diffuseColor: Color, direction: Vector3): Light {
  return { diffuseColor, direction };
}

export type Rect = {
  width: number;
  height: number;
};

function useWebGL(gl: WebGL2RenderingContext) {
  const vao: WebGLVertexArrayObject = gl.createVertexArray();
  const program = createProgram();

  const vertexPosition = createAttribute("aVertexPosition", WegGLVector3);
  const vertexNormal = createAttribute("aVertexNormal", WegGLVector3);

  const materialDiffuse = createUniform("uMaterialDiffuse", WegGLVector3);

  const lightDiffuse = createUniform("uLightDiffuse", WegGLVector3);
  const lightDirection = createUniform("uLightDirection", WegGLVector3);

  const projectionMatrix = createUniform("uProjectionMatrix", WegGLMatrix4);
  const modelViewMatrix = createUniform("uModelViewMatrix", WegGLMatrix4);
  const normalMatrix = createUniform("uNormalMatrix", WegGLMatrix4);

  let _color: Color | undefined;
  let _light: Light | undefined;
  const screen: Rect = { width: 0, height: 0 };

  return {
    addShader(...shaders: Shader[]) {
      program.addShaders(...shaders);
    },
    attachColor(color: Color) {
      _color = color;
    },
    attachLight(light: Light) {
      _light = light;
    },
    context(mesh: Mesh): RenderContext {
      const program_ = buildProgram(gl, program);

      return {
        ...buildRenderBuffers(
          gl,
          vao,
          mesh,
          buildAttribute(gl, program_, vertexPosition),
          buildAttribute(gl, program_, vertexNormal)
        ),
        uMaterialDiffuse: buildUniform(gl, program_, materialDiffuse),
        uLightDiffuse: buildUniform(gl, program_, lightDiffuse),
        uLightDirection: buildUniform(gl, program_, lightDirection),
        uProjectionMatrix: buildUniform(gl, program_, projectionMatrix),
        uModelViewMatrix: buildUniform(gl, program_, modelViewMatrix),
        uNormalMatrix: buildUniform(gl, program_, normalMatrix),
      };
    },
    resize(rect: Rect) {
      screen.width = rect.width;
      screen.height = rect.height;
      gl.canvas.width = screen.width;
      gl.canvas.height = screen.height;
    },
    render(
      camera: Camera,
      { count, indices, vertices: _, normals: __, ...uniforms }: RenderContext
    ) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.viewport(0, 0, screen.width, screen.height);

      if (_color) {
        gl.uniform3fv(uniforms.uMaterialDiffuse, _color);
      }

      if (_light) {
        gl.uniform3fv(uniforms.uLightDiffuse, _light.diffuseColor);
        gl.uniform3fv(uniforms.uLightDirection, _light.direction);
      }

      const modelViewMatrix = mat4.create(),
        normalMatrix = mat4.create();

      mat4.perspectiveNO(
        camera.matrix,
        radian(camera.rotate),
        aspectRacio(screen),
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

      useVao(gl, vao, () => {
        useBindBuffer(gl, indices, gl.ELEMENT_ARRAY_BUFFER, () => {
          gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
        });
      });
    },
  };
}

export default useWebGL;
