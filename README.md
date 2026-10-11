This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## x402 bot paywall

Humans browse free. AI crawlers / scrapers (GPTBot, ClaudeBot, PerplexityBot,
CCBot, curl, python-requests, …) get `HTTP 402` with standard
[x402](https://github.com/coinbase/x402) payment requirements ($0.001 USDC on
Base per request); if they pay, they get the page with a `PAYMENT-RESPONSE`
settlement header.

- Logic: `src/lib/x402-bot-paywall.ts` (`BOT_UA_PATTERNS`, allow-list, free paths),
  called from `src/proxy.ts`. Uses `@x402/next`, `@x402/core`, `@x402/evm`, `@coinbase/x402`.
- Never charged: Googlebot, Bingbot, DuckDuckBot, Slurp, Applebot, social link
  previewers, Vercel, uptime monitors. Always free: `/robots.txt`, sitemaps,
  favicons, `/llms.txt`, `/.well-known/*`, static assets, `/api/*`.
- Fails open: any error or facilitator outage serves the page normally.
- Config via env — see `.env.example`. `X402_ENABLED=false` turns it off.
  **Base mainnet needs `CDP_API_KEY_ID` + `CDP_API_KEY_SECRET`** (Coinbase CDP
  facilitator); the public x402.org facilitator only supports testnets, so
  without CDP keys the paywall fails open and bots are served free.

Test: `curl -i -A GPTBot http://localhost:3000/` → 402 JSON;
`curl -i -A Googlebot http://localhost:3000/` → 200.
