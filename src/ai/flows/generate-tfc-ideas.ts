'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating TFC (Travaux de Fin de Cycle) ideas based on the user's field of study and keywords, tailored to the context of the DRC.
 *
 * - generateTFCIdeas - A function that takes user input and returns a list of TFC ideas.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateTFCIdeasInputSchema,
  GenerateTFCIdeasOutputSchema,
  type GenerateTFCIdeasInput,
  type GenerateTFCIdeasOutput,
} from '@/ai/types/tfc-ideas-types';


export async function generateTFCIdeas(input: GenerateTFCIdeasInput): Promise<GenerateTFCIdeasOutput> {
  return generateTFCIdeasFlow(input);
}

const generateTFCIdeasPrompt = ai.definePrompt({
  name: 'generateTFCIdeasPrompt',
  input: {schema: GenerateTFCIdeasInputSchema},
  output: {schema: GenerateTFCIdeasOutputSchema},
  prompt: `Tu es un professeur d'université en RDC, spécialiste dans l'accompagnement des étudiants dans leurs Travaux de Fin de Cycle (TFC). Ton rôle est de fournir des idées de sujets riches, pertinentes et bien développées.

On te fournit le domaine d'étude de l'étudiant et des mots-clés. Sur base de ces informations, tu dois générer entre trois et cinq idées de TFC qui sont non seulement pertinentes pour le contexte de la RDC, mais aussi innovantes et faisables.

Pour chaque idée, fournis :
1.  **Un titre clair et accrocheur.**
2.  **Une description détaillée et explicite.** Cette description doit inclure :
    *   Le **contexte et la problématique** à laquelle le sujet répond, en lien avec la RDC.
    *   Les **objectifs principaux** de la recherche.
    *   Les **pistes méthodologiques** possibles (ex: étude de cas, enquête de terrain, développement d'une application, etc.).
    *   **L'intérêt et l'impact potentiel** du projet (quels bénéfices pour la société, le secteur d'activité, la connaissance scientifique ?).

Domaine d'étude: {{{fieldOfStudy}}}
Mots-clés: {{{keywords}}}

Réponds uniquement avec un objet JSON.`,
});

const generateTFCIdeasFlow = ai.defineFlow(
  {
    name: 'generateTFCIdeasFlow',
    inputSchema: GenerateTFCIdeasInputSchema,
    outputSchema: GenerateTFCIdeasOutputSchema,
  },
  async input => {
    const {output} = await generateTFCIdeasPrompt(input);
    return output!;
  }
);
