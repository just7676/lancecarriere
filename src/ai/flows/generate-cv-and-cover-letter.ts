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
  En utilisant les informations fournies, créez un CV et une lettre de motivation percutants et très détaillés pour un candidat.
  Le ton doit être professionnel et le contenu doit être très riche et explicite.

  Pour le CV :
  - Structurez-le de manière claire et professionnelle (Informations personnelles, Résumé de carrière, Expérience, Formation, Compétences).
  - Pour chaque expérience, décrivez les missions en utilisant des verbes d'action et quantifiez les résultats lorsque c'est possible.
  - Mettez en évidence les compétences qui sont particulièrement recherchées sur le marché de l'emploi congolais.

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

  Générez le CV puis la lettre de motivation en les séparant clairement.

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
