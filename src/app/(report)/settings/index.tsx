import { Text, Button, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { reportsAction, studentsAction } from '@/database/actions';

export default function Settings() {
  return (
    <SafeAreaView className="px-5 mt-5">
      <Text>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id dolor eum
        aspernatur exercitationem, ut, recusandae dolorum repellendus ipsa
        quisquam laborum natus quod sunt nulla laboriosam odio consequuntur
        quaerat maiores labore.
      </Text>
      <Button title="RESET ALL DATA" onPress={reportsAction.resetAll} />
      <View className="my-2" />
      <Button
        title="GENERATE REPORT DATA"
        onPress={reportsAction.generateReports}
      />
      <View className="my-2" />
      <Button
        title="GENERATE STUDENTS DATA"
        onPress={() => {
          studentsAction.generateMassData(10);
        }}
      />
      <View className="my-2" />
      <Button
        title="LIST REPORT DATA"
        onPress={reportsAction.getAllReportData}
      />
    </SafeAreaView>
  );
}
