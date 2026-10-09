interface Env {
  STRIPE_SECRET_KEY: string;
}

interface CheckoutRequest {
  amount: number; // in dollars
  description: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as CheckoutRequest;
    const { amount, description, customerEmail, metadata } = body;

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid amount' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create Stripe Checkout Session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'success_url': `${new URL(context.request.url).origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${new URL(context.request.url).origin}/book`,
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][unit_amount]': (amount * 100).toString(), // Convert to cents
        'line_items[0][price_data][product_data][name]': description,
        'line_items[0][quantity]': '1',
        ...(customerEmail ? { 'customer_email': customerEmail } : {}),
        ...(metadata ? Object.entries(metadata).reduce((acc, [key, value], index) => {
          acc[`metadata[${key}]`] = value;
          return acc;
        }, {} as Record<string, string>) : {}),
      }).toString(),
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('Stripe API error:', errorText);
      throw new Error('Failed to create checkout session');
    }

    const session = await stripeResponse.json() as { id: string; url: string };

    return new Response(JSON.stringify({
      sessionId: session.id,
      url: session.url
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Checkout creation error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to create checkout session. Please try again or contact us directly.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
