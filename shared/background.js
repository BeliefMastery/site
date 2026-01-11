// Universal WebGL Nebula Background (blue-white theme, scroll-enhanced)
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
  
  // Vertex Shader (simple full-screen quad)
  const vsSource = `
    attribute vec2 position;
    varying vec2 uv;
    void main() {
      uv = (position + 1.0) / 2.0;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;
  
  // Fragment Shader (nebula with blue-white colors, scroll-enhanced movement)
  const fsSource = `
    precision mediump float;
    uniform float time;
    uniform float scrollY;
    uniform vec2 resolution;
    varying vec2 uv;
    
    // Simple noise function (approximates Perlin)
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
      for (int i = 0; i < 4; ++i) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }
    
    void main() {
      vec2 pos = uv * resolution / min(resolution.x, resolution.y); // Aspect-correct
      // Enhanced scroll-based parallax movement (scroll affects vertical position)
      float scrollOffset = scrollY * 0.0003; // Parallax effect - adjust multiplier for speed
      pos += vec2(time * 0.02, sin(time * 0.01) * 0.5 + scrollOffset); // Horizontal drift + scroll parallax
      float n = fbm(pos * 1.5 + time * 0.005 + scrollY * 0.0001); // Scroll also affects noise offset
      
      // Blue-white color scheme (matching image frames)
      vec3 color1 = vec3(0.08, 0.10, 0.14); // Deep blue space base
      vec3 color2 = vec3(0.78, 0.88, 1.0) * 0.5; // Light blue-white (rgba(200, 225, 255) normalized)
      vec3 color3 = vec3(0.12, 0.56, 1.0) * 0.4; // Bright blue (rgba(30, 144, 255) normalized)
      vec3 color4 = vec3(0.0, 0.75, 1.0) * 0.35; // Cyan-blue (rgba(0, 191, 255) normalized)
      vec3 color = mix(color1, mix(mix(color2, color3, n * 0.5), color4, n * 0.3), smoothstep(0.3, 0.7, n));
      
      // Blue-tinted horizontal streaks for depth
      color += vec3(0.03, 0.05, 0.07) * sin(pos.y * 10.0 + time * 0.1 + scrollY * 0.0002);
      
      // Soft fade at edges for seamless blending
      float edgeFade = smoothstep(0.0, 0.1, uv.x) * smoothstep(1.0, 0.9, uv.x) *
                       smoothstep(0.0, 0.1, uv.y) * smoothstep(1.0, 0.9, uv.y);
      color *= edgeFade;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;
  
  // Compile shader
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
  
  // Program setup
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
  
  // Quad vertices
  const positionLocation = gl.getAttribLocation(program, 'position');
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  
  // Uniforms
  const timeLocation = gl.getUniformLocation(program, 'time');
  const scrollYLocation = gl.getUniformLocation(program, 'scrollY');
  const resolutionLocation = gl.getUniformLocation(program, 'resolution');
  
  // Scroll tracking for parallax effect
  let scrollY = 0;
  function updateScroll() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
  
  // Animation loop
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
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (animationId) cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('scroll', updateScroll);
  });
})();
