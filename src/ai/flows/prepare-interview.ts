'use server';

/**
 * @fileOverview A flow to generate interview questions and example answers for job seekers.
 *
 * - `prepareInterview` - A function that generates interview questions and example answers.
 */

import {ai} from '@/ai/genkit';
import {
  PrepareInterviewInputSchema,
  PrepareInterviewOutputSchema,
  type PrepareInterviewInput,
  type PrepareInterviewOutput,
} from '@/ai/types/prepare-interview-types';

export async function prepareInterview(input: PrepareInterviewInput): Promise<PrepareInterviewOutput> {
  return prepareInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prepareInterviewPrompt',
  input: {schema: PrepareInterviewInputSchema},
  output: {schema: PrepareInterviewOutputSchema},
  prompt: `Tu es un expert en ressources humaines et un coach de carrière spécialisé dans le marché de l'emploi congolais. Ton rôle est d'aider les jeunes diplômés à exceller lors de leurs entretiens d'embauche.

  Génère une liste de questions d'entretien pertinentes et techniques pour le poste de **{{{jobTitle}}}**.

  Pour chaque question :
  1.  **Fournis une réponse type détaillée et bien structurée.** Cette réponse doit être un exemple concret et percutant, adapté au contexte de la RDC.
  2.  **Ajoute une section "Conseils du coach"** qui explique :
      *   Ce que le recruteur cherche à évaluer avec cette question.
      *   La meilleure façon de structurer sa propre réponse (par exemple, en utilisant la méthode STAR : Situation, Tâche, Action, Résultat).
      *   Les pièges à éviter.
  3.  **Mets en évidence comment intégrer les compétences demandées ({{{requiredSkills}}})** dans les réponses pour démontrer sa qualification.

  Le résultat doit être un tableau JSON où chaque élément contient "question" et "exampleAnswer" (la réponse type enrichie des conseils).`,
});

const prepareInterviewFlow = ai.defineFlow(
  {
    name: 'prepareInterviewFlow',
    inputSchema: PrepareInterviewInputSchema,
    outputSchema: PrepareInterviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
