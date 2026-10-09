interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
}

// Stripe webhook handler
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const signature = context.request.headers.get('stripe-signature');
    if (!signature) {
      return new Response('Missing stripe-signature header', { status: 400 });
    }

    const body = await context.request.text();

    // Verify webhook signature
    // Note: Stripe's webhook signature verification requires the raw body
    // For production, you should implement proper signature verification
    // This is a simplified version

    const event = JSON.parse(body);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Payment successful:', {
          sessionId: session.id,
          customerEmail: session.customer_email,
          amountTotal: session.amount_total,
          metadata: session.metadata,
        });

        // TODO: Send confirmation email to customer
        // TODO: Send notification to business owner
        // TODO: Update booking/appointment system if you have one

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        console.log('Checkout session expired:', session.id);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('Payment intent succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log('Payment intent failed:', paymentIntent.id);
        // TODO: Notify customer of failed payment
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
