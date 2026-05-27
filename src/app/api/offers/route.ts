import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Legacy offer ID mapping — old IDs that should resolve to current offers
const LEGACY_ID_ALIASES: Record<string, string[]> = {
  'dominance-stack': ['grand-slam-bundle', 'grand-slam'],
};

export async function GET(req: NextRequest) {
  try {
    const absolutePath = '/home/team/shared/sales/offers/grand-slam.json';
    const offerData = await fs.readFile(absolutePath, 'utf-8');
    const offer = JSON.parse(offerData);

    // Add legacy aliases so old URLs (/upsell/grand-slam-bundle/) still resolve
    offer.offers = offer.offers.map((o: any) => {
      const aliases = LEGACY_ID_ALIASES[o.id] || [];
      return {
        ...o,
        legacyIds: aliases,
      };
    });

    return NextResponse.json(offer);
  } catch (error: any) {
    console.error('Error fetching offer:', error.message);
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
  }
}

export async function POST(req: NextRequest) {
  // Logic to track offer views or initial acceptance
  const body = await req.json();
  console.log('Offer interaction:', body);
  return NextResponse.json({ success: true });
}
