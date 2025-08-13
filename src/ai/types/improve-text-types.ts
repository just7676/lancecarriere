/**
 * @fileOverview Shared types for the improve text flow.
 */
import {z} from 'genkit';

export const ImproveTextInputSchema = z.object({
  text: z.string().describe('The text to be improved.'),
  problem: z.string().optional().describe('The specific writing problem the user is facing.'),
});
export type ImproveTextInput = z.infer<typeof ImproveTextInputSchema>;

export const ImproveTextOutputSchema = z.object({
  improvedText: z.string().describe('The improved version of the text.'),
});
export type ImproveTextOutput = z.infer<typeof ImproveTextOutputSchema>;
