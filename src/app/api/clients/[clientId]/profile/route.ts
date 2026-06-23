import { NextRequest, NextResponse } from 'next/server';
import { CLIENT_DELIVERIES } from '@/lib/mock-deliveries';

export async function POST(
  req: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const clientId = params.clientId;
  const data = await req.json();

  if (!CLIENT_DELIVERIES[clientId]) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  // In a real app, we would save this to a database
  // For now, we simulate success and log the change
  console.log(`Updating profile for client ${clientId}:`, data);

  // Update in-memory for current session (if applicable)
  if (CLIENT_DELIVERIES[clientId]) {
    CLIENT_DELIVERIES[clientId].profile = {
      ...CLIENT_DELIVERIES[clientId].profile,
      ...data
    };
  }

  return NextResponse.json({ success: true, profile: CLIENT_DELIVERIES[clientId].profile });
}
