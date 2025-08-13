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
  prompt: `Vous êtes un expert en rédaction et un coach en écriture. Votre mission est d'améliorer le texte fourni et d'éduquer l'utilisateur.

  1.  **Améliorez le texte suivant** en corrigeant les fautes de grammaire, d'orthographe, de ponctuation, de syntaxe et de style. Le ton doit rester professionnel et adapté au contexte de la RDC.
  2.  **Après le texte corrigé**, ajoutez une section "Recommandations" où vous expliquez les changements les plus importants que vous avez faits et pourquoi.
      - Mettez en évidence les types d'erreurs récurrentes.
      - Donnez des conseils clairs pour que l'utilisateur puisse s'améliorer à l'avenir.
      - Expliquez l'intérêt des corrections (ex: "Cette formulation est plus professionnelle car...", "L'utilisation de ce connecteur logique améliore la clarté du propos.").
  3.  Si un problème spécifique est mentionné par l'utilisateur, concentrez-vous sur sa résolution et expliquez comment vous l'avez traité.

  Texte à améliorer:
  {{{text}}}

  {{#if problem}}
  Problème spécifique à adresser: {{{problem}}}
  {{/if}}

  Répondez en fournissant d'abord le texte amélioré, suivi de la section "Recommandations".`,
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
