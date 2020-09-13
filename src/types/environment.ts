// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV?: "development" | "production" | "test";
    HOST: string;
    PORT: string;
    DB_USER: string;
    DB_HOST: string;
    DB_DATABASE: string;
    DB_PASSWORD: string;
    DB_PORT: string;
  }
}
