/**
 * @fileOverview Shared types for the TFE ideas generation flow.
 */
import {z} from 'genkit';

export const GenerateTFEIdeasInputSchema = z.object({
  fieldOfStudy: z.string().describe('The user\'s field of study (e.g., informatique, droit, médecine).'),
  keywords: z.string().describe('Keywords related to the desired TFE topic (e.g., technologie, problème social, innovation).'),
});
export type GenerateTFEIdeasInput = z.infer<typeof GenerateTFEIdeasInputSchema>;

export const GenerateTFEIdeasOutputSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string().describe('The title of the TFE idea.'),
      description: z.string().describe('A brief explanation of the TFE idea.'),
    })
  ).describe('A list of TFE ideas.'),
});
export type GenerateTFEIdeasOutput = z.infer<typeof GenerateTFEIdeasOutputSchema>;
