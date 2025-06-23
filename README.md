# SIPP Karhutla (Sistem Informasi Pengendalian Pencegahan Karhutla)

A comprehensive forest fire prevention and control information system built with Next.js.

## Overview

SIPP Karhutla provides tools and information for monitoring, preventing, and controlling forest fires. The system includes geospatial visualization, real-time monitoring, and reporting features to help stakeholders manage forest fire risks effectively.

## System Requirements

- **Node.js**: v18.17.0 or later
- **npm**: v9.6.0 or later (or equivalent yarn/pnpm/bun version)
- **Operating System**: Windows 10/11, macOS 12+, or Linux
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Browser**: Latest versions of Chrome, Firefox, Safari, or Edge
- **Internet Connection**: Required for map services and data fetching

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Abrumz/sipp-karhutla.git
   cd sipp-karhutla
   move to branch development
   ```
2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:

   ```bash
   npm run dev
   ```

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

## Features

- Interactive maps using leaflet (Google Maps, ArcGIS, etc) integration
- Real-time forest fire monitoring
- Prevention planning tools
- Responsive design for desktop and mobile devices
- Data visualization dashboards

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) with Turbopack for faster development
- **UI Components**:
  - [MUI (Material-UI)](https://mui.com/)
  - [Headless UI](https://headlessui.com/)
  - [Heroicons](https://heroicons.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Maps**: [@react-google-maps/api](https://react-google-maps-api-docs.netlify.app/)
- **Typography**: [@fontsource/plus-jakarta-sans](https://fontsource.org/fonts/plus-jakarta-sans)
- **Static Type Checking**: [TypeScript](https://www.typescriptlang.org/)

## Development

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load fonts.

## Scripts

- `npm run dev` - Starts development server with Turbopack
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server
- `npm run lint` - Lints the codebase
- `npm run export` - Exports the application for static hosting
- `npm run tailwind:init` - Initializes Tailwind configuration

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing coding style.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
