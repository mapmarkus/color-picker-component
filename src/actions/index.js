import * as types from '../constants/ActionTypes'

export const showPicker = () => ({ type: types.SHOW_PICKER })
export const closePicker = () => ({ type: types.CLOSE_PICKER })
export const setColor = (color, sliders) => ({ type: types.SET_COLOR, color, sliders })
export const setSliders = (tab) => ({ type: types.SET_SLIDERS, tab })
