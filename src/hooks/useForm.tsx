import { ReportType } from '@/@types/enums'
import { useState } from 'react'

export function useForm(
  initialValue: number,
  type: ReportType | boolean = false,
) {
  const [value, setValue] = useState(initialValue || '')

  function onchange(value: string) {
    if (type === ReportType.minutes && Number(value) >= 60) {
      return false
    } else {
      setValue(Number(value))
    }
  }

  function inCrementValue() {
    if (type === ReportType.minutes && Number(value) >= 59) {
      return false
    } else {
      setValue((previewValue) => Number(previewValue) + 1)
    }
  }
  function decrementValue() {
    setValue((previewValue) => {
      if (Number(previewValue) > 1) return Number(previewValue) - 1
      return ''
    })
  }

  return { value, setValue, inCrementValue, decrementValue, onchange }
}
