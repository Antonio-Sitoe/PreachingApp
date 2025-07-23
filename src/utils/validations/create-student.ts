import { z } from 'zod';

export const SchemaStudents = z.object({
  name: z.string().min(1, 'Digite um nome'),
  age: z.string().min(1, 'Digite uma idade'),
  gender: z.string().min(1, 'Escolha o genero'),
  telephone: z.string().optional(),
  about: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  bestTime: z.array(z.string()).min(1, 'Escolha a melhor hora para visitar.'),
  bestDay: z.array(z.string()).min(1, 'Escolha um dia para visitar.'),
});
