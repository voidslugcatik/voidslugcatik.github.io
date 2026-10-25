/* bgShaderWebGL.js — GPU-фон (WebGL). Настройки — в TUNING.
   index.html: <script src="bgShaderWebGL.js"></script> ПЕРЕД script.js
   script.js:  const bg = initBgShaderWebGL('bgShader', PALETTES[current]); */
(function (global) {
  'use strict';

  // ======================= TUNING =======================
  // layers:
  //   drift   — амплитуда смещения (пикс. шума), не скорость
  //   spin    — амплитуда угла (рад): 0.3≈17°, 1.5≈86°
  //   tSpeed  — скорость «кипения» узора (0 = замер)
  //   wobble  — доп. покачивание
  //   zoom/zoomSpeed — пульсация масштаба
  //   stretch — сжатие по Y + растяжение по X
  //   noise   — переопределение шума для слоя (null = общий из TUNING.noise)
  // noise:
  //   freqScale — 2 = пятна вдвое мельче, 0.5 = вдвое крупнее
  //   timeScale — 0 = текстура застыла, 2 = вдвое быстрее
  //   seed      — целое; одинаковый seed = одинаковая картинка всегда
  var TUNING = {
    speed: 0.45,
    layers: [
      { drift: [ 22,  11], tSpeed: 0.8, wobble: 12, spin:  0.55, zoom: 0.12, zoomSpeed: 0.08, stretch: 0.10, noise: null },
      { drift: [-19,  22], tSpeed: 0.5, wobble: 16, spin: -0.85, zoom: 0.18, zoomSpeed: 0.05, stretch: 0.16, noise: null },
      { drift: [ 15, -19], tSpeed: 1.5, wobble: 28, spin:  1.20, zoom: 0.10, zoomSpeed: 0.14, stretch: 0.22, noise: null },
      { drift: [-11, -11], tSpeed: 0.4, wobble: 12, spin: -0.35, zoom: 0.22, zoomSpeed: 0.03, stretch: 0.08, noise: null }
    ],
    noise: { freqScale: 1, timeScale: 1, seed: null },
    scale: 0.5,
    maxPixels: 1500000,
    blur: 1,
    artStyle: true,
    posterize: 5,
    outline: 0.55,
    fps: 60
  };
  // ======================================================

  var DEFAULT_COLORS = [
    [0,200,100],[50,220,210],[30,150,140],[60,100,220],[120,60,180],[10,40,20],
    [20,30,80],[40,10,60],[150,240,240],[0,0,0],[0,150,50],[80,40,120],[80,120,250]
  ];
  var NOISE_REF_SCALE = 0.15;

  var VS = 'attribute vec2 a_pos;varying vec2 v_uv;' +
    'void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.0,1.0);}';

  function buildSceneFS(deriv) {
    var s = '';
    if (deriv) s += '#extension GL_OES_standard_derivatives : enable\n';
    s += '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n';
    s += 'varying vec2 v_uv;\n';
    s += 'uniform float u_time,u_pulse,u_art,u_post,u_outline;\n';
    s += 'uniform vec2 u_view;\nuniform sampler2D u_pal;\n';
    for (var i = 1; i <= 4; i++) {
      s += 'uniform vec2 u_sh' + i + ',u_dr' + i + ';\n';
      s += 'uniform vec4 u_f' + i + ',u_s' + i + ',u_w' + i + ';\n';
      s += 'uniform float u_ts' + i + ',u_wb' + i + ',u_rt' + i + ',u_zm' + i + ',u_zs' + i + ',u_st' + i + ';\n';
    }
    s += [
      'float core(vec2 p,float t,vec4 f,vec4 s,vec4 w){',
      ' float a=sin(p.x*f.x+p.y*f.x*0.6+t*s.x)*cos(p.y*f.x*0.7-p.x*f.x*0.4+t*s.x*0.8);',
      ' float b=sin(p.x*f.y+p.y*f.y*1.1+t*s.y)*cos(p.y*f.y*0.5-p.x*f.y*0.8+t*s.y*0.7);',
      ' float c=sin(p.x*f.z+p.y*f.z*0.9+t*s.z)*cos(p.y*f.z*1.2-p.x*f.z*0.3+t*s.z*0.9);',
      ' float d=sin(p.x*f.w+p.y*f.w*0.4+t*s.w)*cos(p.y*f.w*1.3-p.x*f.w*0.6+t*s.w*0.6);',
      ' return clamp((a*w.x+b*w.y+c*w.z+d*w.w+1.0)*0.5,0.0,1.0);',
      '}',
      // Гладкая непериодическая функция: три синуса с несоизмеримыми частотами.
      // Без floor/хешей -> нет дёрганья. Возвращает примерно -1..1.
      'float drift1(float t,float freq,float ph){',
      ' float a=sin(t*freq+ph);',
      ' float b=sin(t*freq*1.618034+ph*2.31);',
      ' float c=sin(t*freq*2.414214+ph*3.77);',
      ' return a*0.58+b*0.30+c*0.12;',
      '}',
      'vec2 xf(vec2 p,vec2 c,float t,vec2 dr,float wb,float ph,',
      '        float rt,float zm,float zs,float st){',
      ' vec2 q=p-c;',
      ' q+=dr*drift1(t,0.085,ph)',
      '   +wb*vec2(drift1(t,0.062,ph+1.7),drift1(t,0.049,ph+3.1));',
      ' float a=rt*drift1(t,0.041,ph*1.3);',
      ' float ca=cos(a),sa=sin(a);',
      ' q=mat2(ca,sa,-sa,ca)*q;',
      ' float ax=1.0+st*drift1(t,0.033,ph*1.9);',
      ' q.x*=ax; q.y/=ax;',
      ' q/=max(0.5,1.0+zm*drift1(t,zs*0.45,ph+4.4));',
      ' return q+c;',
      '}',
      'vec3 pal(float v){return texture2D(u_pal,vec2((v*12.0+0.5)/13.0,0.5)).rgb;}',
      'void main(){',
      ' vec2 px=v_uv*u_view; vec2 c0=u_view*0.5; float t=u_time;',
      ' vec2 p1=xf(px,c0,t,u_dr1,u_wb1,0.0,u_rt1,u_zm1,u_zs1,u_st1)+u_sh1;',
      ' float bn=core(p1,t*u_ts1,u_f1,u_s1,u_w1);',
      ' float bs=bn*bn*(3.0-2.0*bn); float baseVal=bn*0.4+bs*0.6;',
      ' vec2 p2=xf(px*1.4,c0*1.4,t,u_dr2,u_wb2,1.3,u_rt2,u_zm2,u_zs2,u_st2)+u_sh2+vec2(100.0,50.0);',
      ' float mn=core(p2,t*0.7*u_ts2,u_f2,u_s2,u_w2);',
      ' float mult=0.05+1.8*pow(mn,1.5);',
      ' vec2 p3=xf(px,c0,t,u_dr3,u_wb3,2.1,u_rt3,u_zm3,u_zs3,u_st3)+u_sh3;',
      ' float df=core(p3*8.0,t*2.5*u_ts3,u_f3,u_s3,u_w3);',
      ' float dc=core(p3*3.0,t*1.2*u_ts3,u_f3,u_s3,u_w3);',
      ' float dfv=df*df*(3.0-2.0*df), dcv=dc*dc*(3.0-2.0*dc);',
      ' float dust=max(dfv,dcv*0.7);',
      ' if(dust>0.40){float it=(dust-0.60)/0.2; it=it*it*1.2; mult+=0.8*it;}',
      ' vec2 p4=xf(px*0.3,c0*0.3,t,u_dr4,u_wb4,3.7,u_rt4,u_zm4,u_zs4,u_st4)+u_sh4;',
      ' float vnz=core(p4,t*0.4*u_ts4,u_f4,u_s4,u_w4);',
      ' float vv=(sin(px.x*0.022+px.y*0.008+vnz*2.0+t*0.1*u_ts4)+1.0)*0.5;',
      ' float veinM=0.75+0.20*vv;',
      ' vec3 rgb=pal(baseVal)*(u_pulse*mult*veinM*0.85);'
    ].join('\n');
    s += ' if(u_art>0.5){\n';
    s += '  float lv=max(u_post,2.0); rgb=floor(rgb*lv+0.5)/lv;\n';
    if (deriv) {
      s += '  float lu=dot(rgb,vec3(0.299,0.587,0.114));\n';
      s += '  float e=length(vec2(dFdx(lu),dFdy(lu)));\n';
      s += '  rgb=mix(rgb,vec3(0.0),clamp(smoothstep(0.015,0.09,e)*u_outline,0.0,1.0));\n';
    }
    s += ' }\n gl_FragColor=vec4(rgb,1.0);\n}\n';
    return s;
  }

  var FS_BLUR = [
    'precision mediump float;varying vec2 v_uv;',
    'uniform sampler2D u_tex;uniform vec2 u_texel,u_dir;uniform float u_radius;',
    'void main(){ vec2 d=u_texel*u_dir*u_radius; vec3 s=vec3(0.0);',
    ' s+=texture2D(u_tex,v_uv-d*4.0).rgb*0.0162;',
    ' s+=texture2D(u_tex,v_uv-d*3.0).rgb*0.0540;',
    ' s+=texture2D(u_tex,v_uv-d*2.0).rgb*0.1216;',
    ' s+=texture2D(u_tex,v_uv-d*1.0).rgb*0.1946;',
    ' s+=texture2D(u_tex,v_uv).rgb*0.2270;',
    ' s+=texture2D(u_tex,v_uv+d*1.0).rgb*0.1946;',
    ' s+=texture2D(u_tex,v_uv+d*2.0).rgb*0.1216;',
    ' s+=texture2D(u_tex,v_uv+d*3.0).rgb*0.0540;',
    ' s+=texture2D(u_tex,v_uv+d*4.0).rgb*0.0162;',
    ' gl_FragColor=vec4(s,1.0); }'
  ].join('\n');

  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src); gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(sh); gl.deleteShader(sh);
      throw new Error('compile: ' + log);
    }
    return sh;
  }

  function program(gl, vs, fs) {
    var v = compile(gl, gl.VERTEX_SHADER, vs);
    var f = compile(gl, gl.FRAGMENT_SHADER, fs);
    var p = gl.createProgram();
    gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
    gl.deleteShader(v); gl.deleteShader(f);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      var log = gl.getProgramInfoLog(p); gl.deleteProgram(p);
      throw new Error('link: ' + log);
    }
    return p;
  }

  function cacheUniforms(gl, prog) {
    var u = {}, n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) {
      var inf = gl.getActiveUniform(prog, i);
      if (inf) u[inf.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(prog, inf.name);
    }
    return u;
  }

  // ---- seeded PRNG (mulberry32) ----
  function makeRng(seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function genParams(rng, cfg) {
    cfg = cfg || {};
    var fs = cfg.freqScale || 1;
    var ts = cfg.timeScale || 1;
    var R = function (a, b) { return a + rng() * (b - a); };
    var f = cfg.f || [R(0.003,0.014), R(0.006,0.022), R(0.010,0.032), R(0.018,0.050)];
    var s = cfg.s || [R(0.01,0.05), R(0.02,0.07), R(0.03,0.09), R(0.04,0.12)];
    var w = cfg.w || [R(0.2,0.6), R(0.1,0.4), R(0.1,0.3), R(0.05,0.2)];
    var sh = cfg.shift || [R(-60,60), R(-60,60)];
    return {
      f: [f[0]*fs, f[1]*fs, f[2]*fs, f[3]*fs],
      s: [s[0]*ts, s[1]*ts, s[2]*ts, s[3]*ts],
      w: [w[0], w[1], w[2], w[3]],
      shift: [sh[0], sh[1]]
    };
  }

  function mergeNoise(g, l) {
    g = g || {}; l = l || {};
    return {
      freqScale: l.freqScale !== undefined ? l.freqScale : (g.freqScale || 1),
      timeScale: l.timeScale !== undefined ? l.timeScale : (g.timeScale || 1),
      f: l.f || null, s: l.s || null, w: l.w || null, shift: l.shift || null
    };
  }

  function makePalette(gl, colors) {
    var N = 13, data = new Uint8Array(N * 4);
    for (var i = 0; i < N; i++) {
      var c = (colors && colors[i]) || [0,0,0];
      data[i*4] = c[0] & 255; data[i*4+1] = c[1] & 255;
      data[i*4+2] = c[2] & 255; data[i*4+3] = 255;
    }
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, N, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  function makeTarget(gl, w, h) {
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var f = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    var ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { tex: t, fbo: f, ok: ok };
  }

  function cloneLayers(src) {
    return src.map(function (L) {
      var o = {
        drift: [(L.drift && L.drift[0]) || 0, (L.drift && L.drift[1]) || 0],
        tSpeed: L.tSpeed === undefined ? 1 : L.tSpeed,
        wobble: L.wobble || 0,
        spin: L.spin || 0,
        zoom: L.zoom || 0,
        zoomSpeed: L.zoomSpeed || 0.1,
        stretch: L.stretch || 0,
        noise: null
      };
      if (L.noise) {
        o.noise = {
          f: L.noise.f ? L.noise.f.slice() : null,
          s: L.noise.s ? L.noise.s.slice() : null,
          w: L.noise.w ? L.noise.w.slice() : null,
          shift: L.noise.shift ? L.noise.shift.slice() : null,
          freqScale: L.noise.freqScale,
          timeScale: L.noise.timeScale
        };
      }
      return o;
    });
  }

  function Bg(canvas, colors, opts) {
    this.canvas = canvas;
    this.colors = (colors && colors.length ? colors : DEFAULT_COLORS).slice();
    this.options = {};
    for (var k in TUNING) if (TUNING.hasOwnProperty(k)) this.options[k] = TUNING[k];
    this.options.layers = cloneLayers(TUNING.layers);
    this.options.noise = { freqScale: 1, timeScale: 1, seed: null };
    for (var n0 in TUNING.noise) this.options.noise[n0] = TUNING.noise[n0];

    if (opts) {
      for (var o in opts) {
        if (!opts.hasOwnProperty(o) || opts[o] === undefined) continue;
        if (o === 'layers') { this.options.layers = cloneLayers(opts.layers); }
        else if (o === 'noise') { for (var n1 in opts.noise) this.options.noise[n1] = opts.noise[n1]; }
        else { this.options[o] = opts[o]; }
      }
    }

    this.gl = null; this.ok = false; this.running = false;
    this.rafId = 0; this.lastFrame = 0; this._t0 = 0; this.time = 0;
    this.rtW = 0; this.rtH = 0; this.rtA = null; this.rtB = null;

    this._onResize = this.resize.bind(this);
    this._onVis = this._vis.bind(this);
    this._tick = this._loop.bind(this);

    if (!this._init()) return;
    this.ok = true; this.running = true;
    this.rafId = requestAnimationFrame(this._tick);
  }

  Bg.prototype._init = function () {
    var attrs = { alpha: false, antialias: false, depth: false, stencil: false,
      premultipliedAlpha: false, preserveDrawingBuffer: false,
      powerPreference: 'high-performance' };
    var gl = this.canvas.getContext('webgl', attrs) ||
             this.canvas.getContext('experimental-webgl', attrs);
    if (!gl) { console.warn('[bgShaderWebGL] WebGL нет — CSS-фон остаётся.'); return false; }
    this.gl = gl;
    var deriv = !!gl.getExtension('OES_standard_derivatives');
    try {
      this.progScene = program(gl, VS, buildSceneFS(deriv));
      this.progBlur = program(gl, VS, FS_BLUR);
    } catch (e) {
      console.warn('[bgShaderWebGL] Шейдер:', e.message); return false;
    }
    this.uS = cacheUniforms(gl, this.progScene);
    this.uB = cacheUniforms(gl, this.progBlur);

    this.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1
    ]), gl.STATIC_DRAW);
    this.aS = gl.getAttribLocation(this.progScene, 'a_pos');
    this.aB = gl.getAttribLocation(this.progBlur, 'a_pos');

    this.pal = makePalette(gl, this.colors);

    // seeded-генерация шума
    var nz = this.options.noise || {};
    this._rng = makeRng(nz.seed != null ? nz.seed : ((Math.random() * 0x7fffffff) | 0));
    var LL = this.options.layers;
    this.p1 = genParams(this._rng, mergeNoise(nz, LL[0].noise));
    this.p2 = genParams(this._rng, mergeNoise(nz, LL[1].noise));
    this.p3 = genParams(this._rng, mergeNoise(nz, LL[2].noise));
    this.p4 = genParams(this._rng, mergeNoise(nz, LL[3].noise));

    this.resize();
    if (!this.rtA || !this.rtA.ok || !this.rtB.ok) {
      console.warn('[bgShaderWebGL] FBO неполный.'); return false;
    }
    window.addEventListener('resize', this._onResize, { passive: true });
    document.addEventListener('visibilitychange', this._onVis);
    return true;
  };

  Bg.prototype._vis = function () {
    if (document.hidden) {
      this.running = false;
      if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = 0; }
    } else if (this.ok && !this.running) {
      this.running = true; this.lastFrame = 0;
      this.rafId = requestAnimationFrame(this._tick);
    }
  };

  Bg.prototype.resize = function () {
    if (!this.gl) return;
    var gl = this.gl;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cw = Math.max(1, window.innerWidth), chh = Math.max(1, window.innerHeight);
    var sc = this.options.scale || 0.15;
    var w = Math.max(32, Math.floor(cw * dpr * sc));
    var h = Math.max(32, Math.floor(chh * dpr * sc));
    var maxPx = this.options.maxPixels || 1500000;
    if (w * h > maxPx) {
      var k = Math.sqrt(maxPx / (w * h));
      w = Math.max(32, Math.floor(w * k)); h = Math.max(32, Math.floor(h * k));
    }
    var cs = this.canvas.style;
    cs.position = 'fixed'; cs.top = '0'; cs.left = '0';
    cs.width = cw + 'px'; cs.height = chh + 'px';
    var pw = Math.floor(cw * dpr), ph = Math.floor(chh * dpr);
    if (this.canvas.width !== pw) this.canvas.width = pw;
    if (this.canvas.height !== ph) this.canvas.height = ph;

    if (this.rtW !== w || this.rtH !== h) {
      if (this.rtA) { gl.deleteTexture(this.rtA.tex); gl.deleteFramebuffer(this.rtA.fbo); }
      if (this.rtB) { gl.deleteTexture(this.rtB.tex); gl.deleteFramebuffer(this.rtB.fbo); }
      this.rtA = makeTarget(gl, w, h);
      this.rtB = makeTarget(gl, w, h);
      this.rtW = w; this.rtH = h;
    }
  };

  Bg.prototype.setColors = function (colors) {
    if (!this.gl || !colors || !colors.length) return;
    this._colorAnim = null;
    this.colors = colors.slice();
    if (this.pal) this.gl.deleteTexture(this.pal);
    this.pal = makePalette(this.gl, this.colors);
  };

    // Плавная смена палитры. duration — мс.
  Bg.prototype.setColorsSmooth = function (colors, duration) {
    if (!this.gl || !colors || !colors.length) return;
    if (duration === 0) { this.setColors(colors); return; }
    var from = this.colors.map(function (c) { return [c[0], c[1], c[2]]; });
    var to = colors.map(function (c) { return [c[0], c[1], c[2]]; });
    while (from.length < 13) from.push([0, 0, 0]);
    while (to.length < 13) to.push([0, 0, 0]);
    this._colorAnim = {
      from: from,
      to: to,
      start: performance.now(),
      dur: Math.max(1, duration === undefined ? 600 : duration)
    };
  };

  Bg.prototype._uploadPalette = function (colors) {
    var gl = this.gl, N = 13;
    var data = new Uint8Array(N * 4);
    for (var i = 0; i < N; i++) {
      var c = colors[i] || [0, 0, 0];
      data[i * 4]     = c[0] & 255;
      data[i * 4 + 1] = c[1] & 255;
      data[i * 4 + 2] = c[2] & 255;
      data[i * 4 + 3] = 255;
    }
    gl.bindTexture(gl.TEXTURE_2D, this.pal);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, N, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
  };

  Bg.prototype._tickColors = function (now) {
    var a = this._colorAnim;
    if (!a) return;
    var t = (now - a.start) / a.dur;
    if (t > 1) t = 1;
    if (t < 0) t = 0;
    var e = t * t * (3 - 2 * t); // smoothstep
    var out = [];
    for (var i = 0; i < 13; i++) {
      var c0 = a.from[i] || [0, 0, 0];
      var c1 = a.to[i] || [0, 0, 0];
      out.push([
        Math.round(c0[0] + (c1[0] - c0[0]) * e),
        Math.round(c0[1] + (c1[1] - c0[1]) * e),
        Math.round(c0[2] + (c1[2] - c0[2]) * e)
      ]);
    }
    this._uploadPalette(out);
    if (t >= 1) {
      this.colors = a.to.map(function (c) { return c.slice(); });
      this._colorAnim = null;
    }
  };

  // Пересобрать параметры шума. Принимает { freqScale, timeScale, seed }.
  Bg.prototype.setNoise = function (g) {
    if (!this.gl) return;
    g = g || {};
    if (!this.options.noise) this.options.noise = {};
    if (g.freqScale !== undefined) this.options.noise.freqScale = g.freqScale;
    if (g.timeScale !== undefined) this.options.noise.timeScale = g.timeScale;
    if (g.seed !== undefined) {
      this.options.noise.seed = g.seed;
      var sd = g.seed != null ? g.seed : ((Math.random() * 0x7fffffff) | 0);
      this._rng = makeRng(sd);
    }
    var nz = this.options.noise, L = this.options.layers;
    this.p1 = genParams(this._rng, mergeNoise(nz, L[0].noise));
    this.p2 = genParams(this._rng, mergeNoise(nz, L[1].noise));
    this.p3 = genParams(this._rng, mergeNoise(nz, L[2].noise));
    this.p4 = genParams(this._rng, mergeNoise(nz, L[3].noise));
  };

  Bg.prototype.setOptions = function (o) {
    if (!this.gl || !o) return;
    var rz = false;
    for (var k in o) {
      if (!o.hasOwnProperty(k)) continue;
      if (k === 'layers') { this.options.layers = cloneLayers(o.layers); continue; }
      if (k === 'noise') { this.setNoise(o.noise); continue; }
      if (this.options[k] !== o[k]) {
        this.options[k] = o[k];
        if (k === 'scale' || k === 'maxPixels') rz = true;
      }
    }
    if (rz) this.resize();
  };

  Bg.prototype._quad = function (a) {
    var gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  };

  Bg.prototype._layer = function (i, p, c) {
    var gl = this.gl, u = this.uS, n = String(i);
    gl.uniform2f(u['u_sh'+n], p.shift[0], p.shift[1]);
    gl.uniform4f(u['u_f'+n], p.f[0], p.f[1], p.f[2], p.f[3]);
    gl.uniform4f(u['u_s'+n], p.s[0], p.s[1], p.s[2], p.s[3]);
    gl.uniform4f(u['u_w'+n], p.w[0], p.w[1], p.w[2], p.w[3]);
    gl.uniform2f(u['u_dr'+n], c.drift[0], c.drift[1]);
    gl.uniform1f(u['u_ts'+n], c.tSpeed);
    gl.uniform1f(u['u_wb'+n], c.wobble);
    gl.uniform1f(u['u_rt'+n], c.spin);
    gl.uniform1f(u['u_zm'+n], c.zoom);
    gl.uniform1f(u['u_zs'+n], c.zoomSpeed);
    gl.uniform1f(u['u_st'+n], c.stretch);
  };

  Bg.prototype._scene = function (t) {
    var gl = this.gl, u = this.uS;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.rtA.fbo);
    gl.viewport(0, 0, this.rtW, this.rtH);
    gl.useProgram(this.progScene);
    this._quad(this.aS);

    gl.uniform1f(u.u_time, t);
    gl.uniform2f(u.u_view, window.innerWidth * NOISE_REF_SCALE,
                            window.innerHeight * NOISE_REF_SCALE);
    gl.uniform1f(u.u_pulse, 0.85 + 0.15 * Math.sin(t * 0.025));
    gl.uniform1f(u.u_art, this.options.artStyle ? 1 : 0);
    gl.uniform1f(u.u_post, this.options.posterize);
    gl.uniform1f(u.u_outline, this.options.outline);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.pal);
    gl.uniform1i(u.u_pal, 0);

    var L = this.options.layers;
    this._layer(1, this.p1, L[0]);
    this._layer(2, this.p2, L[1]);
    this._layer(3, this.p3, L[2]);
    this._layer(4, this.p4, L[3]);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  Bg.prototype._blur = function (src, dst, dx, dy) {
    var gl = this.gl, u = this.uB;
    gl.bindFramebuffer(gl.FRAMEBUFFER, dst);
    gl.viewport(0, 0, this.rtW, this.rtH);
    gl.useProgram(this.progBlur);
    this._quad(this.aB);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, src);
    gl.uniform1i(u.u_tex, 0);
    gl.uniform2f(u.u_texel, 1 / this.rtW, 1 / this.rtH);
    gl.uniform2f(u.u_dir, dx, dy);
    gl.uniform1f(u.u_radius, Math.max(0.001, this.options.blur));
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  Bg.prototype._present = function () {
    var gl = this.gl, u = this.uB;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.progBlur);
    this._quad(this.aB);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.rtA.tex);
    gl.uniform1i(u.u_tex, 0);
    gl.uniform2f(u.u_texel, 1 / this.rtW, 1 / this.rtH);
    gl.uniform2f(u.u_dir, 0, 0);
    gl.uniform1f(u.u_radius, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  Bg.prototype._loop = function (now) {
    if (!this.ok || !this.running) return;
    this.rafId = requestAnimationFrame(this._tick);

    var fps = this.options.fps || 60;
    var minD = fps >= 144 ? 0 : 1000 / fps;
    if (minD && now - this.lastFrame < minD - 1) return;
    this.lastFrame = now;

    var dt = now * 0.001;
    if (!this._t0) this._t0 = dt;
    this.time = (dt - this._t0) * 24 * (this.options.speed || 1);

    var gl = this.gl;
    gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE);

    this._tickColors(now);
    this._scene(this.time);

    this._blur(this.rtA.tex, this.rtB.fbo, 1, 0);
    this._blur(this.rtB.tex, this.rtA.fbo, 0, 1);
    this._present();
  };

  Bg.prototype.destroy = function () {
    this.running = false; this.ok = false;
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = 0; }
    window.removeEventListener('resize', this._onResize);
    document.removeEventListener('visibilitychange', this._onVis);
    var gl = this.gl;
    if (!gl) return;
    try {
      if (this.rtA) { gl.deleteTexture(this.rtA.tex); gl.deleteFramebuffer(this.rtA.fbo); }
      if (this.rtB) { gl.deleteTexture(this.rtB.tex); gl.deleteFramebuffer(this.rtB.fbo); }
      if (this.pal) gl.deleteTexture(this.pal);
      if (this.quad) gl.deleteBuffer(this.quad);
      if (this.progScene) gl.deleteProgram(this.progScene);
      if (this.progBlur) gl.deleteProgram(this.progBlur);
    } catch (e) {}
    this.rtA = this.rtB = null;
  };

  function initBgShaderWebGL(target, colors, options) {
    var cv = typeof target === 'string' ? document.getElementById(target) : target;
    var stub = { ok: false, running: false, destroy: function () {},
      resize: function () {}, setColors: function () {}, setColorsSmooth: function () {},
      setNoise: function () {}, setOptions: function () {} };

    if (!cv) { console.warn('[bgShaderWebGL] canvas не найден:', target); return stub; }
    try {
      var inst = new Bg(cv, colors, options);
      return inst.ok ? inst : stub;
    } catch (e) {
      console.warn('[bgShaderWebGL] init:', e.message);
      return stub;
    }
  }

  global.initBgShaderWebGL = initBgShaderWebGL;
})(typeof window !== 'undefined' ? window : this);
