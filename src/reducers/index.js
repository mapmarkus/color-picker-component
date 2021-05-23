import { Color } from '../data/color'
import * as tabs from '../constants/Tabs'
import { combineReducers } from 'redux'
import color from './color'
import editing from './editing'

export default combineReducers({
  color,
  editing,
})
