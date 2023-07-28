import { ReportType } from '@/@types/enums'
import { useState } from 'react'

export function useForm(
  initialValue: number,
  type: ReportType | boolean = false,
) {
  const [value, setValue] = useState(initialValue || 0)

  function onchange(value: number) {
    if (type === ReportType.minutes && value >= 59) return
    setValue(value)
  }

  function inCrementValue() {
    if (type === ReportType.minutes && value >= 59) return

    setValue((previewValue) => previewValue + 1)
  }
  function decrementValue() {
    setValue((previewValue) => {
      if (previewValue > 0) return previewValue - 1
      return 0
    })
  }

  return { value, setValue, inCrementValue, decrementValue, onchange }
}
