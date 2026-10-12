import { Avatar } from '@/components/ui/avatar';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { StageBadge } from '@/components/ui/stage-badge';
import { Text } from '@/components/ui/text';
import { linkStudent } from '@/components/notes/editors/commands';
import { useEditorStore } from '@/components/notes/editors/store';
import { notesActions, type LinkableStudent } from '@/database/actions';
import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';

function useStudents(open: boolean) {
  const [students, setStudents] = useState<LinkableStudent[] | null>(null);

  useEffect(() => {
    if (!open) return;
    let active = true;
    notesActions
      .listLinkableStudents()
      .then((rows) => {
        if (active) setStudents(rows);
      })
      .catch(() => {
        if (active) setStudents([]);
      });
    return () => {
      active = false;
    };
  }, [open]);

  return students;
}

function StudentPickerSheet() {
  const picker = useEditorStore((state) => state.picker);
  const studentId = useEditorStore((state) => state.studentId);
  const set = useEditorStore((state) => state.set);
  const students = useStudents(picker !== null);
  const { height } = useWindowDimensions();

  function close() {
    set({ picker: null });
  }

  function choose(student: LinkableStudent) {
    linkStudent(studentId === student.id ? null : student);
    close();
  }

  return (
    <BottomSheet open={picker !== null} onClose={close} title="Sobre alguém">
      <Text variant="bodyS" className="text-muted-foreground">
        A nota aparece na ficha do estudante.
      </Text>

      {students && students.length === 0 ? (
        <View className="items-center gap-2 rounded-lg bg-muted px-4 py-6">
          <Text variant="titleS">Ainda não há estudantes</Text>
          <Text variant="bodyS" className="text-center text-muted-foreground">
            Quando registares alguém em Estudantes, aparece aqui.
          </Text>
        </View>
      ) : (
        <ScrollView style={{ maxHeight: height * 0.45 }} contentContainerClassName="gap-2">
          {(students ?? []).map((student) => {
            const selected = student.id === studentId;
            return (
              <Pressable
                key={student.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => choose(student)}
                className={cn(
                  'min-h-14 flex-row items-center gap-3 rounded-lg border px-3 py-2 active:bg-secondary',
                  selected ? 'border-primary bg-secondary' : 'border-border'
                )}>
                <Avatar name={student.name} />
                <View className="flex-1 gap-1">
                  <Text variant="titleS" numberOfLines={1}>
                    {student.name}
                  </Text>
                  <StageBadge stage={student.stage} />
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {studentId ? (
        <Button
          variant="destructive"
          onPress={() => {
            linkStudent(null);
            close();
          }}>
          <Text>Remover ligação</Text>
        </Button>
      ) : null}
      <Button variant="ghost" onPress={close}>
        <Text>Cancelar</Text>
      </Button>
    </BottomSheet>
  );
}

export { StudentPickerSheet, useStudents };
