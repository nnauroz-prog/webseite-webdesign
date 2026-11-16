/**
 * Kino-Kamera für die Filme der Spruch-Karten (lib/story-bild.ts): Das
 * fertig gezeichnete Plakat liegt als Fläche im Raum, und eine Kamera
 * filmt es wie ein echtes Objektiv. Dazu gehören Perspektive bei
 * schrägem Blick, Tiefenschärfe (was nicht in der Schärfeebene liegt,
 * wird weich), ein Licht, das über das Papier streicht, und auf Wunsch
 * Bewegungsunschärfe bei schnellen Fahrten.
 *
 * Gezeichnet wird mit WebGL 2 auf einer gemeinsamen, unsichtbaren
 * Zeichenfläche, die das Ergebnis an die eigentliche Zeichenfläche
 * weitergibt. Kann der Browser das nicht, gibt kinoBereit() false
 * zurück, und das Plakat wird wie bisher flach gezeichnet.
 *
 * Koordinaten: Plakatpunkte in Bildpunkten des Formats (x nach rechts,
 * y nach unten). Die Kamera blickt auf einen Zielpunkt des Plakats aus
 * einer Entfernung (in denselben Bildpunkten), gedreht um Gier (yaw,
 * nach links und rechts), Nick (pitch, positiv: Kamera unter dem Ziel,
 * Blick nach oben) und Roll.
 */

/** Die Kamera eines Bildes. */
export type KinoKamera = {
  /** Zielpunkt auf dem Plakat */
  tx: number;
  ty: number;
  /** Entfernung zum Zielpunkt */
  dist: number;
  /** Winkel im Bogenmaß */
  yaw: number;
  pitch: number;
  roll: number;
  /** senkrechter Bildwinkel im Bogenmaß */
  fov: number;
  /** Blende: 0 = alles scharf; Anteil der Bildhöhe, um den ein Punkt in doppelter Entfernung verschwimmt */
  blende: number;
  /** Licht und Raum (0 = flach wie gedruckt, 1 = volle Stimmung) */
  licht: number;
};

/**
 * Welcher Ausschnitt des Plakats auf der Textur liegt: Mitte und
 * Vergrößerung wie bei der flachen Kamera, gezeichnet in eine Teilfläche
 * der Größe nb × nh (Bildpunkte), die bei (ox, oy) beginnt. Rund um die
 * Teilfläche zeichnet die flache Kamera einfach weiter; Abtastpunkte
 * knapp daneben treffen also echten Inhalt.
 */
export type Abbildung = {
  cx: number;
  cy: number;
  zt: number;
  ox: number;
  oy: number;
  nb: number;
  nh: number;
};

type V3 = [number, number, number];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const kreuz = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const punkt = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const einheit = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

/**
 * Lage der Kamera im Raum. Welt: X nach rechts, Y nach oben, Z aus dem
 * Plakat heraus; das Plakat liegt in Z = 0, seine Mitte im Ursprung.
 */
function lage(k: KinoKamera, b: number, h: number) {
  const ziel: V3 = [k.tx - b / 2, -(k.ty - h / 2), 0];
  const cp = Math.cos(k.pitch);
  const pos: V3 = [
    ziel[0] + k.dist * cp * Math.sin(k.yaw),
    ziel[1] - k.dist * Math.sin(k.pitch),
    ziel[2] + k.dist * cp * Math.cos(k.yaw),
  ];
  const vor = einheit(sub(ziel, pos));
  // „Oben“ ist die Welt-Y-Achse, um die Blickrichtung gerollt.
  const rechts0 = einheit(kreuz(vor, [0, 1, 0]));
  const oben0 = kreuz(rechts0, vor);
  const [c, s] = [Math.cos(k.roll), Math.sin(k.roll)];
  const rechts: V3 = [
    rechts0[0] * c + oben0[0] * s,
    rechts0[1] * c + oben0[1] * s,
    rechts0[2] * c + oben0[2] * s,
  ];
  const oben = kreuz(rechts, vor);
  return { pos, vor, rechts, oben };
}

