import { Text, View } from '@/components/Themed';
import { AnimatedButtonWithText } from '@/components/ui/ButtonAnimatedV2';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import Person from '@/assets/images/Person.svg';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import Woman from '@/assets/images/Woman.svg';
import { TouchableOpacity, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { StudentAbout } from '@/components/students/StudentAbout';
import { StudentsVisits } from '@/components/students/StudentsVisits';
import { studentsAction, type Student } from '@/database/actions';
import { ActivityIndicator } from 'react-native';
import { visitsAction } from '@/database/actions';
import { useIsFocused } from '@react-navigation/native';
import { BackButton } from '@/components/ui/BackButton';
import { useQuery } from '@tanstack/react-query';

const renderTabBar = (props: any, isDark: boolean) => {
  return (
    <View className="px-3 pb-3" lightColor="transparent">
      <TabBar
        {...props}
        inactiveColor={Colors.dark.Success200}
        indicatorStyle={{
          backgroundColor: !isDark ? '#3531C2' : '#2F6846',
          marginBottom: 3,
          borderRadius: 8,
          marginLeft: 3,
          width: '50%',
          height: '89%',
        }}
        style={{
          borderRadius: 6,
          backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
        }}
      />
    </View>
  );
};

export default function Profile() {
  const layout = useWindowDimensions();
  const { isDark } = useTheme();
  const { push, dismissTo } = useRouter();
  const { id } = useLocalSearchParams();
  const [index, setIndex] = useState(0);
  const isFocused = useIsFocused();

  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: errorProfile,
  } = useQuery({
    queryKey: ['student-profile', id],
    queryFn: () => studentsAction.getById(`${id}`),
  });

  const {
    data: visits = [],
    isLoading: isLoadingVisits,
    refetch: refetchVisits,
  } = useQuery({
    queryKey: ['student-visits', id, isFocused],
    queryFn: () => visitsAction.getByStudentId(`${id}`),
  });

  function handleAddVisit(visitID?: string) {
    const params: any = {
      id,
      name: profile?.name,
    };
    if (visitID) {
      params.visitID = visitID;
    }
    push({
      pathname: `/(drawer)/(tabs)/students/createVisit`,
      params,
    });
  }

  function handleGoBack() {
    dismissTo('/(drawer)/(tabs)/students');
  }

  const renderScene = SceneMap({
    about: () => <StudentAbout data={profile as Student} />,
    visits: () => (
      <StudentsVisits
        reset={() => refetchVisits()}
        visits={visits}
        load={isLoadingVisits}
        handleAddVisit={handleAddVisit}
      />
    ),
  });

  const routes = [
    { key: 'about', title: 'SOBRE' },
    { key: 'visits', title: 'VISITAS' },
  ];

  return (
    <View className="flex-1 px-4" style={{ flex: 1 }} lightColor="#F6F6F9">
      {isLoadingProfile ? (
        <View className="my-3 mt-6 flex items-center" lightColor="transparent">
          <ActivityIndicator
            color={isDark ? Colors.dark.tint : Colors.light.tint}
          />
        </View>
      ) : errorProfile ? (
        <Text>Erro ao carregar perfil.</Text>
      ) : profile ? (
        <>
          <View
            className="my-3 mt-6 flex items-center"
            lightColor="transparent"
          >
            <View
              className="flex-row items-center w-full justify-center"
              lightColor="#F6F6F9"
            >
              <BackButton onPress={handleGoBack} />
              <TouchableOpacity onPress={handleGoBack} className="relative">
                <View
                  darkColor="#FBEEBC"
                  className="w-20 h-20 mr-6 rounded-2xl flex items-center justify-center relative"
                >
                  {profile?.gender === 'man' || profile?.gender === 'M' ? (
                    <Person width={60} height={60} />
                  ) : profile?.gender === 'woman' || profile?.gender === 'F' ? (
                    <Woman width={60} height={60} />
                  ) : (
                    <Person width={60} height={60} />
                  )}

                  <View
                    darkColor={Colors.dark.tint}
                    lightColor={Colors.light.tint}
                    className="w-10 h-7 items-center justify-center rounded-lg absolute bottom-[-5px] right-[-10px]"
                  >
                    <Text lightColor="#FBEEBC">{profile?.age}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <View className="flex-1" lightColor="transparent">
                <Text className="font-bold font-textIBM text-base break-words over">
                  {profile?.name}
                </Text>
                <Text>{profile?.telephone}</Text>
                <Text>{profile?.email}</Text>
                <View
                  darkColor={Colors.dark.tint}
                  lightColor={Colors.light.tint}
                  className="w-11 h-1 rounded-lg mt-2"
                />
              </View>
            </View>
          </View>
          <View className="flex-1 pb-3 mt-5" lightColor="transparent">
            <TabView
              renderTabBar={(props) => renderTabBar(props, isDark)}
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: layout.width }}
              style={{
                backgroundColor: 'transparent',
              }}
            />
          </View>
          <AnimatedButtonWithText
            text="Adicionar Visita"
            onPress={() => handleAddVisit()}
          />
        </>
      ) : (
        <Text>Perfil não encontrado.</Text>
      )}
    </View>
  );
}
