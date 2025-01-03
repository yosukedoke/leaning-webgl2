function getWebgl(
  canvas: HTMLCanvasElement,
  contextType: "webgl2"
): WebGL2RenderingContext {
  const gl: WebGL2RenderingContext | null = canvas.getContext(contextType);
  if (!gl) throw new Error("Didn't get webgl2 context");
  gl.clearColor(0.9, 0.9, 0.9, 1);
  gl.enable(gl.DEPTH_TEST);
  return gl;
}

export default getWebgl;
