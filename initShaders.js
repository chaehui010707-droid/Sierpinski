function initShaders(gl, vertexShaderId, fragmentShaderId) {
  var vertShdr = gl.createShader(gl.VERTEX_SHADER);
  var vertElem = document.getElementById(vertexShaderId);
  gl.shaderSource(vertShdr, vertElem.text);
  gl.compileShader(vertShdr);

  var fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
  var fragElem = document.getElementById(fragmentShaderId);
  gl.shaderSource(fragShdr, fragElem.text);
  gl.compileShader(fragShdr);

  var program = gl.createProgram();
  gl.attachShader(program, vertShdr);
  gl.attachShader(program, fragShdr);
  gl.linkProgram(program);

  return program;
}
