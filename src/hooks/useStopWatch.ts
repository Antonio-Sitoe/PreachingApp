import { useState, useRef } from 'react'

export function useStopWatch() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isTop, setIsStop] = useState(false)

  const startTimeRef = useRef(0)
  const interval = useRef<ReturnType<typeof setInterval>>()

  function formateTime(time: number) {
    const data = new Date(time)
    return data.toLocaleTimeString('pt-pt', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    })
  }

  function STOP_WATCH_TIMES(time: number) {
    const data = new Date(time)
    const hours = data.toLocaleTimeString('pt-pt', {
      hour12: false,
      hour: '2-digit',
      timeZone: 'UTC',
    })
    const minuts = data.toLocaleTimeString('pt-pt', {
      hour12: false,
      minute: '2-digit',
      timeZone: 'UTC',
    })
    const seconds = data.toLocaleTimeString('pt-pt', {
      hour12: false,
      second: '2-digit',
      timeZone: 'UTC',
    })
    return { hours, minuts, seconds }
  }

  function start() {
    if (!isRunning) {
      startTimeRef.current = Date.now() - time
      interval.current = setInterval(() => {
        setTime(() => Date.now() - startTimeRef.current)
      }, 1000)
      setIsRunning(true)
      setIsStop(false)
    }
  }

  function stop() {
    if (isRunning) {
      clearInterval(interval.current)
      setIsRunning(false)
      setIsStop(true)
      console.log('STOP')
      console.log({ isRunning, isTop })
    }
  }

  function reset() {
    clearInterval(interval.current)
    setTime(0)
    setIsRunning(false)
    setIsStop(false)
    console.log('Reset')
    console.log({ isRunning, isTop })
  }

  return {
    start,
    stop,
    reset,

    isTop,
    isRunning,

    time: formateTime(time),
    STOP_WATCH_TIMES: STOP_WATCH_TIMES(time),
  }
}
