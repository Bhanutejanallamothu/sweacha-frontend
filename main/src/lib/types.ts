import { z } from 'zod';
import type { PersonalizedGadgetRecommendationsOutput } from '@/ai/flows/personalized-gadget-recommendations';

export const studentProfileSchema = z.object({
  academicStream: z.string().min(1, { message: 'Please select a stream.' }),
  budget: z.number(),
  usageType: z.string().min(1, { message: 'Please select a usage type.' }),
  studentId: z.string().optional(),
});

export type GadgetRecommendation =
  PersonalizedGadgetRecommendationsOutput['recommendations'][0];