/** Sicht- und Projektionsmatrix (Spalten zuerst, wie WebGL sie erwartet). */
function matrizen(k: KinoKamera, b: number, h: number) {
  const { pos, vor, rechts, oben } = lage(k, b, h);
  const sicht = new Float32Array([
    rechts[0],
    oben[0],
    -vor[0],
    0,
    rechts[1],
    oben[1],
    -vor[1],
    0,
    rechts[2],
    oben[2],
    -vor[2],
    0,
    -punkt(rechts, pos),
    -punkt(oben, pos),
    punkt(vor, pos),
    1,
  ]);
  const nah = k.dist * 0.02;
  const fern = k.dist * 40;
  const f = 1 / Math.tan(k.fov / 2);
  const a = b / h;
  const proj = new Float32Array([
    f / a,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (fern + nah) / (nah - fern),
    -1,
    0,
    0,
    (2 * fern * nah) / (nah - fern),
    0,
  ]);
  return { sicht, proj };
}

/**
 * Wo trifft der Blick durch den Bildpunkt (sx, sy) die Plakatebene?
 * sx, sy von -1 bis 1 (Bildrand); Strahlen hinter dem Horizont zählen
 * als sehr weit weg (der Ausschnitt wird ohnehin begrenzt).
 */
function aufPlakat(
  k: KinoKamera,
  b: number,
  h: number,
  sx: number,
  sy: number,
): [number, number] {
  const { pos, vor, rechts, oben } = lage(k, b, h);
  const ty = Math.tan(k.fov / 2);
  const tx = ty * (b / h);
  const d: V3 = [
    vor[0] + rechts[0] * sx * tx + oben[0] * sy * ty,
    vor[1] + rechts[1] * sx * tx + oben[1] * sy * ty,
    vor[2] + rechts[2] * sx * tx + oben[2] * sy * ty,
  ];
  const s = Math.min(d[2] < -1e-4 ? -pos[2] / d[2] : 1e5, 1e5);
  return [pos[0] + d[0] * s + b / 2, -(pos[1] + d[1] * s) + h / 2];
}

/** Wo erscheint ein Plakatpunkt im Bild (-1 bis 1)? null hinter der Kamera. */
function imBildVon(
  k: KinoKamera,
  b: number,
  h: number,
  p: [number, number],
): [number, number] | null {
  const { pos, vor, rechts, oben } = lage(k, b, h);
  const w = sub([p[0] - b / 2, -(p[1] - h / 2), 0], pos);
  const z = punkt(w, vor);
  if (z <= 1e-3) return null;
  const ty = Math.tan(k.fov / 2);
  return [punkt(w, rechts) / (z * ty * (b / h)), punkt(w, oben) / (z * ty)];
}

/**
 * Welcher Teil des Plakats ist zu sehen? Die vier Bildecken werden auf
 * die Plakatebene zurückgerechnet; geliefert wird das umschließende
 * Rechteck in Plakatpunkten.
 */
export function sichtbarerBereich(k: KinoKamera, b: number, h: number) {
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const [sx, sy] of [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ]) {
    const [px, py] = aufPlakat(k, b, h, sx, sy);
    x0 = Math.min(x0, px);
    x1 = Math.max(x1, px);
    y0 = Math.min(y0, py);
    y1 = Math.max(y1, py);
  }
  return { x0, y0, x1, y1 };
}

/**
 * Wie weit wandert das Bild zwischen zwei Kameralagen höchstens, in
 * Bildpunkten der Ausgabe? Gemessen an neun Punkten des Bildes (für die
 * Zahl der Lagen bei der Bewegungsunschärfe).
 */
export function bildWeg(
  jetzt: KinoKamera,
  vorher: KinoKamera,
  b: number,
  h: number,
  ausgabeH: number,
): number {
  let weg = 0;
  for (const sx of [-0.95, 0, 0.95])
    for (const sy of [-0.95, 0, 0.95]) {
      const p = imBildVon(vorher, b, h, aufPlakat(jetzt, b, h, sx, sy));
      if (!p) return ausgabeH;
      weg = Math.max(
        weg,
        Math.hypot((p[0] - sx) * (b / h), p[1] - sy) * (ausgabeH / 2),
      );
    }
  return weg;
}

/**
 * Ausschnitt für die Textur: was alle Kameralagen eines Bildes sehen,
 * dazu ein Saum für die Unschärfe (saum, Plakatpunkte), auf das
 * Seitenverhältnis des Plakats erweitert und auf Plakat plus Rand
 * begrenzt. Mitte und Vergrößerung sind die Kamera, mit der das Plakat
 * flach auf die Textur gezeichnet wird; die Teilfläche ist flaeche ×
 * anteil groß und liegt mittig auf der Zeichenfläche.
 */
