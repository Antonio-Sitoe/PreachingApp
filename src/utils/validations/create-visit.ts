import * as z from 'zod/v4';

export const createVisitSchema = z.object({
  dateAndHours: z.any(),
  studentsId: z.string(),
  result: z.string(),
  biblicalTexts: z.string(),
  publications: z.string(),
  notes: z.string(),
});
