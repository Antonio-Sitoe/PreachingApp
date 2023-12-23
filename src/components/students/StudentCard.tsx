import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import Person from '@/assets/images/Person.svg'

import TouchableOpacity, { View, Text } from '@/components/Themed'
import { Ionicons } from '@expo/vector-icons'

interface StudentCardProps {
  data: any
  onViewProfile: () => void
  onAddVisit: () => void
}
function StudentCard({ data, onViewProfile, onAddVisit }: StudentCardProps) {
  const { isDark } = useTheme()

  return (
    <View className="flex-row w-full mb-5 shadow" lightColor="transparent">
      <View
        className="flex-1 rounded-lg"
        lightColor="white"
        darkColor={Colors.dark.darkBgSecundary}
        style={{
          elevation: 5,
        }}
      >
        <TouchableOpacity
          onPress={onViewProfile}
          className="flex-row p-4 items-center justify-between rounded-lg"
          lightColor="white"
          darkColor={Colors.dark.darkBgSecundary}
        >
          <View
            darkColor="#FBEEBC"
            className="w-14 h-14 mr-2 rounded-lg flex items-center justify-center"
          >
            <Person width={48} height={48} />
          </View>
          <View lightColor="transparent" darkColor="transparent">
            <Text className="bg-none text-lg font-textIBM">
              Antonio Manuel Sitoe
            </Text>
            <Text className="break-words font-textIBM flex-wrap w-52 text-[#717171]">
              Machava-sede dsdsfhgfhdsg
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className="w-[56px] h-auto ml-2 flex flex-col">
        <TouchableOpacity
          onPress={onAddVisit}
          style={{
            backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
            elevation: 10,
          }}
          className="w-full h-24 rounded-lg flex items-center justify-center dark:bg-black"
        >
          <Ionicons color="white" name="add" size={32} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
export { StudentCard }
