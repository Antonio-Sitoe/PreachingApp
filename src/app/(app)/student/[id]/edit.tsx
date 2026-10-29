import { StudentForm } from '@/components/students/student-form';
import { ScreenHeader } from '@/components/ui/screen-header';
import { studentsActions } from '@/database/actions';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function EditStudentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const detailQuery = useQuery({
    queryKey: ['students', 'detail', id],
    queryFn: () => studentsActions.getDetail(id),
    enabled: Boolean(id),
  });

  if (detailQuery.data) return <StudentForm detail={detailQuery.data} />;

  return (
    <View className="flex-1 bg-card">
      <ScreenHeader title="Editar estudante" onBack={() => router.back()} />
    </View>
  );
}
