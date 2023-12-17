import * as z from 'zod';

const parseDate = (value: string): Date => {
  const dateParts = value.split('-');
  return new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
};

export const todoSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'Your todo title should be at least 2 characters long' })
    .max(50, { message: 'Your todo title should be no more than 50 characters long' }),
  description: z
    .string()
    .max(255, { message: 'Your todo description should be no more than 255 characters long' }),
  dueDate: z.date(),
});

export type TodoSchema = z.infer<typeof todoSchema>;
