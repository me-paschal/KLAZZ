const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json' }
});

export default async function handler(request) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405);
  }

  const formData = await request.formData();
  const email = formData.get('email');
  const interest = formData.get('interest') || 'waitlist';

  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email)) {
    return json({ error: 'Please provide a valid email address.' }, 400);
  }
  if (!['waitlist', 'ambassador'].includes(interest)) {
    return json({ error: 'Please choose a valid application type.' }, 400);
  }
  if (!process.env.FORMSPREE_ENDPOINT) {
    return json({ error: 'The form service has not been configured.' }, 500);
  }

  const payload = new URLSearchParams({
    email,
    interest: interest === 'ambassador' ? 'Campus ambassador application' : 'Waitlist signup',
    _subject: interest === 'ambassador'
      ? 'New campus ambassador application'
      : 'New Klazz waitlist signup'
  });

  try {
    const formspreeResponse = await fetch(process.env.FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload.toString()
    });
    if (!formspreeResponse.ok) {
      return json({ error: 'Unable to submit your application right now.' }, 502);
    }
    return json({ ok: true });
  } catch {
    return json({ error: 'Unable to submit your application right now.' }, 502);
  }
}

export const config = {
  path: '/api/waitlist',
  method: ['POST']
};