export function abbildungFuer(
  kameras: KinoKamera[],
  b: number,
  h: number,
  rand: number,
  saum: number,
  flaeche: { b: number; h: number },
  anteil: number,
): Abbildung {
  let [sx0, sy0, sx1, sy1] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const k of kameras) {
    const s = sichtbarerBereich(k, b, h);
    sx0 = Math.min(sx0, s.x0);
    sy0 = Math.min(sy0, s.y0);
    sx1 = Math.max(sx1, s.x1);
    sy1 = Math.max(sy1, s.y1);
  }
  const x0 = Math.max(sx0 - saum, -rand);
  const x1 = Math.min(sx1 + saum, b + rand);
  const y0 = Math.max(sy0 - saum, -rand);
  const y1 = Math.min(sy1 + saum, h + rand);
  let bw = Math.max(1, x1 - x0);
  let bh = Math.max(1, y1 - y0);
  if (bw / bh > b / h) bh = (bw * h) / b;
  else bw = (bh * b) / h;
  // Nie größer als Plakat und Rand zusammen.
  const groesst = Math.min((b + 2 * rand) / b, (h + 2 * rand) / h);
  const zt = Math.max(1 / groesst, b / bw);
  const nb = Math.round(flaeche.b * anteil);
  const nh = Math.round(flaeche.h * anteil);
  return {
    cx: (x0 + x1) / 2,
    cy: (y0 + y1) / 2,
    zt,
    ox: Math.floor((flaeche.b - nb) / 2),
    oy: Math.floor((flaeche.h - nh) / 2),
    nb,
    nh,
  };
}

const ECKEN = `#version 300 es
precision highp float;
in vec2 a_p;
uniform mat4 u_sicht;
uniform mat4 u_proj;
uniform vec2 u_plakat;
out vec2 v_p;
out float v_tiefe;
void main() {
  vec4 welt = vec4(a_p.x - u_plakat.x * 0.5, -(a_p.y - u_plakat.y * 0.5), 0.0, 1.0);
  vec4 s = u_sicht * welt;
  v_p = a_p;
  v_tiefe = -s.z;
  gl_Position = u_proj * s;
}`;

const FLAECHE = `#version 300 es
precision highp float;
in vec2 v_p;
in float v_tiefe;
uniform sampler2D u_tex;
uniform vec2 u_texGroesse;
uniform vec3 u_abb;
uniform vec4 u_teil;
uniform vec2 u_plakat;
uniform float u_rand;
uniform float u_fokus;
uniform float u_blende;
uniform vec2 u_ausgabe;
uniform float u_licht;
uniform float u_zeit;
uniform vec3 u_dunkel;
uniform float u_gewicht;
out vec4 farbe;

// Plakatpunkt → Texturkoordinate: Ausschnitt (Mitte, Vergrößerung),
// dann die Teilfläche (Beginn, Größe in Bildpunkten) auf der Textur.
vec2 texPunkt(vec2 p) {
  vec2 q = clamp(p, vec2(-u_rand), u_plakat + vec2(u_rand));
  vec2 uv = (q - u_abb.xy) * u_abb.z / u_plakat + 0.5;
  vec2 px = u_teil.xy + uv * u_teil.zw;
  return vec2(px.x / u_texGroesse.x, 1.0 - px.y / u_texGroesse.y);
}

void main() {
  vec2 uv = texPunkt(v_p);
  // Ableitungen im gleichförmigen Ablauf, vor jeder Verzweigung.
  vec2 duvx = dFdx(uv);
  vec2 duvy = dFdy(uv);
  float texelJePixel = max(length(duvx * u_texGroesse), length(duvy * u_texGroesse));

  // Tiefenschärfe: Zerstreuungskreis in Bildpunkten der Ausgabe.
  float coc = u_blende * abs(v_tiefe - u_fokus) / v_tiefe * u_ausgabe.y;
  coc = min(coc, 0.02 * u_ausgabe.y);
  vec3 c;
  if (coc < 0.6) {
    // Scharf: mit den Ableitungen, damit die anisotrope Filterung greift.
    c = textureGrad(u_tex, uv, duvx, duvy).rgb;
  } else {
    // Unscharf: 16 Punkte auf einer Scheibe im Bild (am Plakat eine
    // Ellipse, wie die Perspektive sie verzerrt).
    float lod = log2(max(coc * texelJePixel * 0.32, 1.0));
    c = vec3(0.0);
    for (int i = 0; i < 16; i++) {
      float r = sqrt((float(i) + 0.5) / 16.0) * coc;
      float w = float(i) * 2.39996323;
      vec2 o = vec2(cos(w), sin(w)) * r;
      c += textureLod(u_tex, uv + duvx * o.x + duvy * o.y, lod).rgb;
    }
    c /= 16.0;
  }

  // Raum: Außerhalb des Plakats fällt das Licht ab, ins Dunkle.
  vec2 halb = u_plakat * 0.5;
  float aussen = length(max(abs(v_p - halb) - halb, 0.0));
  c = mix(c, u_dunkel, smoothstep(0.0, u_rand * 1.8, aussen) * 0.94);

  // Licht: ein weiches Gefälle über das Papier und ein Glanz, der mit
  // der Zeit darüber wandert. Beides nur während der Fahrt.
  vec2 rel = (v_p - halb) / u_plakat.y;
  float gefaelle = dot(rel, normalize(vec2(-0.55, 0.85)));
  c *= 1.0 + u_licht * 0.22 * gefaelle;
  float lauf = dot(v_p / u_plakat.y, normalize(vec2(1.0, 0.42)));
  float g = (lauf - (u_zeit * 0.22 - 0.35)) / 0.16;
  float glanz = exp(-g * g);
  c += u_licht * 0.055 * glanz;

  // Objektiv: leichte Abschattung zu den Bildecken.
  vec2 s = gl_FragCoord.xy / u_ausgabe - 0.5;
  s.x *= u_ausgabe.x / u_ausgabe.y;
  c *= 1.0 - u_licht * 0.3 * smoothstep(0.32, 0.9, length(s) * 1.25);

  farbe = vec4(c * u_gewicht, u_gewicht);
}`;

