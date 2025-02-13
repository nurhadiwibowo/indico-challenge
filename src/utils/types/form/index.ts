import z from 'zod';


export const signInSchema = z.object({
    email: z.string().email(),
});

export type SignInFormData = z.infer<typeof signInSchema>;
