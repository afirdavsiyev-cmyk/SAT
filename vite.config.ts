/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Custom plugin to serve videos and media with proper HTTP 206 Partial Content Range support & MIME types
function videoStreamPlugin() {
  return {
    name: 'video-stream-plugin',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const rawUrl = req.url?.split('?')[0] || '';
        const decodedUrl = decodeURIComponent(rawUrl);
        if (decodedUrl.startsWith('/videos/') || decodedUrl.endsWith('.pdf')) {
          const filePath = path.join(__dirname, 'public', decodedUrl);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const stat = fs.statSync(filePath);
            const fileSize = stat.size;
            const ext = path.extname(filePath).toLowerCase();
            const contentType =
              ext === '.mp4'
                ? 'video/mp4'
                : ext === '.pdf'
                ? 'application/pdf'
                : ext === '.jpg' || ext === '.jpeg'
                ? 'image/jpeg'
                : ext === '.png'
                ? 'image/png'
                : 'application/octet-stream';

            const range = req.headers.range;
            if (range && (ext === '.mp4' || ext === '.pdf')) {
              const parts = range.replace(/bytes=/, '').split('-');
              const start = parseInt(parts[0], 10);
              const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
              const chunksize = end - start + 1;
              const file = fs.createReadStream(filePath, { start, end });
              res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': contentType,
                'Cache-Control': 'no-cache',
              });
              file.pipe(res);
              return;
            } else {
              res.writeHead(200, {
                'Content-Length': fileSize,
                'Content-Type': contentType,
                'Accept-Ranges': 'bytes',
                'Cache-Control': 'public, max-age=3600',
              });
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), videoStreamPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      ignored: [
        '**/videos_to_add/**',
        '**/questions_to_add/**',
        '**/scripts/**',
        '**/*.pdf',
        '**/public/**',
      ],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
