import calculateNormals from "../math/calculateNormals";

export type Mesh = {
  vertices: number[];
  indices: number[];
  getNormals: () => number[];
};

export function create(vertices: number[], indices: number[]): Mesh {
  return {
    vertices,
    indices,
    getNormals() {
      return calculateNormals(vertices, indices);
    },
  };
}
