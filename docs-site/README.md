# LearnFlow Documentation Site

## ⚠️ Note: Docusaurus Installation Blocked

The Docusaurus site setup is currently blocked due to memory limitations during `npm install` on the current Windows environment.

## ✅ What's Ready

The **Nebula Space Theme** for Docusaurus has been created and is ready to use:

| File | Description | Status |
|------|-------------|--------|
| `src/css/custom.css` | **650+ lines** of Nebula Space theme | ✅ Complete |
| `docusaurus.config.ts` | Docusaurus configuration | ✅ Complete |
| `sidebars.ts` | Navigation sidebar configuration | ✅ Complete |
| `package.json` | Dependencies and scripts | ✅ Complete |

## 🎨 Nebula Theme Features

The `custom.css` includes:
- ✅ All cosmic colors from frontend (`--nebula-cosmic-purple`, etc.)
- ✅ Dark mode matching `globals.css` exactly
- ✅ Glass morphism effects (`.glass-effect`)
- ✅ Nebula glow effects (`.nebula-glow`)
- ✅ Gradient text (`.text-gradient-nebula`)
- ✅ Custom scrollbar with gradient
- ✅ All Docusaurus component overrides

## 🚀 To Complete Setup

Choose one of these options:

### Option 1: Build on GitHub Actions (Recommended)

Push these files to GitHub and let GitHub Actions build the site:

```bash
git add .
git commit -m "feat: add Docusaurus with Nebula theme"
git push origin main
# GitHub Actions will build with more memory
```

### Option 2: Build on Machine with More RAM

Copy this directory to a machine with 8GB+ RAM:

```bash
cd docs-site
npm install
npm run build
npm run serve
```

### Option 3: Use Existing Documentation

The main documentation is already available in the `../docs/` directory with 16+ markdown files.

## 📚 Current Documentation

- [Main Documentation Index](../docs/index.md)
- [Project README](../README.md)
- [AGENTS.md](../AGENTS.md)
- [CLAUDE.md](../CLAUDE.md)

## 🎨 Nebula Theme Preview

Once deployed, the Docusaurus site will feature:

- **Deep space dark background** matching the frontend
- **Nebula violet** primary color (#8b5cf6)
- **Cosmic accents**: Blue, Pink, Cyan
- **Glass morphism** cards with backdrop blur
- **Gradient text** for headings
- **Custom scrollbars** with gradient styling
- **Starfield-inspired** design elements

---

**Created**: 2026-01-26
**Status**: Theme ready, waiting for deployment environment
