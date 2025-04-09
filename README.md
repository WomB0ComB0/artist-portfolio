# Artist Portfolio Project Setup Guide

This guide will walk you through setting up the Artist Portfolio project, a Next.js application with Supabase integration for image uploads and user authentication.

## Prerequisites

- Node.js (latest LTS version recommended)
- Bun (for package management and scripts)
- Supabase account
- PostgreSQL (for local development)

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd artist-portfolio
```

## Step 2: Environment Setup

1. Create a `.env` file based on the provided `.env.example`:

```bash
cp .env.example .env
```

2. Fill in the environment variables:

```
PORT=3000                           # Port for local development
NODE_ENV=development                # Environment (development, production)
SENTRY_AUTH_TOKEN=                  # Sentry authentication token (optional for error tracking)
NEXT_PUBLIC_API_KEY=                # Your API key if needed
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Your site URL
NEXT_PUBLIC_API_BASE_URL=           # Base URL for API calls
NEXT_PUBLIC_DATADOG_SITE=           # DataDog site (optional for monitoring)
NEXT_PUBLIC_SUPABASE_URL=           # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Your Supabase anon/public key
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=   # DataDog client token (optional)
NEXT_PUBLIC_DATADOG_APPLICATION_ID= # DataDog application ID (optional)
```

## Step 3: Supabase Setup

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Get your Supabase URL and anon key from the project settings and add them to your `.env` file
3. Set up the database schema using the provided `seed.sql` file:

   - Navigate to the SQL Editor in your Supabase dashboard
   - Create a new query and paste the contents of `seed.sql`
   - Run the query to create the `image_uploads` table:

```sql
CREATE TABLE image_uploads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

4. Enable Storage in Supabase:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket called `assets` (or your preferred name)
   - Set appropriate permissions for the bucket

## Step 4: Install Dependencies

Using Bun (recommended):

```bash
bun install
```

Or using npm:

```bash
npm install
```

## Step 5: Run the Development Server

```bash
bun run dev
```

Or:

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000) (or the port you specified in your `.env` file).

## Step 6: Additional Configuration

### Authentication Setup

1. Configure authentication providers in your Supabase dashboard
2. Set up email templates if needed
3. Configure redirect URLs for authentication

### Storage Rules

Set up appropriate storage rules in Supabase for the `assets` bucket to control who can upload and access images.

## Project Structure

- `/src` - Main application code
- `/public` - Static assets
- `/assets` - Uploaded images (handled by Supabase storage)

## Available Scripts

- `bun run dev` - Start the development server
- `bun run build` - Build the application for production
- `bun run start` - Start the production server
- `bun run lint` - Run linting
- `bun run lint:bun` - Run linting with Biome and Stylelint
- `bun run type-check` - Check TypeScript types

## Technologies Used

- Next.js 14
- React 18
- Supabase (Authentication, Database, Storage)
- TypeScript
- Tailwind CSS
- Radix UI components
- React Query
- Zod for validation
- Framer Motion for animations
- Million.js for optimization

## Deployment

This project can be deployed to Vercel, Netlify, or any other platform that supports Next.js applications. Make sure to set up all the environment variables in your deployment platform.
