var gl;
var points = [];
var colors = [];
var program;

window.onload = function init() {
  const canvas = document.getElementById("glCanvas");
  gl = canvas.getContext("webgl");
  if (!gl) { alert("WebGL not supported"); return; }

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  document.getElementById("depth").addEventListener("input", render);
  document.getElementById("color").addEventListener("input", render);

  render();
};

function drawSquare(x, y, size, color) {
  var half = size / 2;
  // 정사각형을 두 개의 삼각형으로 나눔
  points.push(vec2(x - half, y - half));
  points.push(vec2(x + half, y - half));
  points.push(vec2(x + half, y + half));

  points.push(vec2(x - half, y - half));
  points.push(vec2(x + half, y + half));
  points.push(vec2(x - half, y + half));

  for (var i = 0; i < 6; i++) colors.push(color);
}

function drawCarpet(depth, x, y, size, color) {
  if (depth === 0) {
    drawSquare(x, y, size, color);
    return;
  }
  var newSize = size / 3;
  for (var dx = -1; dx <= 1; dx++) {
    for (var dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      drawCarpet(depth - 1, x + dx * newSize, y + dy * newSize, newSize, color);
    }
  }
}

function render() {
  points = [];
  colors = [];

  var depth = parseInt(document.getElementById("depth").value);
  var hex = document.getElementById("color").value;
  var rgb = hexToRgb(hex);
  var color = vec4(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1.0);

  drawCarpet(depth, 0, 0, 1.8, color);

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, points.length);
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
