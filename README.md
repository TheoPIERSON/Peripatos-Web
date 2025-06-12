# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Peripatos Frontend

Frontend application for Peripatos project built with Nuxt.js 3.

## Architecture Overview

This project is built with the following technologies:

- **Framework**: Nuxt.js 3 (Vue 3)
- **Styling**: TailwindCSS
- **Database**: Supabase
- **UI Components**: Nuxt Icon
- **Fonts**: Google Fonts (Jost family)

## Project Structure

```
peripatos-front/
├── assets/           # Static assets
├── components/       # Reusable Vue components
├── composables/      # Composition API utilities
├── layouts/          # Nuxt.js layouts
├── middleware/       # Application middleware
├── pages/           # Nuxt.js pages
├── plugins/          # Vue plugins
├── server/           # Server-side code
├── store/            # Vuex store
├── supabase/         # Supabase configuration
├── types/           # TypeScript types
└── utils/           # Utility functions
```

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
Create a `.env` file with the following variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## Development

Start the development server:
```bash
pnpm dev
```

The application will be available at http://localhost:3000

## Production

Build the application for production:
```bash
pnpm build
```

Preview the production build locally:
```bash
pnpm preview
```

## Features

- Server-Side Rendering (SSR) enabled
- TailwindCSS for styling
- Supabase integration for backend
- Google Fonts (Jost) integration
- Modern Vue 3 Composition API
- TypeScript support

## Environment Variables

The following environment variables are required:
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase project API key

## Development Tools

- Nuxt DevTools enabled
- TypeScript support
- Hot Module Replacement (HMR)
- ESLint and Prettier integration

## License

MIT License

## Contributing

Feel free to submit issues and enhancement requests!
