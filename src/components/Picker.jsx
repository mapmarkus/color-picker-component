import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classnames from 'classnames'
import { setColor, setSliders } from '../actions'
import {
  hex,
  fromRgb, rgb,
  fromHsl, hsl,
  fromCmyk, cmyk,
} from '../data/Color'
import * as tabs from '../constants/Tabs'
import ColorSlider from './ColorSlider'
import { clamp } from '../util'

export default function Picker() {
  const sliders = useSelector(state => state.color.sliders)
  const tab = useSelector(state => state.color.mode)
  const dispatch = useDispatch()

  let colorSliders

  switch(tab) {
    case tabs.RGB:
      colorSliders = <RGBPicker sliders={sliders} onChange={(sliders) => dispatch(setColor(fromRgb(sliders), sliders))} />
      break

    case tabs.HSL:
      colorSliders = <HSLPicker sliders={sliders} onChange={(sliders) => dispatch(setColor(fromHsl(sliders), sliders))} />
      break

    case tabs.CMYK:
      colorSliders = <CMYKPicker sliders={sliders} onChange={(sliders) => dispatch(setColor(fromCmyk(sliders), sliders))} />
      break
  }

  return (
    <div className="flex items-stretch">
      <Preview mode={tab} sliders={sliders}/>
      <div className="flex flex-col items-stretch w-60 select-none">
        <nav className="flex px-2">
          <Tab tab={tabs.RGB} selected={tab == tabs.RGB} onSelect={() => dispatch(setSliders(tabs.RGB))} />
          <Tab tab={tabs.HSL} selected={tab == tabs.HSL} onSelect={() => dispatch(setSliders(tabs.HSL))} />
          <Tab tab={tabs.CMYK} selected={tab == tabs.CMYK} onSelect={() => dispatch(setSliders(tabs.CMYK))} />
        </nav>
        {colorSliders}
      </div>
    </div>
  )
}

const Preview = ({ mode, sliders }) => {
  let color
  let rgbSliders
  let hslSliders
  let cmykSliders

  switch(mode) {
    case tabs.RGB:
      color = fromRgb(sliders)
      rgbSliders = sliders
      hslSliders = hsl(color)
      cmykSliders = cmyk(color)
      break

    case tabs.HSL:
      color = fromHsl(sliders)
      rgbSliders = rgb(color)
      hslSliders = sliders
      cmykSliders = cmyk(color)
      break

    case tabs.CMYK:
      color = fromCmyk(sliders)
      rgbSliders = rgb(color)
      hslSliders = hsl(color)
      cmykSliders = sliders
      break
  }

  return (
    <div className="flex flex-col justify-start w-60 p-4 bg-gray-200 space-y-4">
      <div className="flex justify-center items-center">
        <div
          className="w-20 h-20 rounded-full"
          style={{ background: hex(color) }}
        >
        </div>
      </div>
      <div className="bg-white p-1 rounded-sm text-sm">{hex(color)}</div>
      <div className="bg-white p-1 rounded-sm text-sm">{rgbString(rgbSliders)}</div>
      <div className="bg-white p-1 rounded-sm text-sm">{hslString(hslSliders)}</div>
      <div className="bg-white p-1 rounded-sm text-sm">{cmykString(cmykSliders)}</div>
    </div>
  )
}

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

const RGBPicker = ({ sliders, onChange }) => {
  const setComp = (comp) => ({...sliders, ...comp})

  return (
    <div className="w-full p-4 space-y-4">
      <Entry name="Red">
        <ColorSlider min={0} max={255} value={sliders.red} toColor={fromRgb} update={(r) => setComp({ red: r })} onChange={onChange} />
      </Entry>
      <Entry name="Green">
        <ColorSlider min={0} max={255} value={sliders.green} toColor={fromRgb} update={(g) => setComp({ green: g })} onChange={onChange} />
      </Entry>
      <Entry name="Blue">
        <ColorSlider min={0} max={255} value={sliders.blue} toColor={fromRgb} update={(b) => setComp({ blue: b })} onChange={onChange} />
      </Entry>
    </div>
  )
}

const HSLPicker = ({ sliders, onChange }) => {
  const setComp = (comp) => ({...sliders, ...comp})

  return (
    <div className="w-full p-4 space-y-4">
      <Entry name="Hue">
        <ColorSlider min={0} max={360} value={sliders.hue} toColor={fromHsl} update={(h) => setComp({ hue: h })} stops={[60, 120, 180, 240, 300]} onChange={onChange} />
      </Entry>
      <Entry name="Saturation">
        <ColorSlider min={0} max={100} value={sliders.saturation} toColor={fromHsl} update={(s) => setComp({ saturation: s })} onChange={onChange} />
      </Entry>
      <Entry name="Lightness">
        <ColorSlider min={0} max={100} value={sliders.lightness} toColor={fromHsl} update={(l) => setComp({ lightness: l })} stops={[50]} onChange={onChange} />
      </Entry>
    </div>
  )
}

const CMYKPicker = ({ sliders, onChange }) => {
  const setComp = (comp) => ({...sliders, ...comp})

  return (
    <div className="w-full p-4 space-y-4">
      <Entry name="Cyan">
        <ColorSlider min={0} max={100} value={sliders.cyan} toColor={fromCmyk} update={(c) => setComp({ cyan: c })} onChange={onChange} />
      </Entry>
      <Entry name="Magenta">
        <ColorSlider min={0} max={100} value={sliders.magenta} toColor={fromCmyk} update={(m) => setComp({ magenta: m })} onChange={onChange} />
      </Entry>
      <Entry name="Yellow">
        <ColorSlider min={0} max={100} value={sliders.yellow} toColor={fromCmyk} update={(y) => setComp({ yellow: y })} onChange={onChange} />
      </Entry>
      <Entry name="Key">
        <ColorSlider min={0} max={100} value={sliders.key} toColor={fromCmyk} update={(k) => setComp({ key: k })} onChange={onChange} />
      </Entry>
    </div>
  )
}

const Entry = ({ name, children }) =>
  <div className="w-full space-y-1">
    <h4 className="font-medium text-sm">
      {name}
    </h4>
    {children}
  </div>


// Utils
const roundValue = (max, x) =>
  clamp(0, max, Math.round(x))

const rgbString = ({ red, green, blue }) => {
  red = roundValue(255, red)
  green = roundValue(255, green)
  blue = roundValue(255, blue)
  return `rgb(${red}, ${green}, ${blue})`
}

const hslString = ({ hue, saturation, lightness }) => {
  hue = roundValue(360, hue)
  saturation = roundValue(100, saturation)
  lightness = roundValue(100, lightness)
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

const cmykString = ({ cyan, magenta, yellow, key }) => {
  cyan = roundValue(100, cyan)
  magenta = roundValue(100, magenta)
  yellow = roundValue(100, yellow)
  key = roundValue(100, key)
  return `cmyk(${cyan}, ${magenta}, ${yellow}, ${key})`
}
