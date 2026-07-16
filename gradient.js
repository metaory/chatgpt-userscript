(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // shaders/b1.glsl.js
  var b1_glsl_exports = {};
  __export(b1_glsl_exports, {
    default: () => b1_glsl_default
  });
  var b1_glsl_default;
  var init_b1_glsl = __esm({
    "shaders/b1.glsl.js"() {
      b1_glsl_default = /* glsl */
      `
vec3 hash3d(vec3 p) {
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)),
          dot(p, vec3(113.5, 271.9, 124.6)));
  p = -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  return p;
}

float noise3d(in vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
      mix(mix(dot(hash3d(i + vec3(0.0, 0.0, 0.0)), f - vec3(0.0, 0.0, 0.0)),
              dot(hash3d(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0)),
              u.x),
          mix(dot(hash3d(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0)),
              dot(hash3d(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0)),
              u.x),
          u.y),
      mix(mix(dot(hash3d(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0)),
              dot(hash3d(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0)),
              u.x),
          mix(dot(hash3d(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0)),
              dot(hash3d(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0)),
              u.x),
          u.y),
      u.z);
}

vec4 shader(vec2 fragCoord) {
  const int layers = 5;
  const float baseSpeed = 0.25; // Base speed
  const float scale = 1.2;

  vec2 uv = (fragCoord - iResolution.xy - .5) / iResolution.y;
  float t = iTime * baseSpeed * timeScale; // Use timeScale for dynamic speed
  uv *= scale;
  float h =
      noise3d(vec3(uv * 2., t)); // Time as z-coordinate for continuous noise
  for (int n = 1; n < layers; n++) {
    float i = float(n);
    uv -= vec2(0.7 / i * sin(i * uv.y + i + t * 2.0 + h * i) +
                  0.8, // Reduced from 5.0 to 2.0
              0.4 / i * sin(uv.x + 4. - i + h + t * 2.0 + 0.3 * i) +
                  1.6); // Reduced from 5.0 to 2.0
  }
  uv -=
      vec2(1.2 * sin(uv.x + t + h) + 1.8, 0.4 * sin(uv.y + t + 0.3 * h) + 1.6);
  vec3 col = vec3(.5 * sin(uv.x) + 0.5, .5 * sin(uv.x + uv.y) + 0.5,
                  .5 * sin(uv.y) + 0.8) *
            0.8;

  // Apply hue shift to the final color
  col = applyHueShift(col, hueShift);

  // Apply saturation adjustment
  col = applySaturation(col, saturation);

  // Apply lightness adjustment
  col = applyLightness(col, lightness);

  return vec4(col, 1.0);
}
`;
    }
  });

  // shaders/b2.glsl.js
  var b2_glsl_exports = {};
  __export(b2_glsl_exports, {
    default: () => b2_glsl_default
  });
  var b2_glsl_default;
  var init_b2_glsl = __esm({
    "shaders/b2.glsl.js"() {
      b2_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  vec2 uv = fragCoord.xy / iResolution.xy;
  vec2 p[4];
  p[0] = vec2(0.1, 0.9);
  p[1] = vec2(0.9, 0.9);
  p[2] = vec2(0.5, 0.1);
  float t = iTime * timeScale;  // Use timeScale for dynamic speed
  p[3] = vec2(cos(t), sin(t)) * 0.4 + vec2(0.5, 0.5);
  vec3 c[4];
  // Add subtle color animation
  float colorShift = sin(t * 0.2) * 0.1;  // Slow color cycling
  c[0] = vec3(0.996078431372549 + colorShift, 0.3411764705882353, 0.33725490196078434);
  c[1] = vec3(0.996078431372549, 0.6352941176470588 + colorShift, 0.1607843137254902);
  c[2] = vec3(0.1450980392156863, 0.8196078431372549, 0.8588235294117647 + colorShift);
  c[3] = vec3(1.0, 1.0, 0.0);
  float blend = 2.0;
  vec3 sum = vec3(0.0);
  float valence = 0.0;
  for (int i = 0; i < 4; i++) {
      float distance = length(uv - p[i]);
      if (distance == 0.0) { distance = 1.0; }
      float w =  1.0 / pow(distance, blend);
      sum += w * c[i];
      valence += w;
  }
  sum /= valence;
  sum = pow(sum, vec3(1.0/2.2));

  // Apply hue shift to the final color
  sum = applyHueShift(sum, hueShift);

  // Apply saturation adjustment
  sum = applySaturation(sum, saturation);

  // Apply lightness adjustment
  sum = applyLightness(sum, lightness);

  return vec4(sum.xyz, 1.0);
}
`;
    }
  });

  // shaders/b3.glsl.js
  var b3_glsl_exports = {};
  __export(b3_glsl_exports, {
    default: () => b3_glsl_default
  });
  var b3_glsl_default;
  var init_b3_glsl = __esm({
    "shaders/b3.glsl.js"() {
      b3_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  vec2 uv = fragCoord/iResolution.xy;
  float ratio = iResolution.x / iResolution.y;
  vec2 tuv = uv;
  tuv -= .5;
  float t = iTime * timeScale;
  float degree = noise(vec2(t * 0.1, tuv.x*tuv.y));
  tuv.y *= 1./ratio;
  tuv *= rot(radians((degree-.5)*720.+180.));
  tuv.y *= ratio;
  float frequency = 5.;
  float amplitude = 30.;
  float speed = t * 1.0;
  tuv.x += sin(tuv.y*frequency+speed)/amplitude;
  tuv.y += sin(tuv.x*frequency*1.5+speed)/(amplitude*.5);
  vec3 colorYellow = vec3(.957, .804, .623);
  vec3 colorDeepBlue = vec3(.192, .384, .933);
  vec3 layer1 = mix(colorYellow, colorDeepBlue, S(-.3, .2, (tuv*rot(radians(-5.))).x));
  vec3 colorRed = vec3(.910, .510, .8);
  vec3 colorBlue = vec3(0.350, .71, .953);
  vec3 layer2 = mix(colorRed, colorBlue, S(-.3, .2, (tuv*rot(radians(-5.))).x));
  vec3 finalComp = mix(layer1, layer2, S(.5, -.3, tuv.y));

  finalComp = applyHueShift(finalComp, hueShift);
  finalComp = applySaturation(finalComp, saturation);
  finalComp = applyLightness(finalComp, lightness);

  return vec4(finalComp, 1.0);
}
`;
    }
  });

  // shaders/b4.glsl.js
  var b4_glsl_exports = {};
  __export(b4_glsl_exports, {
    default: () => b4_glsl_default
  });
  var b4_glsl_default;
  var init_b4_glsl = __esm({
    "shaders/b4.glsl.js"() {
      b4_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  vec2 uv = (fragCoord/iResolution.xy)*1.;
  uv.y -= 1.5;
  uv.x += .2;
  float t = iTime * timeScale;  // Use timeScale uniform
  vec2 p = uv;
  float t1 = t * 1.5;  // Reduced from 3.0 to 1.5
  float t2 = t * 0.5;  // Reduced from 1.0 to 0.5
  p.y *= (p.x*p.y) * sin(p.y*p.x + t1);  // Reduced frequency from 2. to 1.
  float d = length(p*.7);
  vec3 c0 = vec3(1.);
  vec3 c1 = vec3(.365, .794, .935);
  vec3 c2 = vec3(.973, .671, .961);
  vec3 c3 = vec3(.973, .843, .439);
  float offset = 1.2;
  float step1 = .05*offset + sin(t2*2.)*.1;  // Reduced from 3. to 2.
  float step2 = 0.3*offset + sin(t2)*.15;
  float step3 = 0.6*offset + sin(t2)*.1;
  float step4 = 1.2*offset + sin(t2*2.)*.2;  // Reduced from 3. to 2.
  vec3 col = mix(c0, c1, smoothstep(step1, step2, d));
  col = mix(col, c2, smoothstep(step2, step3, d));
  col = mix(col, c3, smoothstep(step3, step4, d));

  // Apply color adjustments
  col = applyHueShift(col, hueShift);
  col = applySaturation(col, saturation);
  col = applyLightness(col, lightness);

  return vec4(col, .5);
}
`;
    }
  });

  // shaders/c1.glsl.js
  var c1_glsl_exports = {};
  __export(c1_glsl_exports, {
    default: () => c1_glsl_default
  });
  var c1_glsl_default;
  var init_c1_glsl = __esm({
    "shaders/c1.glsl.js"() {
      c1_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.5;
  vec2 p = getUV(fragCoord);

  vec3 c1 = vec3(0.92, 0.12, 0.2);
  vec3 c2 = vec3(0.12, 0.18, 0.92);

  float n1 = noise(p * 2.5 + t * 0.4);
  float n2 = noise(p * 1.8 + vec2(5.0, 3.0) - t * 0.35);

  vec2 flow = p + vec2(n1 - 0.5, n2 - 0.5) * 0.3;
  float blend = S(0.2, 0.8, flow.x + sin(flow.y * 2.5 + t * 0.6) * 0.25 + 0.5);

  vec3 col = mix(c1, c2, blend);
  col += dotNoise(fragCoord, 0.025);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/c2.glsl.js
  var c2_glsl_exports = {};
  __export(c2_glsl_exports, {
    default: () => c2_glsl_default
  });
  var c2_glsl_default;
  var init_c2_glsl = __esm({
    "shaders/c2.glsl.js"() {
      c2_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.6;
  vec2 p = getUV(fragCoord);

  vec3 c1 = vec3(0.95, 0.45, 0.12);
  vec3 c2 = vec3(0.18, 0.12, 0.88);

  float n1 = noise(p * 2.2 + t * 0.45);
  float n2 = noise(p * 1.6 - t * 0.38 + 4.0);

  float wave = sin(p.y * 3.5 + t * 0.9 + n1 * 2.2) * 0.35;
  float blend = S(0.15, 0.85, p.y + wave + n2 * 0.2 + 0.5);

  vec3 col = mix(c1, c2, blend);
  col += dotNoise(fragCoord, 0.02);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/c3.glsl.js
  var c3_glsl_exports = {};
  __export(c3_glsl_exports, {
    default: () => c3_glsl_default
  });
  var c3_glsl_default;
  var init_c3_glsl = __esm({
    "shaders/c3.glsl.js"() {
      c3_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.55;
  vec2 p = getUV(fragCoord);

  vec3 c1 = vec3(0.88, 0.15, 0.35);
  vec3 c2 = vec3(0.12, 0.78, 0.85);

  float n1 = noise(p * 2.8 + t * 0.5);
  float n2 = noise(p * 2.0 - t * 0.4 + 6.0);

  vec2 rp = p * rot(t * 0.12 + n1 * 0.4);
  float blend = S(0.2, 0.8, rp.x * 0.7 + rp.y * 0.5 + n2 * 0.25 + 0.5);

  vec3 col = mix(c1, c2, blend);
  col += dotNoise(fragCoord, 0.025);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/c4.glsl.js
  var c4_glsl_exports = {};
  __export(c4_glsl_exports, {
    default: () => c4_glsl_default
  });
  var c4_glsl_default;
  var init_c4_glsl = __esm({
    "shaders/c4.glsl.js"() {
      c4_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.6;
  vec2 p = getUV(fragCoord);

  vec3 c1 = vec3(0.12, 0.25, 0.92);
  vec3 c2 = vec3(0.92, 0.18, 0.45);

  float n1 = noise(p * 3.0 + t * 0.5);
  float n2 = noise(p * 2.2 - t * 0.4 + 7.0);

  float wave = sin((p.x + p.y) * 3.5 + t * 0.9 + n1 * 2.5);
  wave += cos((p.x - p.y) * 2.8 - t * 0.7 + n2 * 2.0);
  float blend = S(-0.6, 0.6, wave * 0.5 + n1 * 0.2);

  vec3 col = mix(c1, c2, blend);
  col += dotNoise(fragCoord, 0.025);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/c5.glsl.js
  var c5_glsl_exports = {};
  __export(c5_glsl_exports, {
    default: () => c5_glsl_default
  });
  var c5_glsl_default;
  var init_c5_glsl = __esm({
    "shaders/c5.glsl.js"() {
      c5_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.55;
  vec2 p = getUV(fragCoord);

  vec3 c1 = vec3(0.95, 0.18, 0.35);
  vec3 c2 = vec3(0.18, 0.15, 0.92);

  float n1 = noise(p * 2.5 + t * 0.5);
  float n2 = noise(p * 1.8 - t * 0.4 + 8.0);

  float diag = (p.x + p.y) * 0.8 + sin(t * 0.4 + n1 * 2.0) * 0.2;
  float blend = S(-0.2, 0.4, diag + n2 * 0.25);

  vec3 col = mix(c1, c2, blend);
  col += dotNoise(fragCoord, 0.025);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/f1.glsl.js
  var f1_glsl_exports = {};
  __export(f1_glsl_exports, {
    default: () => f1_glsl_default
  });
  var f1_glsl_default;
  var init_f1_glsl = __esm({
    "shaders/f1.glsl.js"() {
      f1_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float aspectRatio = iResolution.x / iResolution.y;
    float t = iTime * timeScale;

    // Create complex noise pattern with aspect ratio correction
    vec2 p1 = uv * 0.5;
    p1.x *= aspectRatio;
    vec2 p2 = uv * 0.75;
    p2.x *= aspectRatio;

    // Generate multiple noise layers with lower frequency
    float noise1 = noise(p1 + t * 0.05);
    float noise2 = noise(p2 - t * 0.08);
    float noise3 = noise(p1 * 0.25 + t * 0.1);

    // Combine noise layers with different weights
    float combinedNoise = (noise1 * 0.4 + noise2 * 0.3 + noise3 * 0.3);

    // Create color with noise influence
    vec3 color = vec3(
        noise1 * 0.6 + 0.4,
        noise2 * 0.6 + 0.4,
        combinedNoise * 0.6 + 0.4
    );

    // Add some movement-based variation
    vec2 movement = vec2(sin(t * 0.1), cos(t * 0.15)) * 0.2;
    movement.x *= aspectRatio;
    float movementNoise = noise(uv + movement);
    color = mix(color, color.zxy, movementNoise * 0.3);

    // Apply color adjustments
    color = applyHueShift(color, hueShift);
    color = applySaturation(color, saturation);
    color = applyLightness(color, lightness);

    return vec4(color, 1.0);
}
`;
    }
  });

  // shaders/f2.glsl.js
  var f2_glsl_exports = {};
  __export(f2_glsl_exports, {
    default: () => f2_glsl_default
  });
  var f2_glsl_default;
  var init_f2_glsl = __esm({
    "shaders/f2.glsl.js"() {
      f2_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  float aspectRatio = iResolution.x / iResolution.y;
  float t = iTime * timeScale;

  // Create multiple layers of fluid movement with aspect ratio correction
  vec2 p1 = uv * 1.0;
  p1.x *= aspectRatio;
  vec2 p2 = uv * 1.5;
  p2.x *= aspectRatio;

  // Generate noise at different scales with lower frequency
  float noise1 = noise(p1 + t * 0.05);
  float noise2 = noise(p2 - t * 0.08);
  float noise3 = noise(p1 * 0.5 + t * 0.1);

  // Combine noise layers
  float combinedNoise = (noise1 + noise2 + noise3) / 3.0;

  // Create color based on noise
  vec3 color = vec3(
    noise1 * 0.7 + 0.3,
    noise2 * 0.7 + 0.3,
    combinedNoise * 0.7 + 0.3
  );

  // Add some rotation-based variation
  vec2 rotatedUV = uv * rot(t * 0.05);
  rotatedUV.x *= aspectRatio;
  float rotationNoise = noise(rotatedUV * 0.5);
  color = mix(color, color.yzx, rotationNoise * 0.3);

  // Apply color adjustments
  color = applyHueShift(color, hueShift);
  color = applySaturation(color, saturation);
  color = applyLightness(color, lightness);

  return vec4(color, 1.0);
}
`;
    }
  });

  // shaders/f3.glsl.js
  var f3_glsl_exports = {};
  __export(f3_glsl_exports, {
    default: () => f3_glsl_default
  });
  var f3_glsl_default;
  var init_f3_glsl = __esm({
    "shaders/f3.glsl.js"() {
      f3_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  float aspectRatio = iResolution.x / iResolution.y;
  float t = iTime * timeScale;

  // Create abstract fluid movement with aspect ratio correction
  vec2 p = uv * 1.0;
  p.x *= aspectRatio;
  p = p * rot(t * 0.02);

  // Generate multiple noise layers with lower frequency
  float noise1 = noise(p + t * 0.05);
  float noise2 = noise(p * 0.5 - t * 0.08);
  float noise3 = noise(p * 0.25 + t * 0.1);

  // Create color channels with different noise combinations
  vec3 color = vec3(
    noise1 * noise2,
    noise2 * noise3,
    noise3 * noise1
  );

  // Add some movement-based variation
  vec2 movement = vec2(sin(t * 0.1), cos(t * 0.15)) * 0.2;
  movement.x *= aspectRatio;
  float movementNoise = noise(uv + movement);
  color = mix(color, color.zxy, movementNoise);

  // Apply color adjustments
  color = applyHueShift(color, hueShift);
  color = applySaturation(color, saturation);
  color = applyLightness(color, lightness);

  return vec4(color, 1.0);
}
`;
    }
  });

  // shaders/f4.glsl.js
  var f4_glsl_exports = {};
  __export(f4_glsl_exports, {
    default: () => f4_glsl_default
  });
  var f4_glsl_default;
  var init_f4_glsl = __esm({
    "shaders/f4.glsl.js"() {
      f4_glsl_default = /* glsl */
      `
vec3 irri(float hue) {
    return 0.5 + 0.5 * cos((9.0 * hue) + vec3(0.0, 23.0, 21.0));
}

vec2 line(vec2 p, vec2 a, vec2 b) {
    vec2 ba = b - a;
    vec2 pa = p - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return vec2(length(pa - h * ba), h);
}

vec4 shader(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float aspectRatio = iResolution.x / iResolution.y;
    float t = iTime * timeScale;

    // Create noise-based gradient with aspect ratio correction
    vec2 p = uv * 0.5;
    p.x *= aspectRatio;
    float noise1 = noise(p + t * 0.05);
    float noise2 = noise(p * 0.5 - t * 0.08);

    // Create gradient with noise influence
    vec3 color = vec3(
        noise1 * 0.8 + 0.2,
        noise2 * 0.8 + 0.2,
        (noise1 + noise2) * 0.4 + 0.3
    );

    // Add some rotation-based variation
    vec2 rotatedUV = uv * rot(t * 0.02);
    rotatedUV.x *= aspectRatio;
    float rotationNoise = noise(rotatedUV * 0.5);
    color = mix(color, color.yzx, rotationNoise * 0.2);

    // Apply color adjustments
    color = applyHueShift(color, hueShift);
    color = applySaturation(color, saturation);
    color = applyLightness(color, lightness);

    return vec4(color, 1.0);
}
`;
    }
  });

  // shaders/f5.glsl.js
  var f5_glsl_exports = {};
  __export(f5_glsl_exports, {
    default: () => f5_glsl_default
  });
  var f5_glsl_default;
  var init_f5_glsl = __esm({
    "shaders/f5.glsl.js"() {
      f5_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float aspectRatio = iResolution.x / iResolution.y;
    float t = iTime * timeScale;

    // Create complex noise pattern with aspect ratio correction
    vec2 p1 = uv * 0.5;
    p1.x *= aspectRatio;
    vec2 p2 = uv * 0.75;
    p2.x *= aspectRatio;

    // Generate multiple noise layers with lower frequency
    float noise1 = noise(p1 + t * 0.05);
    float noise2 = noise(p2 - t * 0.08);
    float noise3 = noise(p1 * 0.25 + t * 0.1);

    // Combine noise layers with different weights
    float combinedNoise = (noise1 * 0.4 + noise2 * 0.3 + noise3 * 0.3);

    // Create color with noise influence
    vec3 color = vec3(
        noise1 * 0.6 + 0.4,
        noise2 * 0.6 + 0.4,
        combinedNoise * 0.6 + 0.4
    );

    // Add some movement-based variation
    vec2 movement = vec2(sin(t * 0.1), cos(t * 0.15)) * 0.2;
    movement.x *= aspectRatio;
    float movementNoise = noise(uv + movement);
    color = mix(color, color.zxy, movementNoise * 0.3);

    // Apply color adjustments
    color = applyHueShift(color, hueShift);
    color = applySaturation(color, saturation);
    color = applyLightness(color, lightness);

    return vec4(color, 1.0);
}
`;
    }
  });

  // shaders/l1.glsl.js
  var l1_glsl_exports = {};
  __export(l1_glsl_exports, {
    default: () => l1_glsl_default
  });
  var l1_glsl_default;
  var init_l1_glsl = __esm({
    "shaders/l1.glsl.js"() {
      l1_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.6;
  vec2 p = getUV(fragCoord);

  vec3 c1 = vec3(0.92, 0.18, 0.15);
  vec3 c2 = vec3(0.18, 0.15, 0.92);

  float n1 = noise(p * 2.5 + t * 0.5);
  float n2 = noise(p * 1.8 - t * 0.4 + 3.0);

  vec2 sp = swirl(p, 1.2, t);
  sp = swirl(sp, 2.5, t * 0.75);

  float blend = S(0.2, 0.8, sp.x + sp.y + n1 * 0.25 + n2 * 0.15);

  vec3 col = mix(c1, c2, blend);
  col += dotNoise(fragCoord, 0.025);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/l2.glsl.js
  var l2_glsl_exports = {};
  __export(l2_glsl_exports, {
    default: () => l2_glsl_default
  });
  var l2_glsl_default;
  var init_l2_glsl = __esm({
    "shaders/l2.glsl.js"() {
      l2_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.65;
  vec2 p = getUV(fragCoord);

  vec3 c1 = vec3(0.2, 0.12, 0.92);
  vec3 c2 = vec3(0.92, 0.15, 0.35);

  float n1 = noise(p * 2.8 + t * 0.5);
  float n2 = noise(p * 2.0 - t * 0.4 + 5.0);

  float wave = sin(p.x * 3.5 + t * 0.9 + n1 * 2.2) * cos(p.y * 2.8 - t * 0.75 + n2 * 1.8);
  vec2 wp = p + vec2(wave) * 0.22;

  float blend = S(0.2, 0.8, wp.x + wp.y * 0.4 + n1 * 0.2 + 0.5);

  vec3 col = mix(c1, c2, blend);
  col += dotNoise(fragCoord, 0.02);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/l3.glsl.js
  var l3_glsl_exports = {};
  __export(l3_glsl_exports, {
    default: () => l3_glsl_default
  });
  var l3_glsl_default;
  var init_l3_glsl = __esm({
    "shaders/l3.glsl.js"() {
      l3_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.6;
  vec2 p = getUV(fragCoord);

  vec3 c1 = vec3(0.88, 0.22, 0.55);
  vec3 c2 = vec3(0.22, 0.55, 0.88);

  float n1 = noise(p * 2.8 + t * 0.45);
  float n2 = noise(p * 2.0 - t * 0.35 + 4.0);

  float a = sin(p.x * 2.5 + t * 0.8 + n1 * 2.0);
  float b = cos(p.y * 2.2 - t * 0.7 + n2 * 1.8);
  float c = sin((p.x + p.y) * 1.8 + t * 0.5);

  float blend = S(-0.5, 0.5, (a + b + c) * 0.33 + n1 * 0.2);

  vec3 col = mix(c1, c2, blend);
  col += dotNoise(fragCoord, 0.025);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/l4.glsl.js
  var l4_glsl_exports = {};
  __export(l4_glsl_exports, {
    default: () => l4_glsl_default
  });
  var l4_glsl_default;
  var init_l4_glsl = __esm({
    "shaders/l4.glsl.js"() {
      l4_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.6;
  vec2 p = getUV(fragCoord);

  vec3 c1 = vec3(0.92, 0.5, 0.12);
  vec3 c2 = vec3(0.12, 0.22, 0.92);

  float n1 = noise(p * 2.5 + t * 0.5);
  float n2 = noise(p * 1.8 - t * 0.4 + 4.0);

  vec2 mp = p * rot(t * 0.1 + n1 * 0.35);
  mp.x += sin(mp.y * 3.2 + t * 0.7 + n2 * 1.8) * 0.18;
  mp.y += cos(mp.x * 2.8 - t * 0.6) * 0.14;

  float blend = S(-0.25, 0.35, mp.x + mp.y * 0.4 + n1 * 0.2);

  vec3 col = mix(c1, c2, blend);
  col += dotNoise(fragCoord, 0.025);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/l5.glsl.js
  var l5_glsl_exports = {};
  __export(l5_glsl_exports, {
    default: () => l5_glsl_default
  });
  var l5_glsl_default;
  var init_l5_glsl = __esm({
    "shaders/l5.glsl.js"() {
      l5_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.65;
  vec2 p = getUV(fragCoord);

  vec3 c1 = vec3(0.28, 0.12, 0.92);
  vec3 c2 = vec3(0.92, 0.22, 0.18);

  float n1 = noise(p * 3.0 + t * 0.5);
  float n2 = noise(p * 2.2 - t * 0.4 + 6.0);

  vec2 mesh = p;
  mesh.x += sin(p.y * 4.2 + t * 0.9 + n1 * 2.2) * 0.14;
  mesh.y += cos(p.x * 3.8 - t * 0.8 + n2 * 2.0) * 0.12;

  float pattern = sin(mesh.x * 4.2 + t * 0.5) * cos(mesh.y * 3.8 - t * 0.4);
  float blend = S(-0.35, 0.35, pattern + n1 * 0.25);

  vec3 col = mix(c1, c2, blend);
  col += dotNoise(fragCoord, 0.025);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/m1.glsl.js
  var m1_glsl_exports = {};
  __export(m1_glsl_exports, {
    default: () => m1_glsl_default
  });
  var m1_glsl_default;
  var init_m1_glsl = __esm({
    "shaders/m1.glsl.js"() {
      m1_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.6;
  vec2 p = getUV(fragCoord);

  vec3 c1 = vec3(0.92, 0.55, 0.12);
  vec3 c2 = vec3(0.12, 0.18, 0.92);

  float n1 = noise(p * 2.5 + t * 0.5);
  float n2 = noise(p * 1.8 - t * 0.4 + 5.0);

  vec2 rp = p * rot(t * 0.12 + n1 * 0.4);
  rp.x += sin(rp.y * 3.2 + t * 0.7) * 0.15;
  rp.y += cos(rp.x * 2.8 - t * 0.6) * 0.12;

  float blend = S(-0.3, 0.4, rp.x + rp.y * 0.5 + n2 * 0.2);

  vec3 col = mix(c1, c2, blend);
  col += dotNoise(fragCoord, 0.025);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/m2.glsl.js
  var m2_glsl_exports = {};
  __export(m2_glsl_exports, {
    default: () => m2_glsl_default
  });
  var m2_glsl_default;
  var init_m2_glsl = __esm({
    "shaders/m2.glsl.js"() {
      m2_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.55;
  vec2 p = getUV(fragCoord);

  vec3 c1 = vec3(0.18, 0.12, 0.92);
  vec3 c2 = vec3(0.92, 0.18, 0.45);

  float n1 = noise(p * 2.8 + t * 0.5);
  float n2 = noise(p * 2.0 - t * 0.4 + 4.0);

  vec2 flow = p + vec2(n1 - 0.5, n2 - 0.5) * 0.35;
  float wave1 = sin(flow.x * 3.2 + t * 0.9 + n1 * 2.0);
  float wave2 = cos(flow.y * 2.8 - t * 0.75 + n2 * 1.8);

  float blend = S(-0.4, 0.4, (wave1 + wave2) * 0.4 + n1 * 0.25);

  vec3 col = mix(c1, c2, blend);
  col += dotNoise(fragCoord, 0.02);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/m3.glsl.js
  var m3_glsl_exports = {};
  __export(m3_glsl_exports, {
    default: () => m3_glsl_default
  });
  var m3_glsl_default;
  var init_m3_glsl = __esm({
    "shaders/m3.glsl.js"() {
      m3_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.7;
  vec2 p = getUV(fragCoord);

  vec3 c1 = vec3(0.92, 0.25, 0.5);
  vec3 c2 = vec3(0.18, 0.7, 0.88);

  float n1 = noise(p * 2.5 + t * 0.4);
  float n2 = noise(p * 1.8 - t * 0.3 + 5.0);

  vec2 flow = p + vec2(n1 - 0.5, n2 - 0.5) * 0.4;
  flow.x += sin(flow.y * 3.5 + t * 0.8) * 0.15;
  flow.y += cos(flow.x * 3.0 - t * 0.7) * 0.12;

  float blend = S(0.25, 0.75, flow.x + flow.y * 0.5 + n1 * 0.3);

  vec3 col = mix(c1, c2, blend);
  col += dotNoise(fragCoord, 0.02);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/m4.glsl.js
  var m4_glsl_exports = {};
  __export(m4_glsl_exports, {
    default: () => m4_glsl_default
  });
  var m4_glsl_default;
  var init_m4_glsl = __esm({
    "shaders/m4.glsl.js"() {
      m4_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.6;
  vec2 p = getUV(fragCoord);

  vec3 c1 = vec3(0.85, 0.45, 0.75);
  vec3 c2 = vec3(0.25, 0.15, 0.88);

  float n1 = noise(p * 2.5 + t * 0.5);
  float n2 = noise(p * 1.8 - t * 0.4 + 7.0);

  vec2 coord = p * rot(t * 0.1 + n1 * 0.3);
  coord.x += sin(coord.y * 2.8 + t * 0.7 + n2 * 1.8) * 0.14;
  coord.y += cos(coord.x * 2.2 + t * 0.6) * 0.12;

  float zone = coord.x * 0.8 + coord.y * 0.5 + n1 * 0.25;
  float blend = S(-0.25, 0.35, zone);

  vec3 col = mix(c1, c2, blend);
  col += dotNoise(fragCoord, 0.025);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/m5.glsl.js
  var m5_glsl_exports = {};
  __export(m5_glsl_exports, {
    default: () => m5_glsl_default
  });
  var m5_glsl_default;
  var init_m5_glsl = __esm({
    "shaders/m5.glsl.js"() {
      m5_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.65;
  vec2 p = getUV(fragCoord);

  vec3 c1 = vec3(0.22, 0.42, 0.92);
  vec3 c2 = vec3(0.92, 0.28, 0.32);

  float n1 = noise(p * 2.8 + t * 0.5);
  float n2 = noise(p * 2.0 - t * 0.4 + 5.0);

  float a = sin(p.x * 2.8 + t * 0.9 + n1 * 2.0) * cos(p.y * 2.2 - t * 0.75);
  float b = cos(p.x * 2.2 - t * 0.7 + n2 * 1.8) * sin(p.y * 2.8 + t * 0.85);

  float blend = S(-0.4, 0.4, (a + b) * 0.45 + n1 * 0.2);

  vec3 col = mix(c1, c2, blend);
  col += dotNoise(fragCoord, 0.025);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/s1.glsl.js
  var s1_glsl_exports = {};
  __export(s1_glsl_exports, {
    default: () => s1_glsl_default
  });
  var s1_glsl_default;
  var init_s1_glsl = __esm({
    "shaders/s1.glsl.js"() {
      s1_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.6;
  vec2 uv = fragCoord.xy / iResolution.xy;

  vec3 c1 = vec3(0.92, 0.18, 0.25);
  vec3 c2 = vec3(0.18, 0.85, 0.82);

  float n1 = noise(uv * 3.0 + t * 0.5);
  float n2 = noise(uv * 2.2 - t * 0.4 + 4.0);

  vec2 p1 = vec2(0.3 + sin(t * 0.5) * 0.18, 0.7 + cos(t * 0.4) * 0.12);
  vec2 p2 = vec2(0.7 + cos(t * 0.55) * 0.18, 0.3 + sin(t * 0.45) * 0.12);

  float d1 = 1.0 / max(length(uv - p1), 0.01);
  float d2 = 1.0 / max(length(uv - p2), 0.01);
  float blend = d1 / (d1 + d2) + n1 * 0.15 + n2 * 0.1;

  vec3 col = mix(c1, c2, S(0.3, 0.7, blend));
  col += dotNoise(fragCoord, 0.025);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/s2.glsl.js
  var s2_glsl_exports = {};
  __export(s2_glsl_exports, {
    default: () => s2_glsl_default
  });
  var s2_glsl_default;
  var init_s2_glsl = __esm({
    "shaders/s2.glsl.js"() {
      s2_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 1.2;
  vec2 uv = fragCoord.xy / iResolution.xy;

  vec3 c1 = vec3(0.95, 0.6, 0.15);
  vec3 c2 = vec3(0.12, 0.5, 0.92);

  float n = fbm(uv * 3.0, t, 3);
  float wave = sin(uv.x * 4.0 + t * 1.5 + n * 2.0) * 0.2;
  float blend = S(0.2, 0.8, uv.y + wave + n * 0.25);

  vec3 col = mix(c1, c2, blend);
  col += dotNoise(fragCoord, 0.02);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/s3.glsl.js
  var s3_glsl_exports = {};
  __export(s3_glsl_exports, {
    default: () => s3_glsl_default
  });
  var s3_glsl_default;
  var init_s3_glsl = __esm({
    "shaders/s3.glsl.js"() {
      s3_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.6;
  vec2 p = getUV(fragCoord);

  vec3 base = vec3(0.15, 0.4, 0.95);

  float n = fbm(p * 2.0, t, 3);
  float blob = sin(t * 0.4 + p.x * 2.5 + n * 1.8);
  blob += cos(t * 0.35 + p.y * 3.0 + n * 1.5);
  blob = blob * 0.25 + 0.5;

  float shade = S(0.2, 0.8, blob) * 0.6 + 0.4;
  vec3 col = base * shade;
  col += dotNoise(fragCoord, 0.03);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/s4.glsl.js
  var s4_glsl_exports = {};
  __export(s4_glsl_exports, {
    default: () => s4_glsl_default
  });
  var s4_glsl_default;
  var init_s4_glsl = __esm({
    "shaders/s4.glsl.js"() {
      s4_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.7;
  vec2 p = getUV(fragCoord);

  vec3 base = vec3(0.92, 0.2, 0.35);

  float n = fbm(p * 1.8, t, 3);
  vec2 wp = p + vec2(n) * 0.35;
  wp.x += sin(p.y * 3.0 + t * 0.7) * 0.18;

  float pattern = sin(wp.x * 3.5 + t * 0.5) * cos(wp.y * 2.8 - t * 0.4);
  float shade = S(-0.4, 0.4, pattern + n * 0.3) * 0.55 + 0.45;

  vec3 col = base * shade;
  col += dotNoise(fragCoord, 0.025);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/s5.glsl.js
  var s5_glsl_exports = {};
  __export(s5_glsl_exports, {
    default: () => s5_glsl_default
  });
  var s5_glsl_default;
  var init_s5_glsl = __esm({
    "shaders/s5.glsl.js"() {
      s5_glsl_default = /* glsl */
      `
vec4 shader(vec2 fragCoord) {
  float t = iTime * timeScale * 0.6;
  vec2 p = getUV(fragCoord);

  vec3 base = vec3(0.2, 0.85, 0.75);

  float n = fbm(p * 2.2, t, 3);
  vec2 mesh = p;
  mesh.x += sin(p.y * 4.5 + t * 0.9 + n * 2.2) * 0.14;
  mesh.y += cos(p.x * 3.8 - t * 0.8 + n * 2.0) * 0.12;

  float pattern = sin(mesh.x * 4.0 + t * 0.5) * cos(mesh.y * 3.5 - t * 0.45);
  float shade = S(-0.35, 0.35, pattern + n * 0.25) * 0.5 + 0.5;

  vec3 col = base * shade;
  col += dotNoise(fragCoord, 0.025);

  return vec4(finalColor(col), 1.0);
}
`;
    }
  });

  // shaders/common.glsl.js
  var common_glsl_default = (
    /* glsl */
    `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec3 iResolution;
uniform float iTime;
uniform float timeScale;
uniform float hueShift;
uniform float saturation;
uniform float lightness;

#define POINTS 32
#define PI 3.1415926536
#define TAU (2.0 * PI)
#define S(a,b,t) smoothstep(a,b,t)

mat2 rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

// HSV to RGB conversion
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// RGB to HSV conversion
vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// Apply hue shift to RGB color
vec3 applyHueShift(vec3 color, float shift) {
    vec3 hsv = rgb2hsv(color);
    hsv.x = fract(hsv.x + shift); // Rotate hue by shift amount (0-1 range)
    return hsv2rgb(hsv);
}

// Apply saturation adjustment to RGB color
vec3 applySaturation(vec3 color, float satFactor) {
    vec3 hsv = rgb2hsv(color);
    hsv.y = clamp(hsv.y * satFactor, 0.0, 1.0); // Adjust saturation
    return hsv2rgb(hsv);
}

// Add dithering function
float dither(vec2 uv) {
    return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

// Apply lightness adjustment to RGB color
vec3 applyLightness(vec3 color, float lightFactor) {
    // Convert to grayscale for more dramatic effect
    float gray = dot(color, vec3(0.299, 0.587, 0.114));

    // Shift the curve to make 0 match previous 1
    float shiftedFactor = (lightFactor * 14.0 + 1.0) / 15.0;
    float curve = shiftedFactor * shiftedFactor * 0.9;

    // Mix between original color and white/black based on lightness
    vec3 result;
    if (lightFactor > 0.5) {
        // Mix with white for lighter values, but cap at 0.95
        float mixAmount = min((curve - 0.5) * 2.0, 0.95);
        result = mix(color, vec3(1.0), mixAmount);
    } else {
        // Mix with black for darker values, but cap at 0.95
        float mixAmount = min(curve * 2.0, 0.95);
        result = mix(vec3(0.1), color, mixAmount);
    }

    // Add dithering to break up color bands
    float ditherAmount = (1.0 - lightFactor) * 0.02; // More dither in darker areas
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float noise = dither(uv) * ditherAmount;
    result += vec3(noise);

    return result;
}

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
    return fract(sin(p)*43758.5453);
}

float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    float n = mix(mix(dot(-1.0+2.0*hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
    dot(-1.0+2.0*hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(-1.0+2.0*hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
    dot(-1.0+2.0*hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
    return 0.5 + 0.5*n;
}
// Unified palette function
vec3 palette(float t, vec3 d) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(1.0, 0.9, 0.8);
    vec3 c = vec3(1.0, 1.0, 1.0);
    return a + b * cos(TAU * (c * t + d));
}

// Unified smooth noise function with configurable smoothness
float smoothNoise(vec2 p, float smoothness) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (smoothness - (smoothness - 1.0) * f);
    float a = dot(hash(i), f);
    float b = dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
    float c = dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
    float d = dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
    return 0.5 + 0.5 * mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Get normalized UV with aspect ratio
vec2 getUV(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float ar = iResolution.x / iResolution.y;
    return (uv - 0.5) * vec2(ar, 1.0);
}

// Apply gamma correction
vec3 applyGamma(vec3 col) {
    return pow(col, vec3(0.7)) * 1.2;
}

// Apply post-processing chain (hue, saturation, lightness)
vec3 applyPostProcessing(vec3 col) {
    col = applyHueShift(col, hueShift);
    col = applySaturation(col, saturation);
    col = applyLightness(col, lightness);
    return col;
}

// Unified channel swapping
vec3 channelSwap(vec3 col, float amount) {
    col = mix(col, col.yzx, amount);
    col = mix(col, col.zxy, amount * 0.67);
    return col;
}

// Unified FBM with configurable octaves
float fbm(vec2 p, float t, int octaves) {
    float f = 0.0;
    float amp = 0.5;
    mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < octaves; i++) {
        f += amp * noise(p + t * 0.2);
        p = m * p * 2.0;
        amp *= 0.5;
    }
    return f;
}

// Unified swirl function
vec2 swirl(vec2 uv, float seed, float t) {
    float n = fract(sin(seed * 127.1) * 43758.5453);
    vec2 center = vec2(cos(t * 0.4 + n * TAU), sin(t * 0.5 + n * PI)) * 0.35;
    vec2 d = uv - center;
    float dist = length(d);
    float strength = exp(-dist * 2.5) * (0.5 + 0.5 * cos(dist * 6.0));
    float angle = strength * sin(t * 0.5 + n * TAU) * 3.5;
    return center + d * rot(angle);
}

// Final output helper (gamma + clamp + post-processing)
vec3 finalColor(vec3 col) {
    col = applyGamma(col);
    col = clamp(col, 0.0, 1.0);
    return applyPostProcessing(col);
}

// Dot noise for subtle grain effect
float dotNoise(vec2 uv, float amount) {
    return (dither(uv) - 0.5) * amount;
}

#define aspectRatio (iResolution.x / iResolution.y)
`
  );

  // index.js
  var createCanvas = (selector2 = "body") => {
    const target = document.querySelector(selector2) ?? document.body ?? document.documentElement;
    return target.tagName === "CANVAS" ? target : target.appendChild(
      Object.assign(document.createElement("canvas"), {
        id: "gradient-gl",
        style: "position:fixed;inset:0;width:100vw;height:100vh;z-index:-1;pointer-events:none;"
      })
    );
  };
  var normalize = (v) => {
    const value = Number.parseInt(v, 16);
    return Math.round(value * (255 / 15));
  };
  var nonLinearMap = (val, minOut, maxOut, power = 2) => {
    const v = Math.max(0, Math.min(val, 15));
    return v === 0 ? minOut : minOut + ((v - 1) / 14) ** power * (maxOut - minOut);
  };
  var parseSeed = (s) => [
    s.split(".").shift(),
    new Uint8Array(s.split(".").pop().split("").map(normalize))
  ];
  var vertex = (
    /* glsl */
    `#version 300 es
      in vec2 position;
      void main() {
          gl_Position = vec4(position, 0.0, 1.0);
      }`
  );
  var GradientGL = class _GradientGL {
    #gl;
    #canvas;
    #program;
    #uniforms;
    #timeScale;
    #isActive;
    #externalUniforms;
    #currentSeed;
    #currentUniformValues;
    #fragment;
    #vertex;
    #lastTime;
    #elapsedTime;
    // Time interpolation constants
    static #MAX_DELTA = 50;
    // Maximum frame delta in ms (~20fps minimum)
    constructor(canvas, fragment, seed2) {
      this.#canvas = canvas;
      this.#fragment = fragment;
      this.#vertex = vertex;
      this.#timeScale = 0.4;
      this.#isActive = false;
      this.#currentSeed = seed2;
      this.#externalUniforms = seed2[1];
      this.#currentUniformValues = { speed: 0, hueShift: 0, saturation: 0, lightness: 0 };
      this.#lastTime = null;
      this.#elapsedTime = 0;
      this.#setupEventHandlers();
    }
    #setupEventHandlers() {
      this.#canvas.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        this.#isActive = false;
        this.#gl = null;
        this.#program = null;
        this.#uniforms = null;
        if (this.#canvas) this.#canvas.width = 0;
      });
      this.#canvas.addEventListener("webglcontextrestored", () => {
        this.init();
      });
    }
    init() {
      this.#gl = this.#createGLContext(this.#canvas);
      this.#program = this.#createProgram(this.#vertex, this.#fragment);
      this.#uniforms = this.#getUniformLocations();
      this.#isActive = true;
      this.#setupBuffers();
      this.#setupAttributes();
      this.#updateExternalUniforms(true);
      this.#render();
    }
    #createGLContext(canvas) {
      const gl = canvas.getContext("webgl2", {
        antialias: true
      });
      if (!gl) throw new Error("WebGL2 not supported");
      return gl;
    }
    #createShader(type, source) {
      const shader = this.#gl.createShader(type);
      this.#gl.shaderSource(shader, source);
      this.#gl.compileShader(shader);
      const log = this.#gl.getShaderInfoLog(shader);
      if (log)
        throw new Error(
          `${type === this.#gl.VERTEX_SHADER ? "Vertex" : "Fragment"} shader compilation error: ${log}`
        );
      return shader;
    }
    #createProgram(vertexSource, fragmentSource) {
      const program = this.#gl.createProgram();
      const vertexShader = this.#createShader(this.#gl.VERTEX_SHADER, vertexSource);
      const fragmentShader = this.#createShader(this.#gl.FRAGMENT_SHADER, fragmentSource);
      this.#gl.attachShader(program, vertexShader);
      this.#gl.attachShader(program, fragmentShader);
      this.#gl.linkProgram(program);
      const log = this.#gl.getProgramInfoLog(program);
      if (log) console.error("Program linking error:", log);
      this.#gl.detachShader(program, vertexShader);
      this.#gl.detachShader(program, fragmentShader);
      this.#gl.deleteShader(vertexShader);
      this.#gl.deleteShader(fragmentShader);
      this.#gl.useProgram(program);
      return program;
    }
    #setupBuffers() {
      const positionBuffer = this.#gl.createBuffer();
      this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, positionBuffer);
      this.#gl.bufferData(
        this.#gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        this.#gl.STATIC_DRAW
      );
    }
    #setupAttributes() {
      const positionLocation = this.#gl.getAttribLocation(this.#program, "position");
      this.#gl.enableVertexAttribArray(positionLocation);
      this.#gl.vertexAttribPointer(positionLocation, 2, this.#gl.FLOAT, false, 0, 0);
    }
    #getUniformLocations() {
      return [
        "iResolution",
        "iTime",
        "iFrame",
        "options",
        "timeScale",
        "hueShift",
        "saturation",
        "lightness"
      ].reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: this.#gl.getUniformLocation(this.#program, cur)
        }),
        {}
      );
    }
    #updateExternalUniforms(forceUpdate = false) {
      if (!this.#externalUniforms) return;
      this.#gl.useProgram(this.#program);
      this.#gl.uniform1iv(this.#uniforms.options, this.#externalUniforms);
      const [speedVal, hueVal, satVal, lightVal] = this.#externalUniforms.map(
        (v) => Math.round(v * 15 / 255)
      );
      const [speed, hueShift, satFactor, lightFactor] = [
        nonLinearMap(speedVal, 0.1, 3, 1.5),
        hueVal / 15,
        nonLinearMap(satVal, 0.3, 3, 1.5),
        lightVal / 15
        // Simple linear mapping from 0 to 1
      ];
      const valuesChanged = forceUpdate || speed !== this.#currentUniformValues.speed || hueShift !== this.#currentUniformValues.hueShift || satFactor !== this.#currentUniformValues.saturation || lightFactor !== this.#currentUniformValues.lightness;
      if (valuesChanged) {
        this.#gl.uniform1f(this.#uniforms.timeScale, speed);
        this.#gl.uniform1f(this.#uniforms.hueShift, hueShift);
        this.#gl.uniform1f(this.#uniforms.saturation, satFactor);
        this.#gl.uniform1f(this.#uniforms.lightness, lightFactor);
        this.#currentUniformValues = {
          speed,
          hueShift,
          saturation: satFactor,
          lightness: lightFactor
        };
      }
    }
    updateSeed(seed2) {
      if (seed2[0] === this.#currentSeed[0] && seed2[1].every((v, i) => v === this.#currentSeed[1][i]))
        return false;
      this.#currentSeed = seed2;
      this.#externalUniforms = seed2[1];
      this.#updateExternalUniforms(true);
      return true;
    }
    #updateInternalUniforms(time) {
      if (!this.#isActive || !this.#canvas || !this.#gl) return;
      const { iResolution, iTime, iFrame } = this.#uniforms;
      this.#gl.useProgram(this.#program);
      const displayWidth = this.#canvas.clientWidth;
      const displayHeight = this.#canvas.clientHeight;
      if (this.#canvas.width !== displayWidth || this.#canvas.height !== displayHeight) {
        this.#canvas.width = displayWidth;
        this.#canvas.height = displayHeight;
        this.#gl.uniform3f(iResolution, this.#canvas.width, this.#canvas.height, 1);
        this.#gl.viewport(0, 0, this.#canvas.width, this.#canvas.height);
      }
      const continuousTime = time / 1e3;
      this.#gl.uniform1f(iTime, continuousTime);
      this.#gl.uniform1f(iFrame, Math.floor(continuousTime * 60));
    }
    #updateTime(currentTime) {
      if (this.#lastTime !== null) {
        const delta = Math.min(currentTime - this.#lastTime, _GradientGL.#MAX_DELTA);
        this.#elapsedTime += delta;
      }
      this.#lastTime = currentTime;
    }
    #render() {
      const frame = () => {
        if (!this.#isActive || !this.#canvas || !this.#gl) {
          return;
        }
        const currentTime = performance.now();
        this.#updateTime(currentTime);
        this.#updateInternalUniforms(this.#elapsedTime);
        this.#gl.drawArrays(this.#gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }
    destroy() {
      this.#isActive = false;
      if (this.#program && this.#gl) {
        this.#gl.deleteProgram(this.#program);
      }
      if (this.#canvas) {
        try {
          this.#canvas.remove();
        } catch (e) {
        }
      }
      this.#program = null;
      this.#canvas = null;
      this.#gl = null;
    }
  };
  var fetchCommon = () => Promise.resolve(common_glsl_default);
  var shaderLoaders = {
    b1: () => Promise.resolve().then(() => (init_b1_glsl(), b1_glsl_exports)),
    b2: () => Promise.resolve().then(() => (init_b2_glsl(), b2_glsl_exports)),
    b3: () => Promise.resolve().then(() => (init_b3_glsl(), b3_glsl_exports)),
    b4: () => Promise.resolve().then(() => (init_b4_glsl(), b4_glsl_exports)),
    c1: () => Promise.resolve().then(() => (init_c1_glsl(), c1_glsl_exports)),
    c2: () => Promise.resolve().then(() => (init_c2_glsl(), c2_glsl_exports)),
    c3: () => Promise.resolve().then(() => (init_c3_glsl(), c3_glsl_exports)),
    c4: () => Promise.resolve().then(() => (init_c4_glsl(), c4_glsl_exports)),
    c5: () => Promise.resolve().then(() => (init_c5_glsl(), c5_glsl_exports)),
    f1: () => Promise.resolve().then(() => (init_f1_glsl(), f1_glsl_exports)),
    f2: () => Promise.resolve().then(() => (init_f2_glsl(), f2_glsl_exports)),
    f3: () => Promise.resolve().then(() => (init_f3_glsl(), f3_glsl_exports)),
    f4: () => Promise.resolve().then(() => (init_f4_glsl(), f4_glsl_exports)),
    f5: () => Promise.resolve().then(() => (init_f5_glsl(), f5_glsl_exports)),
    l1: () => Promise.resolve().then(() => (init_l1_glsl(), l1_glsl_exports)),
    l2: () => Promise.resolve().then(() => (init_l2_glsl(), l2_glsl_exports)),
    l3: () => Promise.resolve().then(() => (init_l3_glsl(), l3_glsl_exports)),
    l4: () => Promise.resolve().then(() => (init_l4_glsl(), l4_glsl_exports)),
    l5: () => Promise.resolve().then(() => (init_l5_glsl(), l5_glsl_exports)),
    m1: () => Promise.resolve().then(() => (init_m1_glsl(), m1_glsl_exports)),
    m2: () => Promise.resolve().then(() => (init_m2_glsl(), m2_glsl_exports)),
    m3: () => Promise.resolve().then(() => (init_m3_glsl(), m3_glsl_exports)),
    m4: () => Promise.resolve().then(() => (init_m4_glsl(), m4_glsl_exports)),
    m5: () => Promise.resolve().then(() => (init_m5_glsl(), m5_glsl_exports)),
    s1: () => Promise.resolve().then(() => (init_s1_glsl(), s1_glsl_exports)),
    s2: () => Promise.resolve().then(() => (init_s2_glsl(), s2_glsl_exports)),
    s3: () => Promise.resolve().then(() => (init_s3_glsl(), s3_glsl_exports)),
    s4: () => Promise.resolve().then(() => (init_s4_glsl(), s4_glsl_exports)),
    s5: () => Promise.resolve().then(() => (init_s5_glsl(), s5_glsl_exports))
  };
  var shaderIds = Object.keys(shaderLoaders).sort();
  var fetchShader = async (id) => {
    const loader = shaderLoaders[id];
    if (!loader) throw new Error("Unknown shader");
    const mod = await loader();
    return mod.default;
  };
  var main = (
    /* glsl */
    `
  void main() {
    fragColor = shader(gl_FragCoord.xy);
  }
  `
  );
  var activeProgram = null;
  async function boot(seed2, selector2 = "body") {
    if (!seed2) throw new Error("Seed is required");
    const parsedSeed = parseSeed(seed2);
    const [shaderId] = parsedSeed;
    if (activeProgram?.shaderId === shaderId) {
      activeProgram.updateSeed(parsedSeed);
      return activeProgram;
    }
    if (activeProgram) {
      activeProgram.destroy();
      activeProgram = null;
    }
    const [common, shader] = await Promise.all([fetchCommon(), fetchShader(shaderId)]);
    const fragment = common + shader + main;
    const canvas = createCanvas(selector2);
    const program = new GradientGL(canvas, fragment, parsedSeed);
    program.shaderId = shaderId;
    program.init();
    activeProgram = program;
    return program;
  }
  var url = new URL("x:");
  var seed = url.searchParams.get("seed");
  var selector = url.searchParams.get("selector") || "body";
  if (seed) boot(seed, selector);
  window.gradient = boot;
})();
