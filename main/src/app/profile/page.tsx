
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User as UserIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfile {
  phone: string;
  name: string;
  email: string;
  gender: string;
  date_of_birth: string;
  place: string;
  id: string;
  is_active: boolean;
  has_given_consent: boolean;
  consent_given_at: string;
  last_login_at: string;
  created_at: string;
  updated_at: string;
}

function ProfileDetail({ label, value }: { label: string; value: string | undefined }) {
    if(!value) return null;
    return (
        <div className="flex justify-between border-b py-2 text-sm">
            <p className="font-medium text-muted-foreground">{label}</p>
            <p className="text-foreground">{value}</p>
        </div>
    )
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: 'You must be logged in to view your profile.',
        });
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('https://dev.api.corpus.swecha.org/api/v1/auth/me', {
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          const errorData = await response.json();
          toast({
            variant: 'destructive',
            title: 'Failed to fetch profile',
            description: errorData.detail || 'An unexpected error occurred.',
          });
          router.push('/finder');
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'An unexpected error occurred. Please try again later.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router, toast]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-background dark:bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)]"></div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Link href="/finder" className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <UserIcon className="h-8 w-8 text-primary" />
            Your Profile
          </CardTitle>
          <CardDescription>
            View and manage your account details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-6 w-full" />
            </div>
          ) : user ? (
             <div className="space-y-2">
                <ProfileDetail label="Name" value={user.name} />
                <ProfileDetail label="Email" value={user.email} />
                <ProfileDetail label="Phone" value={user.phone} />
                <ProfileDetail label="Gender" value={user.gender} />
                <ProfileDetail label="Date of Birth" value={user.date_of_birth} />
                <ProfileDetail label="Place" value={user.place} />
                <ProfileDetail label="Member Since" value={user.created_at ? new Date(user.created_at).toLocaleDateString() : ''} />
             </div>
          ) : (
            <p>Could not load user profile.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
