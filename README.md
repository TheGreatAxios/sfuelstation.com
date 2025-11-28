# sFUEL Station

A Next.js application for claiming sFUEL tokens across multiple SKALE chains.

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

- `ARCJET_KEY` - Your Arcjet site key (get from https://app.arcjet.com). Required for bot protection and rate limiting.

## Development

From your terminal:

```sh
pnpm dev
```

This starts your app in development mode with Turbopack.

## Deployment

First, build your app for production:

```sh
pnpm build
```

Then run the app in production mode:

```sh
pnpm start
```
