function calculateNormals(vertices: number[], indices: number[]): number[] {
  const x = 0,
    y = 1,
    z = 2,
    ns: number[] = [];

  // For each vertex, initialize normal x, normal y, normal z
  for (let i = 0; i < vertices.length; i += 3) {
    ns[i + x] = 0.0;
    ns[i + y] = 0.0;
    ns[i + z] = 0.0;
  }

  // We work on triads of vertices to calculate
  for (let i = 0; i < indices.length; i += 3) {
    // Normals so i = i+3 (i = indices index)
    const v1: number[] = [],
      v2: number[] = [],
      normal: number[] = [];

    // p2 - p1
    v1[x] = vertices[3 * indices[i + 2] + x] - vertices[3 * indices[i + 1] + x];
    v1[y] = vertices[3 * indices[i + 2] + y] - vertices[3 * indices[i + 1] + y];
    v1[z] = vertices[3 * indices[i + 2] + z] - vertices[3 * indices[i + 1] + z];

    // p0 - p1
    v2[x] = vertices[3 * indices[i] + x] - vertices[3 * indices[i + 1] + x];
    v2[y] = vertices[3 * indices[i] + y] - vertices[3 * indices[i + 1] + y];
    v2[z] = vertices[3 * indices[i] + z] - vertices[3 * indices[i + 1] + z];

    // Cross product by Sarrus Rule
    normal[x] = v1[y] * v2[z] - v1[z] * v2[y];
    normal[y] = v1[z] * v2[x] - v1[x] * v2[z];
    normal[z] = v1[x] * v2[y] - v1[y] * v2[x];

    // Update the normals of that triangle: sum of vectors
    for (let j = 0; j < 3; j++) {
      ns[3 * indices[i + j] + x] = ns[3 * indices[i + j] + x] + normal[x];
      ns[3 * indices[i + j] + y] = ns[3 * indices[i + j] + y] + normal[y];
      ns[3 * indices[i + j] + z] = ns[3 * indices[i + j] + z] + normal[z];
    }
  }

  // Normalize the result.
  // The increment here is because each vertex occurs.
  for (let i = 0; i < vertices.length; i += 3) {
    // With an offset of 3 in the array (due to x, y, z contiguous values)
    const nn: number[] = [];
    nn[x] = ns[i + x];
    nn[y] = ns[i + y];
    nn[z] = ns[i + z];

    let len = Math.sqrt(nn[x] * nn[x] + nn[y] * nn[y] + nn[z] * nn[z]);
    if (len === 0) len = 1.0;

    nn[x] = nn[x] / len;
    nn[y] = nn[y] / len;
    nn[z] = nn[z] / len;

    ns[i + x] = nn[x];
    ns[i + y] = nn[y];
    ns[i + z] = nn[z];
  }

  return ns;
}

export default calculateNormals;
