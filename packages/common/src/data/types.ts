export type Attributes<T> = {
  aVertexPosition: T;
  aVertexNormal: T;
};

export type ProjectionUniforms<T> = {
  uProjectionMatrix: T;
  uModelViewMatrix: T;
  uNormalMatrix: T;
};

export type LightUniforms<T> = {
  uMaterialDiffuse: T;
  uLightDiffuse: T;
  uLightDirection: T;
};
