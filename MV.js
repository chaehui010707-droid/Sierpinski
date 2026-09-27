function vec2(x, y) {
  return [x, y];
}

function vec4(x, y, z, w) {
  return [x, y, z, w];
}

function flatten(arr) {
  return new Float32Array(arr.flat());
}
