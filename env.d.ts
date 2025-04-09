/// <reference types="node" />

enum NodeEnv {
  Development = 'development',
  Test = 'test',
  Production = 'production',
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_KEY: string;
      SENTRY_AUTH_TOKEN: string;
      VERCEL_GIT_COMMIT_SHA: string;
      NEXT_PUBLIC_API_BASE_URL: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      NEXT_PUBLIC_DATADOG_APPLICATION_ID: string;
      NEXT_PUBLIC_DATADOG_CLIENT_TOKEN: string;
      NEXT_PUBLIC_DATADOG_SITE: string;
      NEXT_PUBLIC_APP_VERSION: string;
      NEXT_PUBLIC_SITE_URL: string;
      NODE_ENV: NodeEnv;
      PORT: string;
    }
  }
}

export {};
