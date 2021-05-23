import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classnames from 'classnames'
import { setColor } from '../actions'
import { hex, fromRgb, rgb, rgbString, fromHsl, hsl, hslString } from '../data/Color'
import * as tabs from '../constants/Tabs'
import * as util from '../util'

export default function Picker() {
  const color = useSelector(state => state.color)
  const dispatch = useDispatch()

  const [tab, setTab] = useState(tabs.RGB)

  const selectors = () => {
    switch(tab) {
      case tabs.RGB:
        return <RGBPicker color={color} onColorChange={(color) => dispatch(setColor(color))} />

      case tabs.HSL:
        return <HSLPicker color={color} onColorChange={(color) => dispatch(setColor(color))} />

      case tabs.CMYK:
        return <CMYKPicker />

      default:
        null
    }
  }

  return (
    <div className="flex items-stretch">
      <Preview color={color}/>
      <div className="flex flex-col items-stretch w-60 select-none">
        <nav className="flex px-2">
          <Tab tab={tabs.RGB} selected={tab == tabs.RGB} onSelect={setTab} />
          <Tab tab={tabs.HSL} selected={tab == tabs.HSL} onSelect={setTab} />
          <Tab tab={tabs.CMYK} selected={tab == tabs.CMYK} onSelect={setTab} />
        </nav>
        {selectors()}
      </div>
    </div>
  )
}

const Preview = ({ color }) =>
  <div className="flex flex-col w-60 p-4 bg-gray-200 space-y-4">
    <div className="flex flex-grow justify-center items-center">
      <div
        className="w-20 h-20 rounded-full"
        style={{ background: hex(color) }}
      >
      </div>
    </div>
    <div className="bg-white p-1 rounded-sm text-sm">{hex(color)}</div>
    <div className="bg-white p-1 rounded-sm text-sm">{rgbString(color)}</div>
    <div className="bg-white p-1 rounded-sm text-sm">{hslString(color)}</div>
  </div>

const Tab = ({ tab, selected, onSelect }) => {
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

  return (
    <div className="w-full p-4 space-y-4">
      <Entry name="Red">
        <Slider min={0} max={255} value={rgbColor.red} colorStop={(r) => setComp({ red: r })} onChange={onColorChange} />
      </Entry>
      <Entry name="Green">
        <Slider min={0} max={255} value={rgbColor.green} colorStop={(g) => setComp({ green: g })} onChange={onColorChange} />
      </Entry>
      <Entry name="Blue">
        <Slider min={0} max={255} value={rgbColor.blue} colorStop={(b) => setComp({ blue: b })} onChange={onColorChange} />
      </Entry>
    </div>
  )
}

const HSLPicker = ({ color, onColorChange }) => {
  const hslColor = hsl(color)

  const setComp = (comp) =>
    fromHsl({...hslColor, ...comp})

  return (
    <div className="w-full p-4 space-y-4">
      <Entry name="Hue">
        <Slider min={0} max={360} value={hslColor.hue} colorStop={(h) => setComp({ hue: h })} stops={[60, 120, 180, 240, 300]} onChange={onColorChange} />
      </Entry>
      <Entry name="Saturation">
        <Slider min={0} max={100} value={hslColor.saturation} colorStop={(s) => setComp({ saturation: s })} onChange={onColorChange} />
      </Entry>
      <Entry name="Lightness">
        <Slider min={0} max={100} value={hslColor.lightness} colorStop={(l) => setComp({ lightness: l })} stops={[50]} onChange={onColorChange} />
      </Entry>
    </div>
  )
}

const CMYKPicker = () =>
  <div></div>

const Entry = ({ name, children }) =>
  <div className="w-full space-y-1">
    <h4 className="font-medium text-sm">
      {name}
    </h4>
    {children}
  </div>

const Slider = ({ min, max, value, colorStop, stops = [], onChange }) => {
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
      onChange(colorStop(util.linearScale(0, width, min, max, l)))
    }
  }, [drag])

  return (
    <div
      ref={sliderRef}
      className="w-full h-5 relative"
      style={{ backgroundImage: `linear-gradient(to right, ${[min, ...stops, max].map(colorStop).map(hex).join(",")}` }}
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
