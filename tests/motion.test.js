import test from 'node:test';
import assert from 'node:assert/strict';
import { createGait, updateGait, moveSpeed } from '../src/motion.js';

test('walk cycle advances with actual distance, independently of frame rate', () => {
  const first = createGait({ cycleLength: 80 });
  let fine = first;
  let coarse = createGait({ cycleLength: 80 });
  for (let i = 0; i < 60; i++) fine = updateGait(fine, 2, 0, 1 / 60);
  for (let i = 0; i < 30; i++) coarse = updateGait(coarse, 4, 0, 1 / 30);
  assert.equal(fine.frame, 2);
  assert.equal(coarse.frame, fine.frame);
  assert.equal(coarse.distance, fine.distance);
  assert.equal(first.distance, 0, 'the original state is not mutated');
});

test('all four poses are used over one stride', () => {
  let gait = createGait({ cycleLength: 80 });
  const frames = [];
  for (let i = 0; i < 4; i++) {
    gait = updateGait(gait, 20, 0, 0.1);
    frames.push(gait.frame);
  }
  assert.deepEqual(frames, [1, 2, 3, 0]);
});

test('front, right, left and rear map to the atlas rows and mirroring', () => {
  const forward = updateGait(createGait(), 0, 2, 1 / 60);
  const right = updateGait(forward, 2, 0, 1 / 60);
  const left = updateGait(right, -2, 0, 1 / 60);
  const rear = updateGait(left, 0, -2, 1 / 60);
  assert.equal(forward.row, 0);
  assert.equal(right.row, 1);
  assert.equal(right.flip, false);
  assert.equal(left.row, 1);
  assert.equal(left.flip, true);
  assert.equal(rear.row, 2);
  assert.equal(rear.flip, false);
});

test('near-diagonal path noise keeps the current facing axis', () => {
  let side = updateGait(createGait(), 2, 0, 1 / 60);
  let front = createGait();
  for (let i = 0; i < 20; i++) {
    const dx = i % 2 ? 1.05 : 0.95;
    side = updateGait(side, dx, 1, 1 / 60);
    front = updateGait(front, dx, 1, 1 / 60);
    assert.equal(side.row, 1);
    assert.equal(front.row, 0);
  }
  side = updateGait(side, 0.3, 2, 1 / 60);
  assert.equal(side.row, 0, 'clear vertical turn switches the axis');
});

test('standing or a blocked step rests at frame zero and preserves facing', () => {
  let gait = updateGait(createGait(), 0, -25, 0.1);
  assert.notEqual(gait.frame, 0);
  gait = updateGait(gait, 0, 0, 0.1);
  assert.equal(gait.frame, 0);
  assert.equal(gait.row, 2);
  assert.equal(gait.moving, false);
  assert.equal(gait.bob, 0);
  assert.equal(gait.distance, 0);
});

test('body lift is subtle and invalid frame data does not corrupt state', () => {
  let gait = createGait();
  for (let i = 0; i < 100; i++) {
    gait = updateGait(gait, 2, 0.1, 1 / 60);
    assert.ok(gait.bob >= -0.8 && gait.bob <= 0);
  }
  gait = updateGait(gait, Infinity, NaN, -1);
  assert.equal(gait.moving, false);
  assert.ok(Number.isFinite(gait.bob));
});

test('speed ramps smoothly, stops cleanly and handles invalid input', () => {
  let speed = moveSpeed(0, true, 1 / 60);
  assert.ok(speed > 0 && speed < 165);
  for (let i = 0; i < 20; i++) speed = moveSpeed(speed, true, 1 / 60);
  assert.equal(speed, 165);
  const braking = moveSpeed(speed, false, 1 / 60);
  assert.ok(braking > 0 && braking < speed);
  for (let i = 0; i < 20; i++) speed = moveSpeed(speed, false, 1 / 60);
  assert.equal(speed, 0);
  assert.equal(moveSpeed(0, true, NaN), 0);
  assert.equal(moveSpeed(Infinity, false, 1 / 60), 0);
});
