import * as types from '../constants/ActionTypes'

export const showPicker = () => ({ type: types.SHOW_PICKER })
export const closePicker = () => ({ type: types.CLOSE_PICKER })
export const selectTab = (tab) => ({ type: types.SELECT_TAB, tab })
export const setColor = (color) => ({ type: types.SET_COLOR, color })
