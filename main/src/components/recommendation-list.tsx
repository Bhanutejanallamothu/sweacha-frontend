'use client';

import type { GadgetRecommendation } from '@/lib/types';
import {
  ChevronsUpDown,
  Filter,
  Laptop,
  Smartphone,
  Tablet,
  Headphones,
  HardDrive,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import Image from 'next/image';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Skeleton } from './ui/skeleton';

const GadgetIcon = ({
  type,
  className,
}: {
  type: string;
  className?: string;
}) => {
  switch (type.toLowerCase()) {
    case 'laptop':
      return <Laptop className={className} />;
    case 'tablet':
      return <Tablet className={className} />;
    case 'smart gadget':
      return <Smartphone className={className} />;
    case 'accessory':
      return <Headphones className={className} />;
    default:
      return <HardDrive className={className} />;
  }
};

function GadgetCard({ gadget }: { gadget: GadgetRecommendation }) {
  const getImageSrc = (gadget: GadgetRecommendation) => {
    if (gadget.model.includes('WH-1000XM5')) {
      return 'https://picsum.photos/seed/headphones/600/400';
    }
    if (gadget.model.includes('MX Master 3S')) {
      return 'https://picsum.photos/seed/mouse/600/400';
    }
    return `https://picsum.photos/seed/${gadget.model}/600/400`;
  }
  
  const getAiHint = (gadget: GadgetRecommendation) => {
     if (gadget.model.includes('WH-1000XM5')) {
      return 'headphones';
    }
    if (gadget.model.includes('MX Master 3S')) {
      return 'computer mouse';
    }
    return `${gadget.gadgetType} ${gadget.brand}`;
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="relative h-48 w-full">
        <Image
          src={getImageSrc(gadget)}
          alt={gadget.model}
          data-ai-hint={getAiHint(gadget)}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{gadget.model}</CardTitle>
            <p className="text-sm text-muted-foreground">{gadget.brand}</p>
          </div>
          <Badge variant="secondary" className="whitespace-nowrap">
            ${gadget.price}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <GadgetIcon type={gadget.gadgetType} className="h-4 w-4" />
          <span className="capitalize">{gadget.gadgetType}</span>
        </div>
        <p className="flex-grow text-sm text-muted-foreground">
          {gadget.description}
        </p>
        <Button asChild className="mt-4 w-full">
          <a href={gadget.dealUrl} target="_blank" rel="noopener noreferrer">
            View Deal
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

function GadgetSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <Skeleton className="h-48 w-full" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-4 h-10 w-full" />
      </CardContent>
    </Card>
  );
}

const allCategories = ['laptop', 'tablet', 'smart gadget', 'accessory'];

export function RecommendationList({
  recommendations,
  isLoading,
}: {
  recommendations: GadgetRecommendation[];
  isLoading: boolean;
}) {
  const [maxPrice, setMaxPrice] = useState(3000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((gadget) => {
      const priceMatch = gadget.price <= maxPrice;
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(gadget.gadgetType);
      return priceMatch && categoryMatch;
    });
  }, [recommendations, maxPrice, selectedCategories]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  if (recommendations.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold tracking-tight">
        <ChevronsUpDown className="h-6 w-6" /> Your Personalized Gadgets
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Max Price: ${maxPrice.toLocaleString()}</Label>
                <Slider
                  min={100}
                  max={3000}
                  step={50}
                  defaultValue={[maxPrice]}
                  onValueChange={(value) => setMaxPrice(value[0])}
                  className="mt-2"
                />
              </div>
              <Separator />
              <div>
                <Label>Categories</Label>
                <div className="mt-2 space-y-2">
                  {allCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        onCheckedChange={() => handleCategoryChange(category)}
                        checked={selectedCategories.includes(category)}
                      />
                      <label
                        htmlFor={category}
                        className="text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="md:col-span-3">
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <GadgetSkeleton key={i} />
              ))}
            </div>
          )}
          {!isLoading && filteredRecommendations.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRecommendations.map((gadget, index) => (
                <GadgetCard key={`${gadget.model}-${index}`} gadget={gadget} />
              ))}
            </div>
          )}
          {!isLoading &&
            recommendations.length > 0 &&
            filteredRecommendations.length === 0 && (
              <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-center text-muted-foreground">
                  No gadgets match your current filters.
                  <br />
                  Try adjusting the price or category.
                </p>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}
