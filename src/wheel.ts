// Pure wheel math. Slice i covers [i*seg, (i+1)*seg) degrees clockwise from the
// top pointer. Rotating the wheel by R degrees clockwise puts wheel angle a at a+R.

export const sliceAtPointer = (rotation: number, slices: number) => {
  const seg = 360 / slices;
  const a = (((-rotation) % 360) + 360) % 360; // wheel angle under the pointer
  return Math.floor(a / seg) % slices;
};

// Next rotation (always forward, several full turns) landing on `slice`.
// jitter in [-0.4, 0.4] of a slice keeps it off the centre line without crossing edges.
export const targetRotation = (current: number, slice: number, slices: number, turns: number, jitter: number) => {
  const seg = 360 / slices;
  const centre = (slice + 0.5 + jitter) * seg;
  const want = (((-centre - current) % 360) + 360) % 360; // extra forward degrees
  return current + turns * 360 + want;
};
