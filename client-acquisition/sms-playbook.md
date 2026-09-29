# Cold SMS / Permission-Based SMS Playbook

## Reality Check

Do not blast cold marketing SMS to scraped numbers.

In the US, business texting through A2P 10DLC expects documented opt-in, opt-out handling, and campaign registration. Carriers and providers like Twilio require a real consent flow, brand identity, and STOP/HELP support. Use SMS after a prospect has opted in or after a real one-to-one conversation where they invited a text.

The goal is:

1. Use cold email, LinkedIn, or a website contact form to start the conversation.
2. Ask permission to text the short ROI breakdown.
3. Text only after permission.
4. Always identify Orbit Websites and include STOP language.

## Website SMS Consent Copy

Add this near any phone field if you collect opt-ins:

> By checking this box, I agree to receive text messages from Orbit Websites about website and AI operations services. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out or HELP for help. Mobile opt-in data will not be shared with third parties for marketing or promotional purposes.

Checkbox must be optional and unchecked by default.

## SMS Consent Ask By Email

Subject: quick question about after-hours leads

Hi {{first_name}},

I noticed {{company}} handles {{emergency service / catering inquiries / quote requests}}.

I have a short ROI example showing how an AI intake website can save admin cost and recover missed jobs.

Can I text it to you? It is 3 lines.

Thakshak  
Orbit Websites  
609 662 8052

## If They Reply Yes: First SMS

Orbit Websites here. Quick math: one avoided admin/dispatcher hire can save $35K-$54K/yr, and two recovered jobs/events can add $5K-$12K/mo. I build the intake/pricing/booking system for that. Reply STOP to opt out.

## Home Services SMS After Opt-In

Orbit Websites here. For {{company}}, the gap is after-hours emergency leads. A site can qualify urgency, collect job info, and route/book before a dispatcher sees it. One avoided admin hire = $35K-$54K/yr. Reply STOP to opt out.

## Catering SMS After Opt-In

Orbit Websites here. For {{company}}, corporate planners often book whoever sends the first concrete proposal. I build intake systems that turn guest/menu/venue info into a proposal link in minutes. Reply STOP to opt out.

## Follow-Up SMS 48 Hours Later

Worth a quick 10-min call? The point is not a prettier website. It is replacing slow intake and capturing high-intent jobs before competitors respond. Orbit Websites. Reply STOP to opt out.

## Voicemail-To-SMS Script

If you call and they do not answer, do not text unless they have a public business number and you are sending a manual one-to-one message with clear identity and opt-out. Safer path:

1. Leave voicemail.
2. Send email asking permission to text.
3. Text only after they reply yes.

Voicemail:

> Hi, this is Thakshak from Orbit Websites. I’m local to Central Jersey. I’m reaching out because companies like yours lose money when quote requests or emergency leads wait for manual follow-up. I’ll email you a short ROI example. If it makes sense, we can talk for 10 minutes.

## Manual One-To-One SMS If You Already Spoke

Hi {{first_name}}, Thakshak from Orbit Websites. Good talking earlier. Here’s the model: $35K-$54K/yr admin savings + recovered high-intent jobs from faster intake. Projects page: {{live_url}} Reply STOP to opt out.

## STOP / HELP Replies

STOP reply:

> Orbit Websites: you are opted out and will not receive further texts.

HELP reply:

> Orbit Websites: call 609 662 8052 or email orbitboyzz@gmail.com for help. Reply STOP to opt out.

## Send Timing

- Best windows: Tuesday-Thursday, 9:30-11:30 AM or 2:00-4:30 PM local time.
- Avoid Sundays, late nights, and early mornings.
- Keep under 320 characters when possible.
- Do not use URL shorteners.
- Do not send attachments or images in first touch.

## Best Workflow For This Offer

1. Cold email the top 20 prospects from `prospects.csv`.
2. Ask: "Can I text you the 3-line ROI math?"
3. If yes, send the first SMS.
4. If they reply, move to phone call or booked meeting.
5. If no reply after SMS follow-up, stop unless they engage again.
