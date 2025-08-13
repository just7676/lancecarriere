'use server';

/**
 * @fileOverview A cover letter generation AI agent.
 *
 * - generateCoverLetter - A function that handles the cover letter generation process.
 * - GenerateCoverLetterInput - The input type for the generateCoverLetter function.
 * - GenerateCoverLetterOutput - The return type for the generateCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCoverLetterInputSchema = z.object({
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

const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter content.'),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

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
