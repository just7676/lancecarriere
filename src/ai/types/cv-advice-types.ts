/**
 * @fileOverview Shared types for the CV advice generation flow.
 *
 * This file defines the Zod schemas and TypeScript types for the
 * input and output of the CV advice generation functionality.
 * It is separated into its own file to avoid "use server" directive
 * errors in Next.js when importing types into client components.
 */

import {z} from 'genkit';

export const GenerateCVAdviceInputSchema = z.object({
  name: z.string().describe('Your full name.'),
  academicBackground: z.string().describe('Your academic background and qualifications.'),
  skills: z.string().describe('Your key skills and competencies.'),
  experience: z.string().describe('Your work experience and achievements.'),
});
export type GenerateCVAdviceInput = z.infer<typeof GenerateCVAdviceInputSchema>;

export const GenerateCVAdviceOutputSchema = z.object({
  advice: z.string().describe('The generated CV advice content, formatted as a string that can include simple HTML for structure.'),
});
export type GenerateCVAdviceOutput = z.infer<typeof GenerateCVAdviceOutputSchema>;
