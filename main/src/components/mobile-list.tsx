
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export interface Mobile {
  image: string;
  brand: string;
  specs: string;
  amazon_link: string;
  price: string;
}

function MobileCard({ mobile }: { mobile: Mobile }) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative w-full h-64">
        <Image
          src={mobile.image}
          alt={mobile.brand}
          data-ai-hint={`${mobile.brand} phone`}
          fill
          className="object-contain"
        />
      </div>
      <CardHeader>
        <CardTitle>{mobile.brand}</CardTitle>
        <CardDescription>{mobile.specs}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow"></CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-lg font-bold">{mobile.price}</p>
        <Button asChild>
          <a
            href={mobile.amazon_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Amazon
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function MobileList({ mobiles }: { mobiles: Mobile[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mobiles.map((mobile, index) => (
        <MobileCard key={index} mobile={mobile} />
      ))}
    </div>
  );
}
