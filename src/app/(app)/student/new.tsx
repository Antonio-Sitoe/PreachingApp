import { StudentForm } from '@/components/students/student-form';
import { useLocalSearchParams } from 'expo-router';

export default function NewStudentScreen() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  return <StudentForm initialName={name} />;
}
