import useBindBuffer from "./useBindBuffer";

function initArrayBuffer(
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

export default initArrayBuffer;
