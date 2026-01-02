import { fileURLToPath } from 'node:url'
import { defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig(async () => {
  const resolvedViteConfig = typeof viteConfig === 'function'
    ? await viteConfig({ command: 'serve', mode: 'test' })
    : viteConfig

  return {
    ...resolvedViteConfig,
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }
})
