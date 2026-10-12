import { getInitials } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { normalizeSearch } from '@/components/notes/body';
import { insertMention } from '@/components/notes/editors/commands';
import { useEditorStore } from '@/components/notes/editors/store';
import { useStudents } from '@/components/notes/editors/student-picker-sheet';
import { STAGES } from '@/constants/stages';
import { cn } from '@/utils/cn';
import { Pressable, ScrollView, View } from 'react-native';

function MentionSuggestions() {
  const mention = useEditorStore((state) => state.mention);
  const students = useStudents(mention !== null);

  if (!mention || !students) return null;

  const query = normalizeSearch(mention.query);
  const matches = query ? students.filter((student) => normalizeSearch(student.name).includes(query)) : students;

  return (
    <View className="border-t border-border bg-card py-2">
      {matches.length === 0 ? (
        <Text className="px-5 text-[13px] leading-[18px] text-muted-foreground">
          {students.length === 0 ? 'Ainda não há estudantes.' : 'Nenhum estudante com esse nome.'}
        </Text>
      ) : (
        <ScrollView
          horizontal
          keyboardShouldPersistTaps="always"
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 px-3">
          {matches.map((student) => (
            <Pressable
              key={student.id}
              accessibilityRole="button"
              accessibilityLabel={`Mencionar ${student.name}`}
              onPress={() => insertMention(student)}
              className="h-9 flex-row items-center gap-2 rounded-full border border-border pl-1.5 pr-3 active:bg-secondary">
              <View className={cn('size-6 items-center justify-center rounded-full', STAGES[student.stage].bgClass)}>
                <Text className={cn('font-display text-[10px] leading-6', STAGES[student.stage].textClass)}>
                  {getInitials(student.name)}
                </Text>
              </View>
              <Text className="font-display-medium text-[14px] leading-5" numberOfLines={1}>
                {student.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

export { MentionSuggestions };
