// Universal WebGL Nebula Background (blue-white-pink clouds, lighter & vivid)
(function() {
  const canvas = document.getElementById('nebula-canvas');
  if (!canvas) return;

  // Check for WebGL support and reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    canvas.style.display = 'none'; // Gracefully degrade to CSS gradient
    return;
  }

  // Resize canvas
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  // Vertex Shader (simple full-screen quad - unchanged)
  const vsSource = `
    attribute vec2 position;
    varying vec2 uv;
    void main() {
      uv = (position + 1.0) / 2.0;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  // Fragment Shader (lighter nebula: airy blues/whites/pinks, reduced darkness)
  const fsSource = `
    precision mediump float;
    uniform float time;
    uniform float scrollY;
    uniform vec2 resolution;
    varying vec2 uv;

    // Simple noise function (approximates Perlin - unchanged)
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p) { // Fractional Brownian Motion for organic texture
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 3; ++i) {  // Reduced iterations for perf
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 pos = uv * resolution / min(resolution.x, resolution.y); // Aspect-correct

      // Multi-layered organic movement - creates abstract shifting shapes (unchanged)
      float scrollOffset = scrollY * 0.0003;
      vec2 drift1 = vec2(time * 0.015, sin(time * 0.008) * 0.3 + scrollOffset);
      vec2 drift2 = vec2(cos(time * 0.012) * 0.2, time * 0.01 + scrollOffset * 0.5);
      vec2 drift3 = vec2(sin(time * 0.018) * 0.25, cos(time * 0.014) * 0.2);

      // Multiple FBM layers at different scales for organic cloud shapes (lighter blend)
      float n1 = fbm(pos * 1.2 + drift1);
      float n2 = fbm(pos * 2.3 + drift2) * 0.6;
      float n3 = fbm(pos * 4.1 + drift3) * 0.3;
      float n = (n1 + n2 + n3) / 1.9; // Combine layers for organic texture

      // Add subtle radial variations for cloud-like formations (unchanged)
      float dist = length(pos - vec2(0.5, 0.5));
      float radial = sin(dist * 3.0 + time * 0.02) * 0.1;
      n += radial;

      // Lighter blue-white-pink scheme (vivid clouds, less dark base)
      vec3 color1 = vec3(0.15, 0.18, 0.25); // Soft navy base (up from 0.03-0.08)
      vec3 color2 = vec3(0.4, 0.6, 1.0) * 0.8; // Airy blue (brighter)
      vec3 color3 = vec3(0.8, 0.9, 1.0) * 0.7; // White cloud highlights
      vec3 color4 = vec3(0.2, 0.5, 1.0) * 0.75; // Pinkish-blue accents
      vec3 color = mix(color1, mix(mix(color2, color3, n * 0.6), color4, n * 0.4), smoothstep(0.2, 0.8, n));  // More white/pink mix

      // Enhanced ambient glow (brighter, less dark)
      float ambient = sin(n * 6.28 + time * 0.05) * 0.15 + 0.1;  // Up from 0.05
      color += vec3(0.2, 0.25, 0.35) * ambient;  // Lighter glow (0.08->0.2)

      // Softer edge fade (less vignette masking)
      float edgeFade = smoothstep(0.0, 0.05, uv.x) * smoothstep(1.0, 0.95, uv.x) *  // Gentler edges
                       smoothstep(0.0, 0.05, uv.y) * smoothstep(1.0, 0.95, uv.y);
      color *= edgeFade;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // Compile shader (unchanged)
  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  // Program setup (unchanged)
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vertexShader || !fragmentShader) {
    canvas.style.display = 'none';
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    canvas.style.display = 'none';
    return;
  }
  gl.useProgram(program);

  // Quad vertices (unchanged)
  const positionLocation = gl.getAttribLocation(program, 'position');
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Uniforms (unchanged)
  const timeLocation = gl.getUniformLocation(program, 'time');
  const scrollYLocation = gl.getUniformLocation(program, 'scrollY');
  const resolutionLocation = gl.getUniformLocation(program, 'resolution');

  // Scroll tracking for parallax effect (unchanged)
  let scrollY = 0;
  function updateScroll() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // Animation loop (unchanged)
  let startTime = Date.now();
  let animationId = null;
  function render() {
    const elapsed = (Date.now() - startTime) / 1000;
    gl.uniform1f(timeLocation, elapsed);
    gl.uniform1f(scrollYLocation, scrollY);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    animationId = requestAnimationFrame(render);
  }
  render();

  // Cleanup on page unload (unchanged)
  window.addEventListener('beforeunload', () => {
    if (animationId) cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('scroll', updateScroll);
  });
})();
