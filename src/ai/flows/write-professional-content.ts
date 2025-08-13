'use server';

/**
 * @fileOverview Generates professional content for platforms like LinkedIn and WhatsApp.
 *
 * - writeProfessionalContent - A function that generates professional content.
 */

import {ai} from '@/ai/genkit';
import {
  WriteProfessionalContentInputSchema,
  WriteProfessionalContentOutputSchema,
  type WriteProfessionalContentInput,
  type WriteProfessionalContentOutput,
} from '@/ai/types/write-professional-content-types';

export async function writeProfessionalContent(
  input: WriteProfessionalContentInput
): Promise<WriteProfessionalContentOutput> {
  return writeProfessionalContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'writeProfessionalContentPrompt',
  input: {schema: WriteProfessionalContentInputSchema},
  output: {schema: WriteProfessionalContentOutputSchema},
  prompt: `Vous êtes un expert en communication digitale et un stratège de contenu spécialisé pour le public francophone, notamment en Afrique.

  Votre mission est de générer un contenu percutant et détaillé basé sur la demande de l'utilisateur, et d'expliquer vos choix stratégiques.

  1.  **Générez le contenu demandé** en l'adaptant parfaitement à la plateforme (ton, format, longueur, hashtags, etc.) et à l'audience cible. Le contenu doit être riche, informatif et engageant.
  2.  **Après le contenu, ajoutez une section "Analyse et Recommandations"** qui explique :
      *   **Pourquoi ce format et ce ton ont été choisis** pour la plateforme '{{{platform}}}' et l'audience '{{{audience}}}'.
      *   **L'intérêt stratégique des éléments clés** du contenu (ex: l'accroche, l'appel à l'action, l'utilisation d'emojis ou de hashtags).
      *   **Des conseils pour maximiser l'impact** de cette publication (ex: meilleur moment pour publier, type d'image ou de vidéo à associer, comment interagir avec les commentaires).

  Demande de l'utilisateur :
  Sujet: {{{topic}}}
  Plateforme: {{{platform}}}
  Audience: {{{audience}}}

  Répondez en fournissant d'abord le contenu généré, suivi de la section "Analyse et Recommandations".`,
});

const writeProfessionalContentFlow = ai.defineFlow(
  {
    name: 'writeProfessionalContentFlow',
    inputSchema: WriteProfessionalContentInputSchema,
    outputSchema: WriteProfessionalContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
