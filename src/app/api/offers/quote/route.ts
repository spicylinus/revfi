import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { offerId, options } = await req.json();

    let quote = {
      price: 0,
      bnplEnabled: true,
      description: ''
    };

    if (offerId === 'website-redesign-bnpl') {
      if (options?.payInFull) {
        quote.price = 4500;
        quote.description = 'Website Redesign (10% Pay-In-Full Discount)';
      } else {
        quote.price = 5000;
        quote.description = 'Website Redesign ($2,500 Deposit + $2,500 on Completion)';
      }
    } else if (offerId === 'dominance-stack' || offerId === 'grand-slam-bundle' || offerId === 'grand-slam') {
      if (options?.payInFull) {
        quote.price = 4500;
        quote.description = 'The Dominance Stack (Pay-In-Full Savings: $1,500 Off + $4,500 in Bonuses)';
      } else {
        quote.price = 6000;
        quote.description = 'The Dominance Stack ($3,000 Deposit + $3,000 on Go-Live)';
      }
    } else {
      return NextResponse.json({ status: 'error', message: 'Invalid offer ID' }, { status: 400 });
    }

    return NextResponse.json({ status: 'success', data: quote });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
