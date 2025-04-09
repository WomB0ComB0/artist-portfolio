import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(255)
    .regex(/^[a-zA-Z\s]*$/),
  email: z
    .string()
    .email()
    .max(255)
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  message: z
    .string()
    .min(2)
    .max(255)
    .regex(/^[a-zA-Z0-9\s]*$/),
  phone: z
    .string()
    .min(2)
    .max(255)
    .regex(/^[0-9\s]*$/),
});

export type Contact = z.infer<typeof contactSchema>;
