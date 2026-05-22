import { NextRequest, NextResponse } from 'next/server';
import { stripeService } from '@/lib/stripe/client';

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    if (!email) {
      return NextResponse.json({ status: 'error', message: 'Email is required' }, { status: 400 });
    }

    const customer = await stripeService.createCustomer(email, name);

    return NextResponse.json({ status: 'success', data: customer });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
