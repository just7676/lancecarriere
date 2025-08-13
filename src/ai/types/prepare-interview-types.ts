/**
 * @fileOverview Shared types for the prepare interview flow.
 */
import {z} from 'genkit';

export const PrepareInterviewInputSchema = z.object({
  jobTitle: z.string().describe('The job title for which the user is preparing.'),
  requiredSkills: z.string().describe('The skills required for the job.'),
});
export type PrepareInterviewInput = z.infer<typeof PrepareInterviewInputSchema>;

export const PrepareInterviewOutputSchema = z.object({
  questionsAndAnswers: z.array(
    z.object({
      question: z.string().describe('An interview question.'),
      exampleAnswer: z.string().describe('An example answer to the question.'),
    })
  ).describe('A list of interview questions and example answers.'),
});
export type PrepareInterviewOutput = z.infer<typeof PrepareInterviewOutputSchema>;
