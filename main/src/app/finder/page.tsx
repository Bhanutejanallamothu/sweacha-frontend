
'use client';

import React from 'react';
import { RecommendationForm } from '@/components/recommendation-form';
import { AppHeader } from '@/components/app-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LaptopList } from '@/components/laptop-list';
import { laptopData } from '@/lib/laptop-data';
import { MobileList } from '@/components/mobile-list';
import { mobileData } from '@/lib/mobile-data';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

function Finder({ studentId, name, email }: { studentId: string, name: string, email: string }) {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader studentId={studentId} name={name} email={email} onLogout={handleLogout} />
      <main className="container mx-auto flex-1 px-4 py-8">
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="laptops">Laptops</TabsTrigger>
            <TabsTrigger value="mobiles">Mobile</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
          </TabsList>
          <TabsContent value="recommendations">
            <RecommendationForm studentId={name} />
          </TabsContent>
          <TabsContent value="laptops">
            <Card>
              <CardHeader>
                <CardTitle>Laptops</CardTitle>
                <CardDescription>
                  Powerful laptops for every student.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <LaptopList laptops={laptopData.laptops} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="mobiles">
            <Card>
              <CardHeader>
                <CardTitle>Mobile Devices</CardTitle>
                <CardDescription>
                  Tablets and smartphones for learning on the go.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                 <MobileList mobiles={mobileData.mobiles} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="accessories">
            <Card>
              <CardHeader>
                <CardTitle>Accessories</CardTitle>
                <CardDescription>
                  Essential accessories to complete your setup.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <iframe
                  src="https://www.rtings.com/"
                  className="w-full h-[800px] border-0"
                  title="Accessories from RTINGS.com"
                ></iframe>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="deals">
            <Card>
              <CardHeader>
                <CardTitle>Deals</CardTitle>
                <CardDescription>
                  Hot deals on popular student gadgets.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <iframe
                  src="https://freeforstudents.org/in"
                  className="w-full h-[800px] border-0"
                  title="Deals from freeforstudents.org"
                ></iframe>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}


function FinderWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const studentId = searchParams.get('studentId');
  const name = searchParams.get('name');
  const email = searchParams.get('email');

  React.useEffect(() => {
    if (!studentId || !name || !email) {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
      }
    }
  }, [studentId, name, email, router]);

  if (!studentId || !name || !email) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return <Finder studentId={studentId} name={name} email={email} />;
}

export default function FinderPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <FinderWrapper />
    </React.Suspense>
  )
}
