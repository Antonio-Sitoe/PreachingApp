import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Pressable, ScrollView } from 'react-native';

function TagChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      className={cn(
        'h-9 justify-center rounded-full border px-3.5',
        active ? 'border-primary bg-secondary' : 'border-border bg-card active:bg-secondary'
      )}>
      <Text
        className={cn(
          'text-[13px] leading-[18px]',
          active ? 'font-display-semibold text-primary-strong' : 'font-display-medium text-foreground'
        )}>
        {label}
      </Text>
    </Pressable>
  );
}

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
    // Uma só linha que desliza para o lado. O -mx-4 leva-a até às bordas do ecrã.
    <ScrollView
      horizontal
      role="group"
      aria-label="Filtrar por etiqueta"
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      className="-mx-4 grow-0"
      contentContainerClassName="gap-2 px-4">
      {filters.map((filter) => (
        <TagChip
          key={filter.id}
          label={filter.name}
          active={activeFilter === filter.id}
          onPress={() => onFilterChange(filter.id)}
        />
      ))}
    </ScrollView>
  );
}

export { TagChip, TagsFilter };
