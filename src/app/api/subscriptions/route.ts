import { NextRequest, NextResponse } from 'next/server';
import { stripeService } from '@/lib/stripe/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function updatePipeline(message: string) {
  try {
    await execAsync(`/home/team/shared/sales/update_pipeline.sh "${message}"`);
  } catch (error) {
    console.error('Failed to update pipeline:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { customerId, planId, amount } = await req.json();

    if (!customerId || !planId || !amount) {
      return NextResponse.json({ status: 'error', message: 'Missing required fields' }, { status: 400 });
    }

    const session = await stripeService.createCheckoutSession(customerId, planId, amount);

    await updatePipeline(`STRIPE CHECKOUT SESSION CREATED: ${planId} for customer ${customerId}. URL: ${session.url}`);

    return NextResponse.json({ 
      status: 'success', 
      data: {
        id: session.id,
        url: session.url
      }
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
