export type Attributes<T> = {
  aVertexPosition: T;
  aVertexNormal: T;
};
export type Uniforms<T> = {
  uProjectionMatrix: T;
  uModelViewMatrix: T;
  uNormalMatrix: T;
  uMaterialDiffuse: T;
  uLightDiffuse: T;
  uLightDirection: T;
};
