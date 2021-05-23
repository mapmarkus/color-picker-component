export const param = (x0, x1, x) => {
  if (x0 == x1) {
    return 0
  }
  else {
    return ((x - x0) / (x1 - x0))
  }
}

export const interpolate = (x0, x1, t) =>
  x0 + (x1 - x0) * t

export const linearScale = (xMin, xMax, yMin, yMax, x) =>
  interpolate(yMin, yMax, param(xMin, xMax, x))

export const clamp = (min, max, x) =>
  Math.max(min, Math.min(max, x))
