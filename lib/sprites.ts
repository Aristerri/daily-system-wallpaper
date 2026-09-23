export type PixelMatrix = number[][];
export type SpriteCategory = "flowers" | "animals" | "geometry";

const SIZE = 24;

function blank(): PixelMatrix {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function set(m: PixelMatrix, x: number, y: number, value = 1) {
  const xx = Math.round(x);
  const yy = Math.round(y);
  if (xx >= 0 && xx < SIZE && yy >= 0 && yy < SIZE) m[yy][xx] = value;
}

function line(m: PixelMatrix, x0: number, y0: number, x1: number, y1: number, thickness = 1) {
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  let x = x0;
  let y = y0;
  while (true) {
    for (let oy = -Math.floor(thickness / 2); oy <= Math.floor(thickness / 2); oy++) {
      for (let ox = -Math.floor(thickness / 2); ox <= Math.floor(thickness / 2); ox++) set(m, x + ox, y + oy);
    }
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x += sx; }
    if (e2 <= dx) { err += dx; y += sy; }
  }
}

function ellipse(m: PixelMatrix, cx: number, cy: number, rx: number, ry: number, fill = true) {
  for (let y = Math.floor(cy - ry - 1); y <= Math.ceil(cy + ry + 1); y++) {
    for (let x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx + 1); x++) {
      const d = ((x - cx) ** 2) / (rx ** 2 || 1) + ((y - cy) ** 2) / (ry ** 2 || 1);
      if (fill ? d <= 1 : d <= 1 && d >= 0.55) set(m, x, y);
    }
  }
}

function rect(m: PixelMatrix, x: number, y: number, w: number, h: number, fill = true) {
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) {
      if (fill || xx === x || xx === x + w - 1 || yy === y || yy === y + h - 1) set(m, xx, yy);
    }
  }
}

