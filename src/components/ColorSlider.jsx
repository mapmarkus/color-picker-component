import React, { useEffect, useState, useRef } from 'react'
import classnames from 'classnames'
import { hex } from '../data/Color'
import * as util from '../util'

export default function Slider({ min, max, value, toColor, update, stops = [], onChange }) {
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
      onChange(update(util.linearScale(0, width, min, max, l)))
    }
  }, [drag])

  return (
    <div
      ref={sliderRef}
      className="w-full h-5 relative"
      style={{ backgroundImage: `linear-gradient(to right, ${[min, ...stops, max].map((c) => hex(toColor(update(c)))).join(",")}` }}
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
