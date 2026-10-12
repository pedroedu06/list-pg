import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { vitestExpo } from 'vitest-expo';

const fromRoot = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [vitestExpo({ platform: 'android' })],
  resolve: {
    // espelha os paths do tsconfig.json
    alias: [
      { find: /^@\/assets\//, replacement: fromRoot('./assets/') },
      { find: /^@\//, replacement: fromRoot('./src/') },
    ],
  },
  test: { globals: true, setupFiles: ['./vitest.setup.ts'] },
});
