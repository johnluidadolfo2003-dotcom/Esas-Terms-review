export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface TargetRegion {
  id: string;
  slot: string;
  label: string;
  rect: Rect;
}

export interface FrameObservation {
  frameId: number;
  videoTime: number;
  timestamp: number;
  sample: {
    px: number;
    py: number;
    timestamp: number;
    pose?: { x: number; y: number; yaw: number; pitch: number; roll: number; scale: number };
  } | null;
}

export interface GazeModel {
  kind: 'affine' | 'polynomial' | 'linear';
  mean: Point;
  scale: Point;
  x: number[];
  y: number[];
}

export function rectCenter(rect: Rect): Point {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function distance(p1: Point, p2: Point): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function quantile(values: number[], q: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base];
}

export function projectGaze(model: GazeModel, px: number, py: number): Point {
  if (!model || !model.x || !model.y) return { x: px, y: py };
  const nx = (px - model.mean.x) / (model.scale.x || 1);
  const ny = (py - model.mean.y) / (model.scale.y || 1);
  let gx = 0;
  let gy = 0;
  const terms = [1, nx, ny, nx * nx, ny * ny, nx * ny];
  for (let i = 0; i < Math.min(terms.length, model.x.length); i++) {
    gx += model.x[i] * (terms[i] ?? 0);
    gy += model.y[i] * (terms[i] ?? 0);
  }
  return { x: gx, y: gy };
}

export class GazeSmoother {
  private current: Point | null = null;
  private lastTime: number = 0;
  private minCutoffHz: number;
  private beta: number;

  constructor(opts: { minCutoffHz?: number; beta?: number }) {
    this.minCutoffHz = opts.minCutoffHz ?? 1.1;
    this.beta = opts.beta ?? 0.006;
  }

  public update(raw: Point, timestamp: number): Point {
    if (!this.current) {
      this.current = { ...raw };
      this.lastTime = timestamp;
      return { ...this.current };
    }
    const dt = Math.max(0.001, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;
    const alpha = Math.min(1, dt * this.minCutoffHz * 10);
    this.current.x += (raw.x - this.current.x) * alpha;
    this.current.y += (raw.y - this.current.y) * alpha;
    return { ...this.current };
  }
}
