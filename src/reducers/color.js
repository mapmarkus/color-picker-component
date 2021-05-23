import { SET_COLOR } from '../constants/ActionTypes'
import { Color } from '../data/color'

const initialState = Color({ r: 0.5, g: 0.8, b: 0.8 })

export default function(state = initialState, action) {
  switch(action.type) {
    case SET_COLOR:
      return action.color

    default:
      return state
  }
}
