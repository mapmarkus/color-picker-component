import { clamp } from '../util'

export const Color = ({ r = 0, g = 0, b = 0 } = {}) => ({ r, g, b })

export const hex = (color) => {
  const { red, green, blue } = rgb(color)

  return `#${comp(red)}${comp(green)}${comp(blue)}`
}

export const hsl = (color) => ({ hue: 0, saturation: 0, lightness: 0 })

export const rgb = ({ r, g, b } = {}) => ({
  red: clamp(0, 255, Math.round(r * 255)),
  green: clamp(0, 255, Math.round(g * 255)),
  blue: clamp(0, 255, Math.round(b * 255)),
})

export const cmyk = (color) => ({ cyan: 0, magenta: 0, yellow: 0, black: 0 })

export const fromRgb = ({ red = 0, green = 0, blue = 0 } = {}) =>
  Color({ r: red / 255, g: green / 255, b: blue / 255 })


// Utils

const comp = (c) =>
  c.toString(16).toUpperCase().padStart(2, '0')
