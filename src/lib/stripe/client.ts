import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51P...'; // Placeholder
const HOST = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2026-04-22.dahlia', // Or latest
});

export class StripeService {
  async createCustomer(email: string, name?: string) {
    return await stripe.customers.create({
      email,
      name,
    });
  }

  async createPaymentLink(amount: number, description: string, customerId?: string) {
    // For Payment Links, we first need a product or price
    const product = await stripe.products.create({
      name: description,
    });

    const price = await stripe.prices.create({
      unit_amount: amount * 100, // Stripe uses cents
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
    // Map planId to price (in a real app, these would be pre-created)
    let productName = '';
    if (planId === 'seo') productName = 'SEO Dominance';
    else if (planId === 'lead-gen') productName = 'Lead Gen Engine';
    else if (planId === 'monitoring') productName = 'Visibility Monitoring Tier';

    const product = await stripe.products.create({
      name: productName,
    });

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

export const stripeService = new StripeService();
