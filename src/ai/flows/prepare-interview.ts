// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview A flow to generate interview questions and example answers for job seekers.
 *
 * - `prepareInterview` - A function that generates interview questions and example answers.
 * - `PrepareInterviewInput` - The input type for the `prepareInterview` function.
 * - `PrepareInterviewOutput` - The return type for the `prepareInterview` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrepareInterviewInputSchema = z.object({
  jobTitle: z.string().describe('The job title for which the user is preparing.'),
  requiredSkills: z.string().describe('The skills required for the job.'),
});
export type PrepareInterviewInput = z.infer<typeof PrepareInterviewInputSchema>;

const PrepareInterviewOutputSchema = z.object({
  questionsAndAnswers: z.array(
    z.object({
      question: z.string().describe('An interview question.'),
      exampleAnswer: z.string().describe('An example answer to the question.'),
    })
  ).describe('A list of interview questions and example answers.'),
});
export type PrepareInterviewOutput = z.infer<typeof PrepareInterviewOutputSchema>;

export async function prepareInterview(input: PrepareInterviewInput): Promise<PrepareInterviewOutput> {
  return prepareInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prepareInterviewPrompt',
  input: {schema: PrepareInterviewInputSchema},
  output: {schema: PrepareInterviewOutputSchema},
  prompt: `Tu es un expert en ressources humaines spécialisé dans le marché de l'emploi congolais. Ton rôle est d'aider les jeunes diplômés à se préparer aux entretiens d'embauche.

  Génère une liste de questions d'entretien classiques et techniques pour le poste de {{{jobTitle}}}. Fournis également des exemples de réponses pour chaque question, en tenant compte du contexte local de la RDC. Mets en évidence les compétences demandées : {{{requiredSkills}}}.

  Le résultat doit être un tableau JSON avec les champs "question" et "exampleAnswer".`,
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
