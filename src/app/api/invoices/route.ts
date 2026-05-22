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
    const body = await req.json();
    const { customerId, amount, description } = body;

    if (!amount) {
      return NextResponse.json({ status: 'error', message: 'Missing required fields' }, { status: 400 });
    }

    // Call Stripe to create a payment link
    const paymentLink = await stripeService.createPaymentLink(amount, description, customerId);

    await updatePipeline(`STRIPE PAYMENT LINK CREATED: ${paymentLink.id} for amount ${amount}. URL: ${paymentLink.url}`);

    return NextResponse.json({ 
      status: 'success', 
      data: { 
        id: paymentLink.id,
        url: paymentLink.url 
      } 
    });
  } catch (error: any) {
    console.error('Error creating Stripe payment link:', error.message);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
