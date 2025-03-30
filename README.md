# Astro Blog 

A modern blog built with [Astro](https://astro.build/), featuring multi-language support and UTF-8 encoding.

## Features

- Fast and lightweight blog platform
- Markdown and MDX support for content creation
- Proper UTF-8 encoding for multi-language content (including Chinese)
- Tailwind CSS for styling
- Tag-based content organization

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd blog-astro

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The site will be available at http://localhost:4321

### Building for Production

```bash
# Build the site
npm run build

# Preview the built site
npm run preview
```

## Project Structure

- `src/pages/` - All page templates
- `src/content/blog/` - Blog posts in Markdown/MDX format
- `src/components/` - Reusable components
- `src/styles/` - Global styles
- `public/` - Static assets

## Multi-language Support

This blog supports multi-language content including proper UTF-8 encoding for characters in various languages like Chinese.

## License

MIT
