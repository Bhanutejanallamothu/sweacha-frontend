/**
 * @fileOverview A service for fetching product deals from an external API.
 */
import { z } from 'zod';

const AmazonDealSchema = z.object({
  title: z.string(),
  price: z.number(),
  url: z.string().url(),
  category: z.string(),
});

export type AmazonDeal = z.infer<typeof AmazonDealSchema>;

/**
 * Fetches gadget deals from a mock Amazon API based on a search query.
 * In a real application, this would make a call to the Amazon Product Advertising API.
 * For now, it returns a hardcoded list of deals.
 * @param query - The search query for gadgets.
 * @returns A promise that resolves to an array of Amazon deals.
 */
export async function getAmazonDeals(query: string): Promise<AmazonDeal[]> {
  console.log(`Searching for deals with query: ${query}`);
  // Mock implementation. In a real scenario, you'd use the AMAZON_API_KEY
  // from process.env to make an authenticated request to the Amazon API.
  return Promise.resolve([
    {
      title: 'Apple MacBook Air M3',
      price: 999,
      url: 'https://www.amazon.com/dp/B0CT1M2L6P',
      category: 'laptop',
    },
    {
      title: 'Dell XPS 15 Laptop',
      price: 1499,
      url: 'https://www.amazon.com/dp/B0CQ4K2W9X',
      category: 'laptop',
    },
    {
      title: 'Sony WH-1000XM5 Headphones',
      price: 398,
      url: 'https://www.amazon.com/dp/B09XN8286S',
      category: 'accessory',
    },
    {
      title: 'Logitech MX Master 3S Mouse',
      price: 95,
      url: 'https://www.amazon.com/dp/B09H1PT82J',
      category: 'accessory',
    },
    {
      title: 'Samsung Galaxy Tab S9',
      price: 799,
      url: 'https://www.amazon.com/dp/B0C63RH1D1',
      category: 'tablet',
    },
  ]);
}
