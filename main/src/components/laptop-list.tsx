
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

export interface Laptop {
  image: string;
  brand: string;
  specs: string;
  amazon_link: string;
  price: string;
}

function LaptopCard({ laptop }: { laptop: Laptop }) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative w-full h-64">
        <Image
          src={laptop.image}
          alt={laptop.brand}
          data-ai-hint={`${laptop.brand} laptop`}
          fill
          className="object-contain"
        />
      </div>
      <CardHeader>
        <CardTitle>{laptop.brand}</CardTitle>
        <CardDescription>{laptop.specs}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow"></CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-lg font-bold">{laptop.price}</p>
        <Button asChild>
          <a
            href={laptop.amazon_link}
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

export function LaptopList({ laptops }: { laptops: Laptop[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {laptops.map((laptop, index) => (
        <LaptopCard key={index} laptop={laptop} />
      ))}
    </div>
  );
}
