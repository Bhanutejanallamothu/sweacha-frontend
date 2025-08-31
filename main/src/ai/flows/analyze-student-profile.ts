'use server';

/**
 * @fileOverview A student profile analysis AI agent.
 *
 * - analyzeStudentProfile - A function that handles the student profile analysis process.
 * - AnalyzeStudentProfileInput - The input type for the analyzeStudentProfile function.
 * - AnalyzeStudentProfileOutput - The return type for the analyzeStudentProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStudentProfileInputSchema = z.object({
  academicStream: z
    .string()
    .describe('The student\'s academic stream (e.g., Computer Science, Engineering, Arts).'),
  budget: z.number().describe('The student\'s budget for gadgets.'),
  usageType: z
    .string()
    .describe(
      'The primary usage type of gadgets (e.g., coding, design, gaming, study).'
    ),
  studentId: z
    .string()
    .optional()
    .describe('The student ID. May be empty if the user is not logged in.'),
});
export type AnalyzeStudentProfileInput = z.infer<typeof AnalyzeStudentProfileInputSchema>;

const AnalyzeStudentProfileOutputSchema = z.object({
  profileSummary: z
    .string()
    .describe('A summary of the student profile based on the provided information.'),
});
export type AnalyzeStudentProfileOutput = z.infer<typeof AnalyzeStudentProfileOutputSchema>;

export async function analyzeStudentProfile(
  input: AnalyzeStudentProfileInput
): Promise<AnalyzeStudentProfileOutput> {
  return analyzeStudentProfileFlow(input);
}

const analyzeStudentProfilePrompt = ai.definePrompt({
  name: 'analyzeStudentProfilePrompt',
  input: {schema: AnalyzeStudentProfileInputSchema},
  output: {schema: AnalyzeStudentProfileOutputSchema},
  prompt: `You are an AI assistant designed to analyze student profiles and provide a summary.

  Analyze the following student profile information to create a concise summary.

  Academic Stream: {{{academicStream}}}
  Budget: {{{budget}}}
  Usage Type: {{{usageType}}}
  {{#if studentId}}
  Student ID: {{{studentId}}}
  {{/if}}
  
  Based on this information, create a profile summary that will be used to provide personalized gadget recommendations.
  Do not directly make any gadget recommendations.
  Just summarize the profile in terms of the student's gadget needs.
  Include the student ID in the profile summary if provided.
  
  Profile Summary:`,
});

const analyzeStudentProfileFlow = ai.defineFlow(
  {
    name: 'analyzeStudentProfileFlow',
    inputSchema: AnalyzeStudentProfileInputSchema,
    outputSchema: AnalyzeStudentProfileOutputSchema,
  },
  async input => {
    const {output} = await analyzeStudentProfilePrompt(input);
    return output!;
  }
);
