/**
 * @fileOverview Shared types for the write professional content flow.
 */
import {z} from 'genkit';

export const WriteProfessionalContentInputSchema = z.object({
  topic: z.string().describe('The topic or request for the professional content.'),
  platform: z
    .string()
    .describe(
      'The platform for the content (e.g., LinkedIn, WhatsApp).  This affects the tone and style.'
    ),
  audience: z.string().describe('The target audience for the content.'),
});
export type WriteProfessionalContentInput = z.infer<typeof WriteProfessionalContentInputSchema>;

export const WriteProfessionalContentOutputSchema = z.object({
  content: z.string().describe('The generated professional content.'),
});
export type WriteProfessionalContentOutput = z.infer<typeof WriteProfessionalContentOutputSchema>;
