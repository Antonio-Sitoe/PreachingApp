import { ReportType } from '@/@types/enums'
import { useState } from 'react'

export function useForm(
  initialValue: number | string,
  type: ReportType | boolean = false,
) {
  const [value, setValue] = useState(initialValue || '')

  function onchange(value: number) {
    if (type === ReportType.minutes && value >= 59) return
    setValue(value)
  }

  function inCrementValue() {
    if (typeof value === 'number') {
      if (type === ReportType.minutes && value >= 59) return

      setValue((previewValue) => Number(previewValue) + 1)
    }
  }
  function decrementValue() {
    setValue((previewValue) => {
      if (Number(previewValue) > 0) return Number(previewValue) - 1
      return ''
    })
  }

  return { value, setValue, inCrementValue, decrementValue, onchange }
}
