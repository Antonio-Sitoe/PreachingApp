import { VisitForm } from '@/components/visits/visit-form';
import { useLocalSearchParams } from 'expo-router';

export default function NewVisitScreen() {
  const { studentId } = useLocalSearchParams<{ studentId?: string }>();
  return <VisitForm initialStudentId={studentId} />;
}
