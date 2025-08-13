'use server';

/**
 * @fileOverview A CV and cover letter generation AI agent.
 *
 * - generateCvAndCoverLetter - A function that handles the CV and cover letter generation process.
 * - GenerateCvAndCoverLetterInput - The input type for the generateCvAndCoverLetter function.
 * - GenerateCvAndCoverLetterOutput - The return type for the generateCvAndCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCvAndCoverLetterInputSchema = z.object({
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
export type GenerateCvAndCoverLetterInput = z.infer<typeof GenerateCvAndCoverLetterInputSchema>;

const GenerateCvAndCoverLetterOutputSchema = z.object({
  cv: z.string().describe('The generated CV content.'),
  coverLetter: z.string().describe('The generated cover letter content.'),
});
export type GenerateCvAndCoverLetterOutput = z.infer<typeof GenerateCvAndCoverLetterOutputSchema>;

export async function generateCvAndCoverLetter(
  input: GenerateCvAndCoverLetterInput
): Promise<GenerateCvAndCoverLetterOutput> {
  return generateCvAndCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCvAndCoverLetterPrompt',
  input: {schema: GenerateCvAndCoverLetterInputSchema},
  output: {schema: GenerateCvAndCoverLetterOutputSchema},
  prompt: `Vous êtes un expert en recrutement spécialisé dans le marché de l'emploi congolais.
  En utilisant les informations fournies, créez un CV et une lettre de motivation percutants pour un candidat.
  Mettez l'accent sur la valorisation de son expérience et de ses compétences pour le marché de l'emploi congolais.

  Nom: {{{name}}}
  Parcours académique: {{{academicBackground}}}
  Compétences: {{{skills}}}
  Expérience: {{{experience}}}
  Informations sur le marché de l'emploi congolais: {{{jobMarket}}}

  CV:
  Lettre de motivation: `,
});

const generateCvAndCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCvAndCoverLetterFlow',
    inputSchema: GenerateCvAndCoverLetterInputSchema,
    outputSchema: GenerateCvAndCoverLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    const separator = 'Lettre de motivation:';
    const separatorIndex = output!.text.indexOf(separator);

    let cv = output!.text.substring(0, separatorIndex).trim();
    let coverLetter = output!.text.substring(separatorIndex + separator.length).trim();

    return {
      cv: cv,
      coverLetter: coverLetter,
    };
  }
);
