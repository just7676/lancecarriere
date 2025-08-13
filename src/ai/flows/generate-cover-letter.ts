'use server';

/**
 * @fileOverview A cover letter generation AI agent.
 *
 * - generateCoverLetter - A function that handles the cover letter generation process.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateCoverLetterInputSchema,
  GenerateCoverLetterOutputSchema,
  type GenerateCoverLetterInput,
  type GenerateCoverLetterOutput,
} from '@/ai/types/cover-letter-types';

export async function generateCoverLetter(
  input: GenerateCoverLetterInput
): Promise<GenerateCoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCoverLetterPrompt',
  input: {schema: GenerateCoverLetterInputSchema},
  output: {schema: GenerateCoverLetterOutputSchema},
  prompt: `Vous êtes un expert en recrutement spécialisé dans le marché de l'emploi congolais.
  En utilisant les informations fournies, créez une lettre de motivation percutante et très détaillée pour un candidat.
  Le ton doit être professionnel et le contenu doit être très riche et explicite.

  Pour la lettre de motivation :
  - Rédigez une lettre personnalisée qui montre l'intérêt du candidat pour le poste et l'entreprise.
  - Expliquez clairement comment son profil (expériences et compétences) répond aux besoins du poste.
  - Mettez en avant les bénéfices concrets qu'il pourrait apporter. La lettre doit être convaincante et donner envie au recruteur de le rencontrer.

  Informations du candidat :
  Nom: {{{name}}}
  Parcours académique: {{{academicBackground}}}
  Compétences: {{{skills}}}
  Expérience: {{{experience}}}
  Informations sur le marché de l'emploi congolais: {{{jobMarket}}}

  Générez la lettre de motivation.`,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
