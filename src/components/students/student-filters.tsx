import { TagChip } from '@/components/notes/list';
import { STUDENT_FILTERS, type StudentFilter } from '@/constants/students';
import { ScrollView } from 'react-native';

type StudentFiltersProps = {
  value: StudentFilter;
  onChange: (value: StudentFilter) => void;
};

function StudentFilters({ value, onChange }: StudentFiltersProps) {
  return (
    <ScrollView
      horizontal
      role="group"
      aria-label="Filtrar por etapa"
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      className="-mx-4 grow-0"
      contentContainerClassName="gap-2 px-4">
      {STUDENT_FILTERS.map((filter) => (
        <TagChip
          key={filter.id}
          label={filter.label}
          active={value === filter.id}
          onPress={() => onChange(filter.id)}
        />
      ))}
    </ScrollView>
  );
}

export { StudentFilters };
export type { StudentFiltersProps };
