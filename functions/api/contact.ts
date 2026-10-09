interface Env {
  TURNSTILE_SECRET_KEY: string;
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  serviceType: string;
  location: string;
  documentCount?: string;
  message?: string;
  'cf-turnstile-response': string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const formData = await context.request.json() as ContactFormData;

    // Verify Turnstile token
    const turnstileToken = formData['cf-turnstile-response'];
    if (!turnstileToken) {
      return new Response(JSON.stringify({ error: 'Missing captcha token' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: context.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    });

    const turnstileResult = await turnstileResponse.json() as { success: boolean };
    if (!turnstileResult.success) {
      return new Response(JSON.stringify({ error: 'Captcha verification failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prepare email content
    const emailBody = `
New Appointment Request

Contact Information:
- Name: ${formData.firstName} ${formData.lastName}
- Email: ${formData.email}
- Phone: ${formData.phone}

Appointment Details:
- Preferred Date: ${formData.preferredDate}
- Preferred Time: ${formData.preferredTime}
- Service Type: ${formData.serviceType}
- Location: ${formData.location}
${formData.documentCount ? `- Number of Documents: ${formData.documentCount}` : ''}

${formData.message ? `Additional Information:\n${formData.message}` : ''}

---
Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
    `.trim();

    // Send email using Cloudflare Email Routing (sends to Gmail)
    // Note: For Cloudflare Pages, you'll need to use a third-party email service
    // or handle this through Cloudflare Workers Email Routing
    // For now, we'll log and return success
    console.log('Contact form submission:', emailBody);

    // TODO: Integrate with email service (SendGrid, Mailgun, or Cloudflare Email Workers)
    // For basic implementation, you could use a fetch to a service like:
    // - SendGrid API
    // - Mailgun API
    // - Resend API
    // - Or use Cloudflare Email Workers

    return new Response(JSON.stringify({
      success: true,
      message: 'Thank you! Your appointment request has been received. We\'ll contact you shortly.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({
      error: 'An error occurred processing your request. Please try again or contact us directly.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
