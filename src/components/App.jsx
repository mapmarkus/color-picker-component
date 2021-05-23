import React from 'react'
import { useSelector } from 'react-redux'
import { hex } from '../data/Color'
import Picker from './Picker'

export default function App() {
  const color = useSelector(state => state.color)

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center space-y-2 bg-yellow-100">
      <Picker />
      <div className="font-medium">
        {hex(color)}
      </div>
    </div>
  )
}
