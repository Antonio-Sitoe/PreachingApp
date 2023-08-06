import { View, Text, TouchableOpacity } from 'react-native'
import React, { useRef } from 'react'
import { Modalize } from 'react-native-modalize'

export default function ReportMonths() {
  const modalizeRef = useRef<Modalize>(null)

  const onOpen = () => {
    modalizeRef.current?.open()
  }
  return (
    <View
      style={{
        backgroundColor: '#F6F6F9',
      }}
      className="flex-1"
    >
      <TouchableOpacity onPress={onOpen} className="w-full h-4 bg-red-600">
        <Text>Open the modal</Text>
      </TouchableOpacity>
      <Text>ReportMonths</Text>
      <Modalize ref={modalizeRef}>
        <Text>...your content</Text>
      </Modalize>
    </View>
  )
}
