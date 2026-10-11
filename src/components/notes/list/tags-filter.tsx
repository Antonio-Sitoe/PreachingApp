import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Pressable, ScrollView, View } from 'react-native';

type TagFilter = {
  id: string;
  name: string;
};

type TagsFilterProps = {
  tags: TagFilter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
};

function TagsFilter({ tags, activeFilter, onFilterChange }: TagsFilterProps) {
  const filters = [{ id: 'all', name: 'Todas' }, ...tags];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-4"
      className="mb-3 max-h-11">
      {filters.map((filter) => {
        const active = activeFilter === filter.id;
        return (
          <Pressable
            key={filter.id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onFilterChange(filter.id)}
            className={cn('rounded-full px-4 py-2', active ? 'bg-primary' : 'bg-muted')}>
            <Text variant="labelM" className={active ? 'text-primary-foreground' : 'text-foreground'}>
              {filter.name}
            </Text>
          </Pressable>
        );
      })}
      <View className="w-2" />
    </ScrollView>
  );
}

export { TagsFilter };
