function useVao<R>(
  gl: WebGL2RenderingContext,
  vao: WebGLVertexArrayObject,
  execute: () => R
): R {
  gl.bindVertexArray(vao);
  const result = execute();
  gl.bindVertexArray(null);
  return result;
}

export default useVao;
