/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    TOKEN_SECRET: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_DATABASE_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    AWS_BUCKET_NAME: string;
    AWS_REGION: string;
    AWS_ACCESS_KEY: string;
    AWS_SECRET: string;
    TWILIO_ACCOUNT_SID: string;
    TWILIO_AUTH_TOKEN: string;
    TWILIO_SERVICE_SID: string;
    STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_SECRET_KEY: string;
    REDIRECT_URL: string;
    REDIRECT_FE_URL: string;
  }
}
