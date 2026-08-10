import { z } from 'zod';
import { loginSchema, registerSchema } from '@/src/validators/auth';

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
