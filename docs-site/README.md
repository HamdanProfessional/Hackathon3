# LearnFlow Documentation Site

Docusaurus-powered documentation site with Nebula Space theme, integrated into the LearnFlow frontend at `/docs`.

## Overview

The documentation site provides comprehensive project documentation including:
- Architecture overview
- Phase completion summaries
- MCP integration details
- Skills autonomy demo
- Cross-agent compatibility
- And more...

## Tech Stack

- **Framework**: Docusaurus 3.9.2
- **Search**: @easyops-cn/docusaurus-search-local (local search, no Algolia required)
- **Styling**: Custom Nebula Space theme matching the frontend
- **Language**: TypeScript

## Features

### Nebula Space Theme
- Deep space dark background (`#0f111a`)
- Nebula violet primary color (#8b5cf6)
- Cosmic accents: Blue, Pink, Cyan
- Glass morphism cards with backdrop blur
- Gradient text for headings
- Custom scrollbars with gradient styling
- Dark/light mode toggle

### Local Search
- Full-text search across all documentation
- No external API dependencies (Algolia not required)
- Instant search results
- Search result highlighting

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd docs-site
npm install
```

### Development

Start the Docusaurus dev server on port 3003:

```bash
npm run start
```

Or specify a custom port:

```bash
npx docusaurus start --port 3003
```

### Build

Build the static site for production:

```bash
npm run build
```

The built files will be in the `build/` directory.

### Serve Production Build

```bash
npm run serve
```

## Integration with Frontend

The documentation is integrated into the main LearnFlow frontend using Next.js rewrites:

1. **Docusaurus runs on port 3003** - Separate dev server
2. **Next.js proxies `/docs/*` requests** - Via rewrites in `next.config.ts`
3. **Static assets are proxied correctly** - CSS, JS, images all work

### To Run Integrated Docs

**Terminal 1: Start Docusaurus**
```bash
cd docs-site
npx docusaurus start --port 3003
```

**Terminal 2: Start Next.js Frontend**
```bash
cd learnflow-app/frontend
npm run dev
```

Then visit: `http://localhost:3000/docs` (or whatever port Next.js starts on)

### How It Works

The Next.js config includes these rewrites:

```typescript
async rewrites() {
  return [
    {
      source: '/docs',
      destination: 'http://localhost:3003/',
    },
    {
      source: '/docs/:path*',
      destination: 'http://localhost:3003/:path*',
    },
  ];
}
```

This seamlessly proxies all `/docs` requests to the Docusaurus server while keeping the URLs clean.

## Project Structure

```
docs-site/
├── docs/                    # Documentation markdown files
│   ├── intro.md
│   ├── overview.md
│   ├── architecture-complete.md
│   ├── phase-3-complete.md
│   ├── phase-4-complete.md
│   ├── phase-4-continued-summary.md
│   ├── phase-4-final-complete.md
│   ├── skills-autonomy-demo.md
│   ├── SKILLS_CATALOG.md
│   └── ...
├── src/
│   ├── css/
│   │   └── custom.css       # Nebula Space theme (650+ lines)
│   └── pages/
│       └── index.jsx         # React home page
├── sidebars.ts              # Navigation configuration
├── docusaurus.config.ts     # Docusaurus configuration
├── package.json
└── README.md
```

## Configuration

### Docusaurus Config

Key settings in `docusaurus.config.ts`:

- **Route base path**: `/` (docs are at root)
- **Dark mode**: Default, with toggle enabled
- **Local search**: Enabled via `@easyops-cn/docusaurus-search-local`
- **Custom CSS**: Nebula Space theme
- **GitHub integration**: Edit links configured

### Sidebar Navigation

The `sidebars.ts` file defines the documentation structure:

- Introduction
- Overview
- Architecture
- Phase summaries
- MCP integration
- Skills catalog

## Customization

### Adding New Documentation

1. Create a new markdown file in `docs/`
2. Add it to `sidebars.ts` under the appropriate category
3. Restart the dev server

### Modifying the Theme

Edit `src/css/custom.css` to customize:
- Colors (CSS variables)
- Typography
- Component styles
- Effects (glass, glow, gradients)

### Changing Navigation

Edit `docusaurus.config.ts` to modify:
- Navbar items
- Footer links
- Theme configuration

## Deployment

### Static Site Deployment

Build and deploy the `build/` directory to any static hosting service:

- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront

### Environment Variables

No environment variables required for local development.

For production, update these in `docusaurus.config.ts`:
- `url`: Production URL
- `baseUrl`: Base path (usually `/`)
- `organizationName`: GitHub org/user
- `projectName`: Repository name

## Related Links

- [Main Project README](../README.md)
- [Frontend Documentation](../learnflow-app/frontend/README.md)
- [Backend Documentation](../learnflow-app/backend/README.md)
- [CLAUDE.md](../CLAUDE.md) - Project constitution

---

**Last Updated**: 2026-01-26
**Version**: 1.0.0
**Status**: Production Ready
