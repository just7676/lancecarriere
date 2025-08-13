'use server';

/**
 * @fileOverview This file defines a Genkit flow for improving user-provided text.
 *
 * - improveText - A function that takes user text and returns an improved version.
 * - ImproveTextInput - The input type for the improveText function.
 * - ImproveTextOutput - The return type for the improveText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveTextInputSchema = z.object({
  text: z.string().describe('The text to be improved.'),
  problem: z.string().optional().describe('The specific writing problem the user is facing.'),
});
export type ImproveTextInput = z.infer<typeof ImproveTextInputSchema>;

const ImproveTextOutputSchema = z.object({
  improvedText: z.string().describe('The improved version of the text.'),
});
export type ImproveTextOutput = z.infer<typeof ImproveTextOutputSchema>;

export async function improveText(input: ImproveTextInput): Promise<ImproveTextOutput> {
  return improveTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveTextPrompt',
  input: {schema: ImproveTextInputSchema},
  output: {schema: ImproveTextOutputSchema},
  prompt: `Vous êtes un expert en rédaction et correction de texte.
  Améliorez le texte suivant en corrigeant les fautes de grammaire, d'orthographe, de ponctuation et de style.
  Si un problème spécifique est mentionné, concentrez-vous sur sa résolution.
  Le ton doit rester professionnel et adapté au contexte de la RDC.

  Texte à améliorer:
  {{{text}}}

  {{#if problem}}
  Problème spécifique à adresser: {{{problem}}}
  {{/if}}

  Répondez uniquement avec le texte amélioré.`,
});

const improveTextFlow = ai.defineFlow(
  {
    name: 'improveTextFlow',
    inputSchema: ImproveTextInputSchema,
    outputSchema: ImproveTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
