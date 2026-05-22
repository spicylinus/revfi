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
    const { offerId, customerId, customerEmail, customerName, options } = await req.json();

    if (!customerId && !customerEmail) {
      return NextResponse.json({ status: 'error', message: 'Customer info required' }, { status: 400 });
    }

    let finalCustomerId = customerId;
    if (!finalCustomerId) {
      const customer = await stripeService.createCustomer(customerEmail, customerName);
      finalCustomerId = customer.id;
    }

    let amount = 0;
    let description = '';

    if (offerId === 'website-redesign-bnpl') {
      amount = options?.payInFull ? 4500 : 5000;
      description = `Website Redesign - ${options?.payInFull ? 'Full Payment' : 'Split Payment'}`;
    } else if (offerId === 'grand-slam-bundle') {
      amount = 6000;
      description = 'Grand Slam Bundle Acceptance';
    }

    const paymentLink = await stripeService.createPaymentLink(amount, description, finalCustomerId);

    await updatePipeline(`OFFER ACCEPTED: ${offerId} by ${customerEmail || finalCustomerId}. Stripe Link: ${paymentLink.url}. Amount: ${amount}`);

    return NextResponse.json({ 
      status: 'success', 
      data: { 
        id: paymentLink.id,
        url: paymentLink.url
      } 
    });
  } catch (error: any) {
    console.error('Offer acceptance error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
