'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating TFE (Travaux de Fin d'Études) ideas based on the user's field of study and keywords, tailored to the context of the DRC.
 *
 * - generateTFEIdeas - A function that takes user input and returns a list of TFE ideas.
 * - GenerateTFEIdeasInput - The input type for the generateTFEIdeas function.
 * - GenerateTFEIdeasOutput - The return type for the generateTFEIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTFEIdeasInputSchema = z.object({
  fieldOfStudy: z.string().describe('The user\'s field of study (e.g., informatique, droit, médecine).'),
  keywords: z.string().describe('Keywords related to the desired TFE topic (e.g., technologie, problème social, innovation).'),
});
export type GenerateTFEIdeasInput = z.infer<typeof GenerateTFEIdeasInputSchema>;

const GenerateTFEIdeasOutputSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string().describe('The title of the TFE idea.'),
      description: z.string().describe('A brief explanation of the TFE idea.'),
    })
  ).describe('A list of TFE ideas.'),
});
export type GenerateTFEIdeasOutput = z.infer<typeof GenerateTFEIdeasOutputSchema>;

export async function generateTFEIdeas(input: GenerateTFEIdeasInput): Promise<GenerateTFEIdeasOutput> {
  return generateTFEIdeasFlow(input);
}

const generateTFEIdeasPrompt = ai.definePrompt({
  name: 'generateTFEIdeasPrompt',
  input: {schema: GenerateTFEIdeasInputSchema},
  output: {schema: GenerateTFEIdeasOutputSchema},
  prompt: `Tu es un professeur d'université en RDC, spécialiste dans l'accompagnement des étudiants dans leurs Travaux de Fin d'Études (TFE). On te fournit le domaine d'étude de l'étudiant et des mots-clés. Sur base de ces informations, tu dois générer entre trois et cinq idées de TFE qui sont pertinentes pour le contexte de la RDC.

Domaine d'étude: {{{fieldOfStudy}}}
Mots-clés: {{{keywords}}}

Réponds uniquement avec un objet JSON.`,
});

const generateTFEIdeasFlow = ai.defineFlow(
  {
    name: 'generateTFEIdeasFlow',
    inputSchema: GenerateTFEIdeasInputSchema,
    outputSchema: GenerateTFEIdeasOutputSchema,
  },
  async input => {
    const {output} = await generateTFEIdeasPrompt(input);
    return output!;
  }
);