const KOPIE_ECKEN = `#version 300 es
in vec2 a_p;
out vec2 v_uv;
void main() { v_uv = a_p * 0.5 + 0.5; gl_Position = vec4(a_p, 0.0, 1.0); }`;
const KOPIE = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_tex;
out vec4 farbe;
void main() { farbe = vec4(texture(u_tex, v_uv).rgb, 1.0); }`;

type Gl = WebGL2RenderingContext;

type Kino = {
  canvas: HTMLCanvasElement;
  gl: Gl;
  flaeche: WebGLProgram;
  kopie: WebGLProgram;
  orte: Record<string, WebGLUniformLocation | null>;
  ecken: WebGLBuffer;
  quadrat: WebGLBuffer;
  tex: WebGLTexture;
  /** Größe des angelegten Texturspeichers (0: noch keiner) */
  texB: number;
  texH: number;
  maxTex: number;
  aniso: EXT_texture_filter_anisotropic | null;
  fliess: boolean;
  /** Sammelpuffer für die Bewegungsunschärfe */
  sammel: {
    fb: WebGLFramebuffer;
    tex: WebGLTexture;
    b: number;
    h: number;
  } | null;
  verloren: boolean;
};

let kino: Kino | null | undefined;

const ORTE = [
  "u_sicht",
  "u_proj",
  "u_plakat",
  "u_tex",
  "u_texGroesse",
  "u_abb",
  "u_teil",
  "u_rand",
  "u_fokus",
  "u_blende",
  "u_ausgabe",
  "u_licht",
  "u_zeit",
  "u_dunkel",
  "u_gewicht",
];

function programm(gl: Gl, ecken: string, flaeche: string): WebGLProgram {
  const p = gl.createProgram();
  for (const [art, quelle] of [
    [gl.VERTEX_SHADER, ecken],
    [gl.FRAGMENT_SHADER, flaeche],
  ] as const) {
    const s = gl.createShader(art);
    if (!s) throw new Error("Shader");
    gl.shaderSource(s, quelle);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(s) ?? "Shader");
    gl.attachShader(p, s);
  }
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(p) ?? "Programm");
  return p;
}

function anlegen(): Kino | null {
  if (typeof document === "undefined") return null;
  try {
    const canvas = document.createElement("canvas");
    // Keine Kantenglättung und kein Tiefenpuffer: Die Fläche hat im Bild
    // keine Kanten, und der Tiefentest ist aus. Das Bild wird im selben
    // Durchlauf weitergegeben, der Puffer muss also nicht erhalten bleiben.
    const gl = canvas.getContext("webgl2", {
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      premultipliedAlpha: false,
      alpha: false,
    });
    if (!gl) return null;
    const flaeche = programm(gl, ECKEN, FLAECHE);
    const orte: Kino["orte"] = {};
    for (const n of ORTE) orte[n] = gl.getUniformLocation(flaeche, n);
    const k: Kino = {
      canvas,
      gl,
      flaeche,
      kopie: programm(gl, KOPIE_ECKEN, KOPIE),
      orte,
      ecken: gl.createBuffer(),
      quadrat: gl.createBuffer(),
      tex: gl.createTexture(),
      texB: 0,
      texH: 0,
      maxTex: gl.getParameter(gl.MAX_TEXTURE_SIZE) as number,
      aniso: gl.getExtension("EXT_texture_filter_anisotropic"),
      fliess: !!gl.getExtension("EXT_color_buffer_float"),
      sammel: null,
      verloren: false,
    };
    gl.bindBuffer(gl.ARRAY_BUFFER, k.quadrat);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    canvas.addEventListener("webglcontextlost", () => {
      k.verloren = true;
    });
    return k;
  } catch {
    return null;
  }
}

/** Kann dieser Browser die Kino-Kamera? */
export function kinoBereit(): boolean {
  if (kino === undefined) kino = anlegen();
  return !!kino && !kino.verloren;
}

/**
 * Gibt den Speicher der Kino-Kamera frei (nach dem Export, beim
 * Verlassen der Journal-Seite). Beim nächsten Bild wird er neu angelegt.
 */
export function kinoFreigeben(): void {
  if (!kino || kino.verloren) return;
  const { gl } = kino;
  if (kino.sammel) {
    gl.deleteFramebuffer(kino.sammel.fb);
    gl.deleteTexture(kino.sammel.tex);
    kino.sammel = null;
  }
  gl.deleteTexture(kino.tex);
  kino.tex = gl.createTexture();
  kino.texB = kino.texH = 0;
  kino.canvas.width = kino.canvas.height = 1;
}

function sammelpuffer(k: Kino, b: number, h: number) {
  const { gl } = k;
  if (k.sammel && k.sammel.b === b && k.sammel.h === h) return k.sammel;
  if (k.sammel) {
    gl.deleteFramebuffer(k.sammel.fb);
    gl.deleteTexture(k.sammel.tex);
  }
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA16F,
    b,
    h,
    0,
    gl.RGBA,
    gl.HALF_FLOAT,
    null,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    tex,
    0,
  );
  const ok =
    gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  if (!ok) {
    k.fliess = false;
    return null;
  }
  k.sammel = { fb, tex, b, h };
  return k.sammel;
}

/**
 * Filmt das Plakat: quelle ist die flach gezeichnete Textur (Ausschnitt
 * laut abb), kameras sind eine oder mehrere Kameralagen desselben Bildes
 * (mehrere: Bewegungsunschärfe, gemittelt). Das Ergebnis wird in die
 * Zeichenfläche ziel gezeichnet (volle Größe). Gibt false zurück, wenn
 * es nicht ging; dann zeichnet der Aufrufer flach.
 */
export function kinoZeichnen(a: {
  ziel: CanvasRenderingContext2D;
  quelle: HTMLCanvasElement;
  abb: Abbildung;
  kameras: KinoKamera[];
  /** Plakatgröße in Bildpunkten des Formats */
  b: number;
  h: number;
  /** Rand um das Plakat, der auf der Textur noch gezeichnet ist */
  rand: number;
  /** Farbe des Raums um das Plakat (0 bis 1) */
  dunkel: [number, number, number];
  zeit: number;
}): boolean {
  if (!kinoBereit() || !kino) return false;
  const k = kino;
  const { gl } = k;
  const ausB = a.ziel.canvas.width;
  const ausH = a.ziel.canvas.height;
  const qb = a.quelle.width;
  const qh = a.quelle.height;
  if (Math.max(qb, qh) > k.maxTex) return false;
  try {
    if (k.canvas.width !== ausB || k.canvas.height !== ausH) {
      k.canvas.width = ausB;
      k.canvas.height = ausH;
    }
    // Textur: das flach gezeichnete Plakat, mit Mipmaps für Tiefenschärfe
    // und entfernte Teile. Speicher einmal je Größe anlegen, danach nur
    // noch füllen.
    gl.bindTexture(gl.TEXTURE_2D, k.tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    const neu = k.texB !== qb || k.texH !== qh;
    if (neu) {
      if (k.texB) {
        gl.deleteTexture(k.tex);
        k.tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, k.tex);
      }
      const stufen = Math.floor(Math.log2(Math.max(qb, qh))) + 1;
      gl.texStorage2D(gl.TEXTURE_2D, stufen, gl.RGBA8, qb, qh);
      k.texB = qb;
      k.texH = qh;
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (k.aniso)
        gl.texParameterf(gl.TEXTURE_2D, k.aniso.TEXTURE_MAX_ANISOTROPY_EXT, 8);
    }
    gl.texSubImage2D(
      gl.TEXTURE_2D,
      0,
      0,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      a.quelle,
    );
    gl.generateMipmap(gl.TEXTURE_2D);
    if (neu && gl.getError() !== gl.NO_ERROR) {
      // Kein Speicher oder zu groß: lieber flach als schwarz.
      k.texB = k.texH = 0;
      return false;
    }

    // Fläche: weit über das Plakat hinaus, damit bei schrägem Blick
    // nirgends ein Ende zu sehen ist.
    const w = 6 * Math.max(a.b, a.h);
    gl.bindBuffer(gl.ARRAY_BUFFER, k.ecken);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-w, -w, a.b + w, -w, -w, a.h + w, a.b + w, a.h + w]),
      gl.DYNAMIC_DRAW,
    );

    const viele = a.kameras.length > 1 && k.fliess;
    const sammel = viele ? sammelpuffer(k, ausB, ausH) : null;
    const kameras = sammel ? a.kameras : a.kameras.slice(0, 1);
    gl.bindFramebuffer(gl.FRAMEBUFFER, sammel ? sammel.fb : null);
    gl.viewport(0, 0, ausB, ausH);
    if (sammel) gl.clearColor(0, 0, 0, 0);
    else gl.clearColor(a.dunkel[0], a.dunkel[1], a.dunkel[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    if (sammel) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
    } else gl.disable(gl.BLEND);

    gl.useProgram(k.flaeche);
    const o = k.orte;
    const lage = gl.getAttribLocation(k.flaeche, "a_p");
    gl.enableVertexAttribArray(lage);
    gl.vertexAttribPointer(lage, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, k.tex);
    gl.uniform1i(o.u_tex, 0);
    gl.uniform2f(o.u_texGroesse, qb, qh);
    gl.uniform3f(o.u_abb, a.abb.cx, a.abb.cy, a.abb.zt);
    gl.uniform4f(o.u_teil, a.abb.ox, a.abb.oy, a.abb.nb, a.abb.nh);
    gl.uniform2f(o.u_plakat, a.b, a.h);
    gl.uniform1f(o.u_rand, a.rand);
    gl.uniform2f(o.u_ausgabe, ausB, ausH);
    gl.uniform1f(o.u_zeit, a.zeit);
    gl.uniform3f(o.u_dunkel, a.dunkel[0], a.dunkel[1], a.dunkel[2]);
    gl.uniform1f(o.u_gewicht, 1 / kameras.length);
    for (const kam of kameras) {
      const { sicht, proj } = matrizen(kam, a.b, a.h);
      gl.uniformMatrix4fv(o.u_sicht, false, sicht);
      gl.uniformMatrix4fv(o.u_proj, false, proj);
      gl.uniform1f(o.u_fokus, kam.dist);
      gl.uniform1f(o.u_blende, kam.blende);
      gl.uniform1f(o.u_licht, kam.licht);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    gl.disable(gl.BLEND);

    if (sammel) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, ausB, ausH);
      gl.useProgram(k.kopie);
      gl.bindBuffer(gl.ARRAY_BUFFER, k.quadrat);
      const l2 = gl.getAttribLocation(k.kopie, "a_p");
      gl.enableVertexAttribArray(l2);
      gl.vertexAttribPointer(l2, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sammel.tex);
      gl.uniform1i(gl.getUniformLocation(k.kopie, "u_tex"), 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    if (gl.isContextLost()) {
      k.verloren = true;
      return false;
    }
    a.ziel.save();
    a.ziel.setTransform(1, 0, 0, 1, 0, 0);
    a.ziel.globalAlpha = 1;
    a.ziel.globalCompositeOperation = "copy";
    a.ziel.drawImage(k.canvas, 0, 0);
    a.ziel.restore();
    return true;
  } catch {
    return false;
  }
}
