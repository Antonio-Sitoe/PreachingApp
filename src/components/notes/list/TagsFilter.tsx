import { TouchableOpacity, ScrollView } from 'react-native';
import { View, Text } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import Colors from '@/constants/Colors';

interface Tag {
  id: string;
  name: string;
}

interface TagsFilterProps {
  tags: Tag[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export function TagsFilter({
  tags,
  activeFilter,
  onFilterChange,
}: TagsFilterProps) {
  const { isDark } = useTheme();

  const allFilters = [
    {
      id: 'all',
      name: 'Todas',
    },
    ...tags,
  ];

  return (
    <View className="mx-4 mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0 }}
        className="flex-row"
      >
        {allFilters.map((filter, index) => {
          const isActive = activeFilter === filter.id;
          const isFirst = index === 0;

          return (
            <TouchableOpacity
              key={filter.id}
              onPress={() => onFilterChange(filter.id)}
              className="mr-3 px-5 py-3 rounded-2xl flex-row items-center"
              style={{
                backgroundColor: isActive
                  ? isDark
                    ? Colors.dark.tint
                    : Colors.light.tint
                  : isDark
                  ? '#2c2c2e'
                  : '#f2f2f7',
                shadowColor: isActive
                  ? isDark
                    ? Colors.dark.tint
                    : Colors.light.tint
                  : 'transparent',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: isActive ? 0.3 : 0,
                shadowRadius: 4,
                elevation: isActive ? 3 : 0,
              }}
            >
              {isFirst && (
                <View
                  className="w-2 h-2 rounded-full mr-2"
                  style={{
                    backgroundColor: isActive
                      ? '#ffffff'
                      : isDark
                      ? '#8e8e93'
                      : '#8e8e93',
                  }}
                />
              )}

              <Text
                className="font-text font-medium"
                style={{
                  color: isActive ? '#ffffff' : isDark ? '#ffffff' : '#000000',
                }}
              >
                {filter.name}
              </Text>

              {isActive && !isFirst && (
                <View
                  className="w-1 h-1 rounded-full ml-2"
                  style={{ backgroundColor: '#ffffff' }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
