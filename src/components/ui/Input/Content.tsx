import {} from 'lucide-react-native'
import { TextInputProps } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

interface InputContentProps extends TextInputProps {
  actions: boolean
}

export function Content({ actions }: InputContentProps) {
  return (
    <TextInput
      style={actions && { marginRight: 10 }}
      placeholder="Publicacoes"
      className="bg-ligtInputbG h-[47px] w-24 pl-3 pr-1 py-3 rounded-xl"
      keyboardType="numeric"
    />
  )
}
