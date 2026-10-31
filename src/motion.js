/**
 * Four-frame, three-direction walking atlas state.
 *
 * Rows: 0 = front/down, 1 = right (mirror for left), 2 = back/up.
 * Columns: 0..3 = one complete alternating-foot walking cycle.
 * Pass actual movement after collision/path resolution, not requested movement.
 *
 * let gait = createGait();
 * gait = updateGait(gait, player.x - previous.x, player.y - previous.y, dt);
 * // atlas column = gait.frame; row = gait.row; mirror = gait.flip
 *
 * Functions do not touch the DOM and do not mutate their arguments.
 */

const finite = (value, fallback = 0) => Number.isFinite(value) ? value : fallback;
const EPSILON = 0.001;
const TURN_RATIO = 1.35;

export function createGait(options = {}) {
  const cycleLength = Math.max(8, finite(options.cycleLength, 76));
  const bobAmplitude = Math.max(0, Math.min(2, finite(options.bobAmplitude, 0.8)));
  return {
    cycleLength,
    bobAmplitude,
    distance: 0,
    frame: 0,
    row: 0,
    flip: false,
    moving: false,
    bob: 0,
  };
}

export function updateGait(gait, dx, dy, dt = 1 / 60) {
  // dt remains part of the API so callers can use the same frame inputs as
  // movement. Phase intentionally follows distance, independent of frame rate.
  const next = { ...gait };
  dx = finite(dx);
  dy = finite(dy);
  if (!Number.isFinite(dt) || dt < 0) {
    dx = 0;
    dy = 0;
  }
  const travelled = Math.hypot(dx, dy);
  if (travelled < EPSILON) {
    return { ...next, distance: 0, frame: 0, moving: false, bob: 0 };
  }

  const horizontal = Math.abs(dx);
  const vertical = Math.abs(dy);
  const wasHorizontal = next.row === 1;
  // A 45-degree path keeps its existing axis. Switching axes requires clear
  // dominance, avoiding front/side flicker at tiny A* staircase corners.
  const useHorizontal = wasHorizontal
    ? !(vertical > horizontal * TURN_RATIO)
    : horizontal > vertical * TURN_RATIO;

  if (useHorizontal) {
    next.row = 1;
    next.flip = dx < 0;
  } else {
    next.row = dy < 0 ? 2 : 0;
    next.flip = false;
  }

  next.distance = (finite(gait.distance) + travelled) % next.cycleLength;
  const phase = next.distance / next.cycleLength;
  next.frame = Math.min(3, Math.floor(phase * 4));
  next.moving = true;
  next.bob = -next.bobAmplitude * Math.abs(Math.sin(phase * Math.PI * 2));
  return next;
}

/** Smooth start/stop speed in world units per second. */
export function moveSpeed(currentSpeed, wantsMove, dt, options = {}) {
  const maxSpeed = Math.max(0, finite(options.maxSpeed, 165));
  const acceleration = Math.max(0, finite(options.acceleration, 1150));
  const deceleration = Math.max(0, finite(options.deceleration, 1600));
  const elapsed = Math.max(0, Math.min(0.1, finite(dt)));
  const current = Math.max(0, Math.min(maxSpeed, finite(currentSpeed)));
  const target = wantsMove ? maxSpeed : 0;
  const delta = (wantsMove ? acceleration : deceleration) * elapsed;
  return target > current
    ? Math.min(target, current + delta)
    : Math.max(target, current - delta);
}
