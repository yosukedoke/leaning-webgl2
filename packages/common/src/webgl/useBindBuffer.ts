function useBindBuffer<R>(
  gl: WebGL2RenderingContext,
  buffer: WebGLBuffer,
  target: GLenum,
  execute: () => R
): R {
  gl.bindBuffer(target, buffer);
  const result = execute();
  gl.bindBuffer(target, null);
  return result;
}

export default useBindBuffer;
