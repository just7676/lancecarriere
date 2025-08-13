/**
 * @fileOverview Shared types for the TFC ideas generation flow.
 */
import {z} from 'genkit';

export const GenerateTFCIdeasInputSchema = z.object({
  fieldOfStudy: z.string().describe('The user\'s field of study (e.g., informatique, droit, médecine).'),
  keywords: z.string().describe('Keywords related to the desired TFC topic (e.g., technologie, problème social, innovation).'),
});
export type GenerateTFCIdeasInput = z.infer<typeof GenerateTFCIdeasInputSchema>;

export const GenerateTFCIdeasOutputSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string().describe('The title of the TFC idea.'),
      description: z.string().describe('A brief explanation of the TFC idea.'),
    })
  ).describe('A list of TFC ideas.'),
});
export type GenerateTFCIdeasOutput = z.infer<typeof GenerateTFCIdeasOutputSchema>;
