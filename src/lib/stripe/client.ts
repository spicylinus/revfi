import Stripe from 'stripe';

const HOST = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
  return new Stripe(key, { apiVersion: '2026-04-22.dahlia' as any });
}

export { getStripe };

export class StripeService {
  async createCustomer(email: string, name?: string) {
    return await getStripe().customers.create({ email, name });
  }

  async createPaymentLink(amount: number, description: string, customerId?: string) {
    const stripe = getStripe();
    const product = await stripe.products.create({ name: description });
    const price = await stripe.prices.create({
      unit_amount: amount * 100,
      currency: 'usd',
      product: product.id,
    });
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      after_completion: { type: 'redirect', redirect: { url: `${HOST}/delivery?status=success` } },
    });
    return paymentLink;
  }

  async createCheckoutSession(customerId: string, planId: 'seo' | 'lead-gen' | 'monitoring', amount: number) {
    const stripe = getStripe();
    let productName = '';
    if (planId === 'seo') productName = 'SEO Dominance';
    else if (planId === 'lead-gen') productName = 'Lead Gen Engine';
    else if (planId === 'monitoring') productName = 'Visibility Monitoring Tier';

    const product = await stripe.products.create({ name: productName });
    const price = await stripe.prices.create({
      unit_amount: amount * 100,
      currency: 'usd',
      recurring: { interval: 'month' },
      product: product.id,
    });

    return await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: price.id, quantity: 1 }],
      mode: 'subscription',
      success_url: `${HOST}/delivery?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${HOST}/billing`,
    });
  }
}