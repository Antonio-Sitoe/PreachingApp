import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { StudentListItem } from '@/database/actions';
import { View } from 'react-native';
import { GroupedRow } from './student-row';

type PausedRowProps = {
  student: StudentListItem;
  first: boolean;
  last: boolean;
  resuming?: boolean;
  onResume: () => void;
};

function PausedRow({ student, first, last, resuming, onResume }: PausedRowProps) {
  return (
    <GroupedRow first={first} last={last}>
      <View className="flex-row items-center gap-3 py-3 pl-4 pr-3">
        <Avatar name={student.displayName} />
        <View className="min-w-0 flex-1 gap-1">
          <Text variant="titleS" numberOfLines={1}>
            {student.displayName}
          </Text>
          {student.note ? (
            <Text variant="bodyS" numberOfLines={2} className="text-muted-foreground">
              {student.note}
            </Text>
          ) : null}
        </View>
        <Button
          variant="outline"
          size="sm"
          className="border-border"
          disabled={resuming}
          accessibilityLabel={`Retomar ${student.displayName}`}
          onPress={onResume}>
          <Text>Retomar</Text>
        </Button>
      </View>
    </GroupedRow>
  );
}

export { PausedRow };
export type { PausedRowProps };
