import useBindBuffer from "./useBindBuffer";

function initElementArrayBuffer(
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

export default initElementArrayBuffer;
