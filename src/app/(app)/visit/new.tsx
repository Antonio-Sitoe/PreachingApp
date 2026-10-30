import { VisitForm } from '@/components/visits/visit-form';
import { useLocalSearchParams } from 'expo-router';

export default function NewVisitScreen() {
  const { studentId, study } = useLocalSearchParams<{ studentId?: string; study?: string }>();
  return <VisitForm initialStudentId={studentId} initialStudied={study === '1'} />;
}
