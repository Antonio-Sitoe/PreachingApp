import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schemas',
  out: './src/database/migrations',
  dialect: 'sqlite',
  driver: 'expo',
});
