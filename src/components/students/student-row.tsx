import { PersonCard } from '@/components/ui/person-card';
import type { StudentListItem } from '@/database/actions';
import { cn } from '@/utils/cn';
import { getStudentDetail } from '@/utils/students/list';
import { View } from 'react-native';

type GroupedRowProps = {
  first: boolean;
  last: boolean;
  className?: string;
  children: React.ReactNode;
};

function GroupedRow({ first, last, className, children }: GroupedRowProps) {
  return (
    <View collapsable={false} className={cn(first && 'rounded-t-lg', last && 'rounded-b-lg')}>
      <View
        className={cn(
          'overflow-hidden border-x border-t border-border bg-card',
          first && 'rounded-t-lg',
          last && 'rounded-b-lg border-b',
          className
        )}>
        {children}
      </View>
    </View>
  );
}

type StudentRowProps = {
  student: StudentListItem;
  first: boolean;
  last: boolean;
  onPress?: () => void;
};

function StudentRow({ student, first, last, onPress }: StudentRowProps) {
  const detail = getStudentDetail(student);
  return (
    <GroupedRow first={first} last={last}>
      <PersonCard
        className="rounded-none bg-transparent"
        name={student.displayName}
        stage={student.stage}
        detail={detail.text}
        detailTone={detail.tone}
        onPress={onPress}
      />
    </GroupedRow>
  );
}

export { GroupedRow, StudentRow };
export type { GroupedRowProps, StudentRowProps };
