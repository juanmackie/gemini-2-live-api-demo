/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
declare const vs = "precision highp float;\n\nin vec3 position;\n\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\n\nvoid main() {\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\n}";
declare const fs = "precision highp float;\n\nout vec4 fragmentColor;\n\nuniform vec2 resolution;\nuniform float rand;\n\nvoid main() {\n  float aspectRatio = resolution.x / resolution.y; \n  vec2 vUv = gl_FragCoord.xy / resolution;\n  float noise = (fract(sin(dot(vUv, vec2(12.9898 + rand,78.233)*2.0)) * 43758.5453));\n\n  vUv -= .5;\n  vUv.x *= aspectRatio;\n\n  float factor = 4.;\n  float d = factor * length(vUv);\n  vec3 from = vec3(3.) / 255.;\n  vec3 to = vec3(16., 12., 20.) / 2550.;\n\n  fragmentColor = vec4(mix(from, to, d) + .005 * noise, 1.);\n}\n";
export { fs, vs };
//# sourceMappingURL=backdrop-shader.d.ts.map