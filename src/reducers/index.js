import { Color } from '../data/color'
import * as tabs from '../constants/Tabs'
import {
  SHOW_PICKER,
  CLOSE_PICKER,
  SELECT_TAB,
  SET_COLOR,
} from '../constants/ActionTypes'

const initialState = {
  color: Color({ r: 0.5, g: 0.8, b: 0.8 }),
  editing: false,
  tab: tabs.RGB
}

export default (state = initialState, action) => {
  switch(action.type) {
    case SHOW_PICKER:
      return {...state, editing: true}

    case CLOSE_PICKER:
      return {...state, editing: false}

    case SELECT_TAB:
      return {...state, tab: action.tab}

    case SET_COLOR:
      return {...state, color: action.color}

    default:
      return state
  }
}
