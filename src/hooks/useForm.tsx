import { ReportType } from '@/@types/enums'
import { useCallback, useState } from 'react'

export function useForm(
  initialValue?: number,
  type: ReportType | boolean = false,
) {
  const [value, setvalue] = useState(initialValue || '')

  const setValue = useCallback((value) => {
    setvalue(value)
  }, [])

  function onchange(value: string) {
    if (type === ReportType.minutes && Number(value) >= 60) {
      return false
    } else {
      setvalue(Number(value))
    }
  }

  function inCrementValue() {
    if (type === ReportType.minutes && Number(value) >= 59) {
      return false
    } else {
      setvalue((previewValue) => Number(previewValue) + 1)
    }
  }
  function decrementValue() {
    setvalue((previewValue) => {
      if (Number(previewValue) > 1) return Number(previewValue) - 1
      return ''
    })
  }

  return { value, setValue, inCrementValue, decrementValue, onchange }
}
