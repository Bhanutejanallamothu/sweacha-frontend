
'use client';

import type { z } from 'zod';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getPersonalizedGadgetRecommendations } from '@/ai/flows/personalized-gadget-recommendations';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  GadgetRecommendation,
  studentProfileSchema,
} from '@/lib/types';
import { RecommendationList } from '@/components/recommendation-list';
import { Gem } from 'lucide-react';

const academicStreams = [
  'Engineering',
  'Arts',
  'Medicine',
  'Business',
  'Science',
  'Law',
];
const usageTypes = ['Studying', 'Coding', 'Design', 'Gaming', 'Entertainment'];

export function RecommendationForm({ studentId }: { studentId: string }) {
  const [recommendations, setRecommendations] = useState<
    GadgetRecommendation[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof studentProfileSchema>>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      academicStream: '',
      budget: 500,
      usageType: '',
      studentId: studentId,
    },
  });

  useEffect(() => {
    form.setValue('studentId', studentId);
  }, [studentId, form]);

  async function onSubmit(values: z.infer<typeof studentProfileSchema>) {
    setIsLoading(true);
    setRecommendations([]);
    try {
      const result = await getPersonalizedGadgetRecommendations({
        studentProfile: {
          ...values,
          studentIdLoginInfo: values.studentId,
        },
      });
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'Failed to generate recommendations. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 py-4">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Tell us about yourself to get personalized recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="academicStream"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Academic Stream</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your stream" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {academicStreams.map((stream) => (
                            <SelectItem key={stream} value={stream}>
                              {stream}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="usageType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Usage</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select primary usage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {usageTypes.map((use) => (
                            <SelectItem key={use} value={use}>
                              {use}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Budget: ${field.value.toLocaleString()}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={100}
                        max={3000}
                        step={50}
                        onValueChange={(value) => field.onChange(value[0])}
                        defaultValue={[field.value]}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} size="lg">
                <Gem className="mr-2 h-4 w-4" />
                {isLoading
                  ? 'Analyzing...'
                  : 'Generate Recommendations'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <RecommendationList
        recommendations={recommendations}
        isLoading={isLoading}
      />
    </div>
  );
}
