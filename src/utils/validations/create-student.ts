import { z } from 'zod';

export const SchemaStudents = z.object({
  name: z.string({ error: 'Digite um nome' }).min(1, 'Digite um nome'),
  age: z.string({ error: 'Digite uma idade' }).min(1, 'Digite uma idade'),
  gender: z.string({ error: 'Escolha o genero' }).min(1, 'Escolha o genero'),
  telephone: z.string({ error: 'Digite um telefone' }).optional(),
  about: z.string({ error: 'Digite uma descrição' }).optional(),
  email: z.string({ error: 'Digite um email' }).optional(),
  address: z.string({ error: 'Digite um endereço' }).optional(),
});
