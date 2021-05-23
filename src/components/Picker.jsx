import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classnames from 'classnames'
import { showPicker, closePicker, selectTab, setColor } from '../actions'
import { hex, fromRgb, rgb } from '../data/Color'
import * as tabs from '../constants/Tabs'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/outline'
import * as util from '../util'

export default function Picker() {
  const color = useSelector(state => state.color)
  const editing = useSelector(state => state.editing)
  const dispatch = useDispatch()

  const [tab, setTab] = useState(tabs.RGB)

  const selectors = () => {
    switch(tab) {
      case tabs.RGB:
        return <RGBPicker color={color} onColorChange={(color) => dispatch(setColor(color))}/>

      case tabs.HSL:
        return <HSLPicker />

      case tabs.CMYK:
        return <CMYKPicker />

      default:
        null
    }
  }

  return (
    <div className="relative">
      <div
        style={{ backgroundColor: hex(color) }}
        className="w-40 h-40 rounded overflow-hidden relative group"
      >
        <button
          className={classnames(
            "block w-full p-2 text-indigo-500 bg-white absolute left-0 bottom-0 transition transition-all duration-200 transform translate-y-full flex flex-col items-center focus:outline-none", {
              "group-hover:translate-y-0": !editing,
            }
          )}
          onClick={() => dispatch(showPicker())}
        >
          <ChevronUpIcon className="w-5 h-5" />
          <span className="uppercase text-xs font-medium">Pick Color</span>
        </button>
      </div>
      <div
        className={classnames(
          "absolute -top-1/2 left-1/2 transform -translate-x-1/2 transition transition-all duration-300 bg-white shadow-lg", {
            "translate-y-10 opacity-0 pointer-events-none": !editing
          }
        )}
      >
        <div className="flex items-stretch select-none">
          <Preview />
          <div className="flex flex-col items-stretch w-60">
            <nav className="flex px-2">
              <Tab tab={tabs.RGB} selected={tab == tabs.RGB} onSelect={setTab} />
              <Tab tab={tabs.HSL} selected={tab == tabs.HSL} onSelect={setTab} />
              <Tab tab={tabs.CMYK} selected={tab == tabs.CMYK} onSelect={setTab} />
            </nav>
            {selectors()}
          </div>
        </div>
        <button
          className="block w-full p-2 text-indigo-500 hover:bg-indigo-100 focus:outline-none flex flex-col items-center"
          onClick={() => dispatch(closePicker())}
        >
          <span className="uppercase text-xs font-medium">Close</span>
          <ChevronDownIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

const Preview = () =>
  <div className="w-40 bg-gray-200">
  </div>

const Tab = ({ tab, selected = False, onSelect }) => {
  return (
    <span
      className={classnames(
        "px-2 py-2 text-sm border-b-2 font-medium cursor-pointer", {
          "border-gray-500": selected,
          "border-white hover:border-gray-200": !selected,
        }
      )}
      tabIndex="1"
      onClick={() => onSelect(tab)}
    >
      {tab}
    </span>
  )
}

const RGBPicker = ({ color, onColorChange }) => {
  const rgbColor = rgb(color)

  const setComp = (comp) =>
    fromRgb({...rgbColor, ...comp})

  const entry = (name, slider) =>
    <div className="w-full space-y-1">
      <h4 className="font-medium text-sm">
        {name}
      </h4>
      {slider}
    </div>

  return (
    <div className="w-full p-4 space-y-4">
      {entry('Red', <Slider min={0} max={250} value={rgbColor.red} from={setComp({ red: 0 })} to={setComp({ red: 255 })} onChange={(r) => onColorChange(setComp({ red: r }))} />)}
      {entry('Green', <Slider min={0} max={250} value={rgbColor.green} from={setComp({ green: 0 })} to={setComp({ green: 255 })} onChange={(g) => onColorChange(setComp({ green: g }))} />)}
      {entry('Blue', <Slider min={0} max={250} value={rgbColor.blue} from={setComp({ blue: 0 })} to={setComp({ blue: 255 })} onChange={(b) => onColorChange(setComp({ blue: b }))} />)}
    </div>
  )
}

const HSLPicker = () =>
  <div></div>

const CMYKPicker = () =>
  <div></div>

const Slider = ({ min, max, value, from, to, onChange }) => {
  const sliderRef = useRef(null)
  const [ width, setWidth ] = useState(0)
  const [ dragging, setDragging ] = useState(false)
  const [ drag, setDrag ] = useState(null)

  const cancelDrag = () => {
    setDragging(false)
    setDrag(null)
  }
  const startDrag = (x) => {
    setDragging(true)
    setDrag([value, x, x])
  }
  const dragTo = (x) => setDrag([drag[0], drag[1], x])
  const getPostion = () => {
    if (dragging) {
      let [v, x0, x1] = drag
      const l = util.linearScale(min, max, 0, width, v)
      return util.clamp(0, width, l + x1 - x0)
    } else {
      return util.linearScale(min, max, 0, width, value)
    }
  }

  useEffect(() => {
    console.log('width')
    setWidth(sliderRef.current.offsetWidth)
  }, [width])

  useEffect(() => {
    if (dragging) {
      document.body.classList.add("cursor-[grabbing]")
      window.addEventListener('mouseup', cancelDrag)
    }
    else {
      document.body.classList.remove("cursor-[grabbing]")
      window.removeEventListener('mouseup', cancelDrag)
    }
  }, [dragging])

  useEffect(() => {
    if (drag) {
      let l = getPostion()
      onChange(util.linearScale(0, width, min, max, l))
    }
  }, [drag])

  return (
    <div
      ref={sliderRef}
      className="w-full h-5 relative"
      style={{ backgroundImage: `linear-gradient(to right, ${hex(from)}, ${hex(to)}`}}
      onMouseMove={dragging ? (e) => dragTo(e.pageX) : null}
    >
      <span
        className={classnames(
          "absolute top-1/2 transform -translate-y-1/2 w-2 -translate-x-1/2 h-2 hover:w-4 hover:h-4 rounded-full bg-white ring ring-inside ring-blue-200", {
            "cursor-[grab]": !dragging,
            "w-4 h-4": dragging,
          }
        )}
        style={{ left: getPostion() }}
        onMouseDown={dragging ? null : (e) => startDrag(e.pageX)}
      ></span>
    </div>
  )
}
