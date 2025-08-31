'use server';
/**
 * @fileOverview Personalized gadget recommendations flow.
 *
 * - getPersonalizedGadgetRecommendations - A function that returns personalized gadget recommendations.
 * - PersonalizedGadgetRecommendationsInput - The input type for the getPersonalizedGadgetRecommendations function.
 * - PersonalizedGadgetRecommendationsOutput - The return type for the getPersonalizedGadgetRecommendations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAmazonDeals } from '@/services/amazon-deals';

const fetchGadgetDealsTool = ai.defineTool(
  {
    name: 'fetchGadgetDeals',
    description: 'Fetches current deals for gadgets based on a search query.',
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          'The search query for gadgets (e.g., "laptops for students").'
        ),
    }),
    outputSchema: z.array(
      z.object({
        title: z.string(),
        price: z.number(),
        url: z.string().url(),
        category: z.string(),
      })
    ),
  },
  async ({ query }) => {
    return getAmazonDeals(query);
  }
);

const GadgetTypeSchema = z.enum([
  'laptop',
  'tablet',
  'smart gadget',
  'accessory',
]);

const StudentProfileSchema = z.object({
  academicStream: z
    .string()
    .describe(
      'The student\'s academic stream (e.g., engineering, arts, medicine).'
    ),
  budget: z.number().describe('The student\'s budget for gadgets.'),
  usageType: z
    .string()
    .describe(
      'The primary usage type of gadgets for the student (e.g., coding, design, gaming, study).'
    ),
  studentIdLoginInfo: z
    .string()
    .optional()
    .describe('The student ID login info, if available.'),
});

const PersonalizedGadgetRecommendationsInputSchema = z.object({
  studentProfile: StudentProfileSchema.describe(
    'The student profile to analyze.'
  ),
});

export type PersonalizedGadgetRecommendationsInput = z.infer<
  typeof PersonalizedGadgetRecommendationsInputSchema
>;

const GadgetRecommendationSchema = z.object({
  gadgetType: GadgetTypeSchema.describe(
    'The type of gadget being recommended.'
  ),
  brand: z.string().describe('The brand of the recommended gadget.'),
  model: z.string().describe('The model of the recommended gadget.'),
  description: z
    .string()
    .describe('A short description of the gadget and why it is recommended.'),
  price: z.number().describe('The price of the gadget.'),
  dealUrl: z.string().url().describe('The URL of the deal for the gadget.'),
});

const PersonalizedGadgetRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(GadgetRecommendationSchema)
    .describe('A list of personalized gadget recommendations.'),
});

export type PersonalizedGadgetRecommendationsOutput = z.infer<
  typeof PersonalizedGadgetRecommendationsOutputSchema
>;

export async function getPersonalizedGadgetRecommendations(
  input: PersonalizedGadgetRecommendationsInput
): Promise<PersonalizedGadgetRecommendationsOutput> {
  return personalizedGadgetRecommendationsFlow(input);
}

const personalizedGadgetRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedGadgetRecommendationsPrompt',
  input: { schema: PersonalizedGadgetRecommendationsInputSchema },
  output: { schema: PersonalizedGadgetRecommendationsOutputSchema },
  tools: [fetchGadgetDealsTool],
  prompt: `You are an AI gadget recommendation expert for students. Analyze the student profile and use the available tools to find current deals and provide personalized gadget recommendations.

Student Profile:
Academic Stream: {{{studentProfile.academicStream}}}
Budget: {{{studentProfile.budget}}}
Usage Type: {{{studentProfile.usageType}}}
{{#if studentProfile.studentIdLoginInfo}}
Student ID Login Info: {{{studentProfile.studentIdLoginInfo}}}
{{/if}}

Based on the student profile, use the 'fetchGadgetDeals' tool to search for relevant gadgets. Then, recommend 3-5 gadgets (laptops, tablets, smart gadgets, and accessories) that suit their needs and budget. Consider the academic stream, budget, and usage type to provide relevant recommendations.

Ensure that the gadgets are cost-effective and student-friendly. Provide a brief description for each recommendation, explaining why it is suitable for the student.

Your output should be a JSON object with a 'recommendations' field, which is an array of gadget recommendations. Each gadget recommendation should include the gadget type, brand, model, description, price, and deal URL.
`,
});

const personalizedGadgetRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedGadgetRecommendationsFlow',
    inputSchema: PersonalizedGadgetRecommendationsInputSchema,
    outputSchema: PersonalizedGadgetRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await personalizedGadgetRecommendationsPrompt(input);
    return output!;
  }
);
