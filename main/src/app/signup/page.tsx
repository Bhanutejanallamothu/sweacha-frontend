
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { VenetianMask, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!phoneNumber.trim()) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'Please enter a valid phone number.',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://dev.api.corpus.swecha.org/api/v1/auth/signup/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'OTP Sent!',
          description: data.message || 'An OTP has been sent to your phone number.',
        });
        router.push(`/signup/verify?phone_number=${encodeURIComponent(phoneNumber)}`);
      } else {
        const errorMessage = data.errors?.[0]?.ctx?.error || data.detail || 'An error occurred.';
        toast({
          variant: 'destructive',
          title: 'Signup Failed',
          description: errorMessage,
        });
      }
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Signup Error',
        description: 'An unexpected error occurred. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-background dark:bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)]"></div>
      <Card className="w-full max-w-md shadow-2xl">
        <form onSubmit={handleSignup}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
               <Link href="/" passHref>
                <Button variant="ghost" size="icon" className="mr-4" asChild>
                    <ArrowLeft className="h-6 w-6" />
                </Button>
              </Link>
              <VenetianMask className="h-8 w-8 text-primary" />
              Create Account
            </CardTitle>
            <CardDescription>
              Enter your phone number to receive an OTP for verification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="e.g., +919876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
             <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
