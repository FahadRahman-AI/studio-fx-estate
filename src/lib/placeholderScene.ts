/**
 * Procedural stand-in for the FPV footage: a camera flying through a
 * sequence of doorways towards a lit terrace opening. Drawn directly from
 * scroll progress, so it scrubs exactly like the real image sequence will.
 */

const HALF_WIDTH = 1.8;
const FLOOR = 1.1;
const CEILING = -1.5;
const PORTALS = [3, 6, 9, 12, 15, 18];
const END_Z = 20.5;
const TRAVEL = 18.2;

const LINE = "255, 255, 255";
const GLOW = "255, 255, 255";

export function drawWalkthrough(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  progress: number,
) {
  const camZ = progress * TRAVEL;
  const f = h * 0.85;
  const cx = w / 2 + Math.sin(progress * Math.PI * 2) * w * 0.012;
  const cy = h * 0.5 + Math.sin(progress * Math.PI * 7) * h * 0.004;

  const project = (x: number, y: number, z: number) => {
    const dz = Math.max(z - camZ, 0.05);
    const s = f / dz;
    return [cx + x * s, cy + y * s, s] as const;
  };
  const depthAlpha = (z: number) => Math.max(0, Math.min(1, 1 - (z - camZ) / 16));

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, w, h);

  // Terrace opening: daylight that brightens as the camera approaches.
  const approach = Math.min(1, Math.max(0, (progress - 0.55) / 0.45));
  const [ox0, oy0] = project(-HALF_WIDTH, CEILING, END_Z);
  const [ox1, oy1] = project(HALF_WIDTH, FLOOR, END_Z);
  const horizon = oy0 + (oy1 - oy0) * 0.62;
  const sky = ctx.createLinearGradient(0, oy0, 0, oy1);
  sky.addColorStop(0, `rgba(${LINE}, ${0.1 + approach * 0.35})`);
  sky.addColorStop(0.62, `rgba(${GLOW}, ${0.25 + approach * 0.55})`);
  sky.addColorStop(1, `rgba(51, 51, 51, ${0.6 + approach * 0.4})`);
  ctx.fillStyle = sky;
  ctx.fillRect(ox0, oy0, ox1 - ox0, oy1 - oy0);
  ctx.strokeStyle = `rgba(${LINE}, ${0.35 + approach * 0.4})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ox0, horizon);
  ctx.lineTo(ox1, horizon);
  ctx.stroke();

  // Light spilling across the floor from the opening.
  const [, floorY] = project(0, FLOOR, camZ + 1.2);
  const pool = ctx.createRadialGradient(cx, oy1, 0, cx, oy1, Math.max(w, h) * 0.7);
  pool.addColorStop(0, `rgba(${GLOW}, ${0.12 + approach * 0.18})`);
  pool.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = pool;
  ctx.fillRect(0, oy1, w, Math.max(0, floorY - oy1));

  // Floorboards: longitudinal lines converge, transverse lines pass under.
  ctx.lineWidth = 1;
  for (let x = -HALF_WIDTH; x <= HALF_WIDTH + 0.01; x += 0.45) {
    const [x0, y0] = project(x, FLOOR, camZ + 0.4);
    const [x1, y1] = project(x, FLOOR, END_Z);
    ctx.strokeStyle = `rgba(${LINE}, 0.07)`;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
  for (let z = Math.ceil(camZ * 2) / 2; z < END_Z; z += 0.5) {
    if (z - camZ < 0.4) continue;
    const [x0, y0] = project(-HALF_WIDTH, FLOOR, z);
    const [x1] = project(HALF_WIDTH, FLOOR, z);
    ctx.strokeStyle = `rgba(${LINE}, ${0.06 * depthAlpha(z)})`;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y0);
    ctx.stroke();
  }

  // Wall/ceiling corner lines.
  ctx.strokeStyle = `rgba(${LINE}, 0.12)`;
  for (const [x, y] of [
    [-HALF_WIDTH, FLOOR],
    [HALF_WIDTH, FLOOR],
    [-HALF_WIDTH, CEILING],
    [HALF_WIDTH, CEILING],
  ]) {
    const [x0, y0] = project(x, y, camZ + 0.4);
    const [x1, y1] = project(x, y, END_Z);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }

  // Doorways, far to near so nearer frames overlap.
  for (let i = PORTALS.length - 1; i >= 0; i--) {
    const z = PORTALS[i];
    if (z - camZ < 0.15) continue;
    const [x0, y0, s] = project(-HALF_WIDTH * 0.82, CEILING * 0.78, z);
    const [x1, y1] = project(HALF_WIDTH * 0.82, FLOOR, z);
    const alpha = depthAlpha(z);
    ctx.strokeStyle = `rgba(${LINE}, ${0.55 * alpha})`;
    ctx.lineWidth = Math.max(1, s * 0.035);
    ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
  }

  // Vignette to seat the overlay type.
  const vignette = ctx.createRadialGradient(cx, cy, h * 0.2, cx, cy, Math.max(w, h) * 0.75);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.85)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}
