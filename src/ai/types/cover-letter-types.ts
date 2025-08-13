/**
 * @fileOverview Shared types for the cover letter generation flow.
 */

import {z} from 'genkit';

export const GenerateCoverLetterInputSchema = z.object({
  name: z.string().describe('Your full name.'),
  academicBackground: z.string().describe('Your academic background and qualifications.'),
  skills: z.string().describe('Your key skills and competencies.'),
  experience: z.string().describe('Your work experience and achievements.'),
  jobMarket: z
    .string()
    .describe(
      'Details about the job market in Congo, including relevant industries and employer expectations.'
    ),
});
export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

export const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter content.'),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;
