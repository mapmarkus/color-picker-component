import { SHOW_PICKER, CLOSE_PICKER } from '../constants/ActionTypes'

const initialState = {
  editing: false,
}

export default function(state = false, action) {
  switch(action.type) {
    case SHOW_PICKER:
      return true

    case CLOSE_PICKER:
      return false

    default:
      return state
  }
}
