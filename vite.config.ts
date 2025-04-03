// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic', // Utilisation du runtime classique (peut aider pour certains projets)
      fastRefresh: true,
    }),
    // Compression GZIP et Brotli pour optimiser la taille des assets
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024,
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024,
    }),
  ],
  resolve: {
    alias: {
      // Assurez-vous que ces alias pointent vers les versions installées de vos dépendances
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
      // Vous pouvez ajouter d'autres alias ici si besoin (exemple pour lucide-react, etc.)
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime'
    ],
    exclude: ['lucide-react'],
  },
  build: {
    sourcemap: true, // Activez les source maps pour faciliter le debugging en prod
    target: 'esnext',
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Regrouper React, ReactDOM et React Router dans un même chunk
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router-dom')
          ) {
            return 'react';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    cssCodeSplit: true,
    minify: 'terser', // Forcer l'utilisation de Terser pour la minification
    terserOptions: {
      format: {
        comments: false,
        beautify: false, // Gardez false pour la prod, mettez true temporairement pour le débogage
        ecma: 2020,
      },
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          'console.log',
          'console.info',
          'console.debug',
          'console.warn',
          'console.error',
        ],
        passes: 3,
        ecma: 2020,
      },
      // Pour faciliter l'analyse en production, on peut désactiver temporairement le mangling.
      // ATTENTION : Pour la prod, activez le mangling pour obtenir un bundle plus compact.
      mangle: false,
    },
    reportCompressedSize: false,
    assetsInlineLimit: 8192,
    chunkSizeWarningLimit: 2000,
    emptyOutDir: true,
    commonjsOptions: { transformMixedEsModules: true },
    dynamicImportVarsOptions: { warnOnError: false },
    cssMinify: true,
    manifest: true,
  },
});