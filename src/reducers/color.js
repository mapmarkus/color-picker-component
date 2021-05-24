import { SET_COLOR, SET_SLIDERS } from '../constants/ActionTypes'
import { Color, rgb, hsl, cmyk } from '../data/Color'
import * as tabs from '../constants/tabs'

export const initialColor = Color({ r: 0.5, g: 0.8, b: 0.8 })

export const initialState = {
  value: initialColor,
  mode: tabs.RGB,
  sliders: rgb(initialColor)
}

export default function(state = initialState, action) {
  switch(action.type) {
    case SET_COLOR:
      return {value: action.color, mode: state.mode, sliders: action.sliders}

    case SET_SLIDERS:
      switch (action.tab) {
        case tabs.RGB:
          return {value: state.value, mode: tabs.RGB, sliders: rgb(state.value)}

        case tabs.HSL:
          return {value: state.value, mode: tabs.HSL, sliders: hsl(state.value)}

        case tabs.CMYK:
          return {value: state.value, mode: tabs.CMYK, sliders: cmyk(state.value)}

        default:
          return state
      }

    default:
      return state
  }
}
