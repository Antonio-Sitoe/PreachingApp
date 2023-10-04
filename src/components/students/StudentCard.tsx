/* eslint-disable @typescript-eslint/ban-ts-comment */
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import Person from '@/assets/images/Person.svg'

import TouchableOpacity, { View, Text } from '@/components/Themed'
import { Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

function StudentCard({ data }) {
  const { isDark } = useTheme()

  return (
    <View className="flex-row w-full mb-5" lightColor="transparent">
      <View
        className="flex-1 rounded-lg"
        lightColor="white"
        darkColor={Colors.dark.darkBgSecundary}
        style={{
          shadowOffset: { width: -2, height: 4 },
          shadowColor: '#171717',
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}
      >
        <Link
          // @ts-ignore
          href={{
            pathname: '/modal',
            params: { id: '' },
          }}
          asChild
        >
          <TouchableOpacity
            className="flex-row p-4 items-start justify-between rounded-lg"
            lightColor="white"
            darkColor={Colors.dark.darkBgSecundary}
            style={{
              shadowColor: '#171717',
              shadowOffset: { width: -2, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
            }}
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
        </Link>
      </View>
      <View className="w-[56px] h-auto ml-2 flex flex-col">
        <Link
          // @ts-ignore
          href={{
            pathname: '/modal',
            params: {},
          }}
          asChild
        >
          <TouchableOpacity
            style={{
              backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
            }}
            className="w-full h-24 rounded-lg flex items-center justify-center dark:bg-black"
          >
            <Ionicons color="white" name="add" size={32} />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  )
}
export { StudentCard }