function hashSeed(input: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s += 0x6D2B79F5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const FLOWER_NAMES = [
  "rose","tulip","daisy","lily","poppy","iris","orchid","carnation","chrysanthemum","sunflower",
  "peony","lotus","violet","forget-me-not","lavender","daffodil","hibiscus","anemone","magnolia","camellia",
  "dahlia","aster","cosmos","zinnia","freesia","gardenia","jasmine","marigold","bluebell","snapdragon",
  "hydrangea","foxglove","buttercup","clover","edelweiss","geranium","begonia","primrose","ranunculus","amaryllis",
  "gladiolus","lupine","wisteria","azalea","rhododendron","morning-glory","sweet-pea","cornflower","snowdrop","crocus",
  "hyacinth","heather","yarrow","verbena","phlox","salvia","oleander","plumeria","proteа","wildflower"
] as const;

export const ANIMAL_NAMES = [
  "cat","fox","rabbit","deer","moth","butterfly","frog","bird","fish","snake",
  "owl","turtle","whale","beetle","dog","wolf","bear","mouse","rat","hamster",
  "squirrel","hedgehog","raccoon","otter","seal","penguin","duck","goose","swan","crow",
  "sparrow","hummingbird","flamingo","parrot","eagle","bat","bee","dragonfly","ladybug","spider",
  "crab","octopus","jellyfish","seahorse","shark","ray","dolphin","goldfish","lizard","chameleon",
  "gecko","snail","slug","ant","grasshopper","mantis","horse","cow","goat","alpaca"
] as const;

export const GEOMETRY_NAMES = Array.from({ length: 60 }, (_, i) => `geometry-${String(i + 1).padStart(2, "0")}`);

function flowerSprite(name: string, index: number): PixelMatrix {
  const m = blank();
  const random = rng(hashSeed(name + index));
  const cx = 12 + Math.round((random() - 0.5) * 4);
  const cy = 7 + Math.round(random() * 2);
  const petals = 4 + (index % 7);
  const radiusX = 3 + (index % 3);
  const radiusY = 2 + ((index + 1) % 3);
  const orbit = 3 + (index % 4) * 0.55;

  for (let p = 0; p < petals; p++) {
    const a = (Math.PI * 2 * p) / petals + random() * 0.12;
    const px = cx + Math.cos(a) * orbit;
    const py = cy + Math.sin(a) * orbit * 0.72;
    ellipse(m, px, py, radiusX / 2, radiusY / 2, index % 5 !== 0);
  }
  ellipse(m, cx, cy, 1.4 + (index % 2), 1.4 + (index % 2), true);

  const stemEndX = cx + Math.round((random() - 0.5) * 5);
  line(m, cx, cy + 3, stemEndX, 21, 1 + (index % 8 === 0 ? 1 : 0));

  const leafCount = 1 + (index % 3);
  for (let i = 0; i < leafCount; i++) {
    const y = 13 + i * 3;
    const side = (i + index) % 2 === 0 ? -1 : 1;
    const x = cx + Math.round((stemEndX - cx) * ((y - cy) / Math.max(1, 21 - cy)));
    ellipse(m, x + side * (2 + (index % 2)), y, 2.5 + (index % 2), 1.2, true);
    line(m, x, y, x + side * 3, y - 1, 1);
  }

  if (index % 6 === 0) {
    ellipse(m, cx + (index % 2 ? 5 : -5), cy + 2, 2, 2, false);
    line(m, cx, cy + 4, cx + (index % 2 ? 5 : -5), cy + 4, 1);
  }
  return m;
}

function animalSprite(name: string, index: number): PixelMatrix {
  const m = blank();
  const variant = index % 12;
  const random = rng(hashSeed(name + index));
  const shift = Math.round((random() - 0.5) * 2);

  if (variant === 0) { // cat/fox face
    ellipse(m, 12, 11, 7, 6, false);
    line(m, 6, 7, 8, 2, 1); line(m, 8, 2, 10, 6, 1);
    line(m, 14, 6, 16, 2, 1); line(m, 16, 2, 18, 7, 1);
    set(m, 9, 10); set(m, 15, 10); set(m, 12, 13);
    line(m, 8, 14, 4, 13, 1); line(m, 16, 14, 20, 13, 1);
    line(m, 8, 15, 4, 17, 1); line(m, 16, 15, 20, 17, 1);
  } else if (variant === 1) { // rabbit
    ellipse(m, 12, 13, 6, 5, false);
    ellipse(m, 9, 5, 2, 5, false); ellipse(m, 15, 5, 2, 5, false);
    set(m, 10, 12); set(m, 14, 12); set(m, 12, 15);
    line(m, 10, 17, 8, 20, 1); line(m, 14, 17, 16, 20, 1);
  } else if (variant === 2) { // bird
    ellipse(m, 11, 12, 7, 5, false);
    ellipse(m, 8, 12, 3, 2, false);
    line(m, 17, 11, 22, 9, 1); line(m, 17, 12, 22, 13, 1);
    set(m, 14, 10); line(m, 9, 17, 8, 21, 1); line(m, 13, 17, 14, 21, 1);
  } else if (variant === 3) { // fish
    ellipse(m, 10, 12, 7, 4, false);
    line(m, 17, 12, 22, 7, 1); line(m, 22, 7, 22, 17, 1); line(m, 22, 17, 17, 12, 1);
    set(m, 6, 11); line(m, 10, 9, 12, 5, 1); line(m, 10, 15, 12, 19, 1);
  } else if (variant === 4) { // frog
    ellipse(m, 12, 13, 7, 5, false);
    ellipse(m, 8, 8, 3, 3, false); ellipse(m, 16, 8, 3, 3, false);
    set(m, 8, 8); set(m, 16, 8); line(m, 9, 15, 15, 15, 1);
    line(m, 7, 16, 3, 20, 1); line(m, 17, 16, 21, 20, 1);
  } else if (variant === 5) { // butterfly
    ellipse(m, 7, 9, 5, 5, false); ellipse(m, 17, 9, 5, 5, false);
    ellipse(m, 8, 16, 4, 4, false); ellipse(m, 16, 16, 4, 4, false);
    line(m, 12, 6, 12, 20, 2); line(m, 11, 6, 8, 2, 1); line(m, 13, 6, 16, 2, 1);
  } else if (variant === 6) { // snake
    for (let y = 4; y <= 20; y++) {
      const x = 12 + Math.round(Math.sin((y + index) * 0.8) * 5);
      set(m, x, y); set(m, x + 1, y);
    }
    ellipse(m, 16 + shift, 4, 3, 2, false); set(m, 17 + shift, 4);
    line(m, 19 + shift, 4, 22, 3, 1);
  } else if (variant === 7) { // owl
    ellipse(m, 12, 12, 7, 8, false);
    ellipse(m, 9, 9, 3, 3, false); ellipse(m, 15, 9, 3, 3, false);
    set(m, 9, 9); set(m, 15, 9); line(m, 12, 11, 10, 14, 1); line(m, 12, 11, 14, 14, 1);
    line(m, 7, 19, 5, 22, 1); line(m, 17, 19, 19, 22, 1);
  } else if (variant === 8) { // turtle
    ellipse(m, 11, 13, 7, 5, false); ellipse(m, 20, 13, 3, 2, false);
    line(m, 6, 10, 3, 7, 1); line(m, 6, 16, 3, 19, 1);
    line(m, 14, 10, 16, 7, 1); line(m, 14, 16, 16, 19, 1);
    line(m, 6, 13, 16, 13, 1); line(m, 11, 8, 11, 18, 1);
  } else if (variant === 9) { // deer / quadruped
    rect(m, 7, 11, 9, 5, false); line(m, 15, 11, 18, 7, 1); ellipse(m, 19, 6, 3, 2, false);
    line(m, 9, 16, 8, 22, 1); line(m, 14, 16, 15, 22, 1);
    line(m, 19, 4, 17, 1, 1); line(m, 20, 4, 22, 1, 1); line(m, 6, 12, 3, 10, 1);
  } else if (variant === 10) { // whale
    ellipse(m, 11, 13, 8, 5, false);
    line(m, 18, 13, 22, 9, 1); line(m, 22, 9, 21, 15, 1); line(m, 21, 15, 18, 13, 1);
    set(m, 7, 11); line(m, 5, 9, 4, 5, 1); line(m, 4, 5, 2, 3, 1); line(m, 4, 5, 6, 3, 1);
  } else { // beetle
    ellipse(m, 12, 13, 6, 8, false); line(m, 12, 5, 12, 21, 1);
    ellipse(m, 12, 6, 3, 2, false);
    line(m, 7, 9, 3, 6, 1); line(m, 7, 13, 2, 13, 1); line(m, 7, 17, 3, 20, 1);
    line(m, 17, 9, 21, 6, 1); line(m, 17, 13, 22, 13, 1); line(m, 17, 17, 21, 20, 1);
  }

  // Tiny deterministic variations so all 60 are not literal copies of their archetype.
  if (index >= 12) {
    const count = 1 + (index % 4);
    for (let i = 0; i < count; i++) {
      const x = 4 + Math.floor(random() * 16);
      const y = 4 + Math.floor(random() * 16);
      set(m, x, y);
    }
  }
  return m;
}

function geometrySprite(name: string, index: number): PixelMatrix {
  const m = blank();
  const random = rng(hashSeed(name + index));
  const type = index % 10;

  if (type === 0) {
    for (let r = 2; r <= 9; r += 2) ellipse(m, 12, 12, r, r, false);
  } else if (type === 1) {
    for (let i = 3; i < 22; i += 4) { line(m, 2, i, 21, 21 - i, 1); }
  } else if (type === 2) {
    for (let y = 3; y < 21; y += 3) for (let x = 3; x < 21; x += 3) if ((x + y + index) % 2 === 0) rect(m, x, y, 2, 2, true);
  } else if (type === 3) {
    for (let i = 0; i < 6; i++) {
      const inset = 2 + i * 2;
      rect(m, inset, inset, 24 - inset * 2, 24 - inset * 2, false);
    }
  } else if (type === 4) {
    line(m, 12, 2, 22, 12, 1); line(m, 22, 12, 12, 22, 1); line(m, 12, 22, 2, 12, 1); line(m, 2, 12, 12, 2, 1);
    ellipse(m, 12, 12, 4 + (index % 3), 4 + (index % 3), false);
  } else if (type === 5) {
    for (let y = 3; y < 22; y += 3) line(m, 2 + ((y + index) % 5), y, 21, y, 1);
    line(m, 12, 2, 12, 22, 2);
  } else if (type === 6) {
    for (let a = 0; a < 8; a++) {
      const angle = (Math.PI * 2 * a) / 8;
      line(m, 12, 12, 12 + Math.round(Math.cos(angle) * 10), 12 + Math.round(Math.sin(angle) * 10), 1);
    }
    ellipse(m, 12, 12, 3, 3, false);
  } else if (type === 7) {
    for (let i = 0; i < 40; i++) set(m, 2 + Math.floor(random() * 20), 2 + Math.floor(random() * 20));
    rect(m, 5, 5, 14, 14, false);
  } else if (type === 8) {
    for (let y = 3; y < 21; y++) {
      const x = 12 + Math.round(Math.sin((y + index) * 0.7) * 7);
      set(m, x, y); set(m, 23 - x, y);
    }
  } else {
    for (let i = 2; i < 22; i += 2) {
      line(m, 2, i, i, 2, 1);
      line(m, 22, 24 - i, 24 - i, 22, 1);
    }
  }
  return m;
}

export function getSprite(category: SpriteCategory, index: number): PixelMatrix {
  const normalized = ((index % 60) + 60) % 60;
  if (category === "flowers") return flowerSprite(FLOWER_NAMES[normalized], normalized);
  if (category === "animals") return animalSprite(ANIMAL_NAMES[normalized], normalized);
  return geometrySprite(GEOMETRY_NAMES[normalized], normalized);
}

export function getSpriteName(category: SpriteCategory, index: number) {
  const normalized = ((index % 60) + 60) % 60;
  if (category === "flowers") return FLOWER_NAMES[normalized];
  if (category === "animals") return ANIMAL_NAMES[normalized];
  return GEOMETRY_NAMES[normalized];
}
