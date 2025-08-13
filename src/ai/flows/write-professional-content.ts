'use server';

/**
 * @fileOverview Generates professional content for platforms like LinkedIn and WhatsApp.
 *
 * - writeProfessionalContent - A function that generates professional content.
 * - WriteProfessionalContentInput - The input type for the writeProfessionalContent function.
 * - WriteProfessionalContentOutput - The return type for the writeProfessionalContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WriteProfessionalContentInputSchema = z.object({
  topic: z.string().describe('The topic or request for the professional content.'),
  platform: z
    .string()
    .describe(
      'The platform for the content (e.g., LinkedIn, WhatsApp).  This affects the tone and style.'
    ),
  audience: z.string().describe('The target audience for the content.'),
});
export type WriteProfessionalContentInput = z.infer<typeof WriteProfessionalContentInputSchema>;

const WriteProfessionalContentOutputSchema = z.object({
  content: z.string().describe('The generated professional content.'),
});
export type WriteProfessionalContentOutput = z.infer<typeof WriteProfessionalContentOutputSchema>;

export async function writeProfessionalContent(
  input: WriteProfessionalContentInput
): Promise<WriteProfessionalContentOutput> {
  return writeProfessionalContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'writeProfessionalContentPrompt',
  input: {schema: WriteProfessionalContentInputSchema},
  output: {schema: WriteProfessionalContentOutputSchema},
  prompt: `You are a professional content writer specializing in creating engaging and effective content for various platforms.

You will generate content based on the provided topic, tailored to the specified platform and target audience. The content should be appropriate for the platform and appeal to the audience, all in French.

Topic: {{{topic}}}
Platform: {{{platform}}}
Audience: {{{audience}}}`,
});

const writeProfessionalContentFlow = ai.defineFlow(
  {
    name: 'writeProfessionalContentFlow',
    inputSchema: WriteProfessionalContentInputSchema,
    outputSchema: WriteProfessionalContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
