import { Text, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RESET_ALL_REPORT_DATA } from '@/database/actions/report/delete'

export default function Settings() {
  return (
    <SafeAreaView className="px-5 mt-5">
      <Text>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id dolor eum
        aspernatur exercitationem, ut, recusandae dolorum repellendus ipsa
        quisquam laborum natus quod sunt nulla laboriosam odio consequuntur
        quaerat maiores labore.
      </Text>
      <Button title="RESET ALL DATA" onPress={RESET_ALL_REPORT_DATA} />
    </SafeAreaView>
  )
}
