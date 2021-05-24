import { clamp, interpolate, param } from '../util'

export const Color = ({ r = 0, g = 0, b = 0 } = {}) => ({ r, g, b })

export const hex = (color) => {
  const { red, green, blue } = rgb(color)

  return `#${comp(red)}${comp(green)}${comp(blue)}`
}

export const hsl = ({ r, g, b } = {}) => {
  const cmax = Math.max(r, g, b)
  const cmin = Math.min(r, g, b)
  const cdelta = cmax - cmin
  let hue = 0, saturation = 0, lightness = 0

  if (cdelta == 0) {
    hue = 0
  }
  else if (cmax == r) {
    hue = ((g - b) / cdelta) % 6
  }
  else if (cmax == g) {
    hue = ((b - r) / cdelta) + 2
  }
  else {
    hue = ((r - g) / cdelta) + 4
  }

  hue = Math.round(hue * 60)

  if (hue < 0) {
    hue += 360
  }

  lightness = (cmax + cmin) / 2

  if (cdelta == 0) {
    saturation = 0
  }
  else {
    saturation = cdelta / (1 - Math.abs(2 * lightness - 1))
  }

  saturation = +(saturation * 100).toFixed(1)
  lightness = +(lightness * 100).toFixed(1)

  return { hue, saturation, lightness }
}

export const rgb = ({ r, g, b } = {}) => ({
  red: clamp(0, 255, Math.round(r * 255)),
  green: clamp(0, 255, Math.round(g * 255)),
  blue: clamp(0, 255, Math.round(b * 255)),
})

export const cmyk = ({ r, g, b } = {}) => {
  const c = 1 - r
  const m = 1 - g
  const y = 1 - b
  const k = Math.min(c, m, y)

  return {
    cyan: clamp(0, 100, Math.round(param(k, 1, c) * 100)),
    magenta: clamp(0, 100, Math.round(param(k, 1, m) * 100)),
    yellow: clamp(0, 100, Math.round(param(k, 1, y) * 100)),
    key: clamp(0, 100, Math.round(k * 100)),
  }
}

export const fromRgb = ({ red = 0, green = 0, blue = 0 } = {}) =>
  Color({ r: red / 255, g: green / 255, b: blue / 255 })

export const fromHsl = ({ hue = 0, saturation = 0, lightness = 0 } = {}) => {
  const s = saturation / 100;
  const l = lightness / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((hue / 60) % 2 - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0

  if (0 <= hue && hue < 60) {
    r = c
    g = x
    b = 0
  } else if (60 <= hue && hue < 120) {
    r = x
    g = c
    b = 0
  } else if (120 <= hue && hue < 180) {
    r = 0
    g = c
    b = x
  } else if (180 <= hue && hue < 240) {
    r = 0
    g = x
    b = c
  } else if (240 <= hue && hue < 300) {
    r = x
    g = 0
    b = c
  } else if (300 <= hue && hue <= 360) {
    r = c
    g = 0
    b = x
  }

  return Color({ r: r + m, g: g + m, b: b + m })
}

export const fromCmyk = ({ cyan = 0, magenta = 0, yellow = 0, key = 0 } = {}) => {
  const c = clamp(0, 1, cyan / 100)
  const m = clamp(0, 1, magenta / 100)
  const y = clamp(0, 1, yellow / 100)
  const k = clamp(0, 1, key / 100)

  return Color({
    r: 1 - interpolate(k, 1, c),
    g: 1 - interpolate(k, 1, m),
    b: 1 - interpolate(k, 1, y),
  })
}

// Utils

const comp = (c) =>
  c.toString(16).toUpperCase().padStart(2, '0')
