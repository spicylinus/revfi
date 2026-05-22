import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const offerPath = path.join(process.cwd(), '../../sales/offers/grand-slam.json');
    // Note: In a real environment, this would be relative to the frontend root.
    // Since we are in /home/team/shared/frontend/src/app/api/offers/route.ts
    // The shared folder is /home/team/shared/
    
    // Let's use the absolute path for safety in this environment.
    const absolutePath = '/home/team/shared/sales/offers/grand-slam.json';
    const offerData = await fs.readFile(absolutePath, 'utf-8');
    const offer = JSON.parse(offerData);

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
