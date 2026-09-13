import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bmplfuzkyyuqtlfgifvm.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtcGxmdXpreXl1cXRsZmdpZnZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjIxODA2NywiZXhwIjoyMDk3Nzk0MDY3fQ.zL_rLi4XuPryquqJCW4fv4k8PZFYzvW67mozqwRnkvM';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function apiPlugin() {
  return {
    name: 'api-data-plugin',
    configureServer(server) {
      server.middlewares.use('/api/data', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { key, data } = JSON.parse(body);
              const jsonBuffer = Buffer.from(JSON.stringify(data, null, 2), 'utf-8');
              await supabase.storage.from('website_data').upload(`${key}.json`, jsonBuffer, {
                upsert: true,
                contentType: 'application/json'
              });
              const timestamp = Date.now();
              await supabase.storage.from('website_data').upload('metadata.json', Buffer.from(JSON.stringify({ lastUpdated: timestamp, updatedKey: key })), {
                upsert: true,
                contentType: 'application/json'
              });
              res.end(JSON.stringify({ success: true, key, updated_at: timestamp }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else if (req.method === 'GET') {
          const url = new URL(req.url, 'http://localhost:3000');
          const key = url.searchParams.get('key');
          try {
            const { data, error } = await supabase.storage.from('website_data').download(`${key}.json`);
            if (error) throw error;
            const text = await data.text();
            res.end(text);
          } catch (err) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: err.message }));
          }
        }
      });

      server.middlewares.use('/api/upload', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { filename, base64Data, folder = 'uploads' } = JSON.parse(body);
              let mimeType = 'image/jpeg';
              let base64Content = base64Data;
              if (base64Data.includes(';base64,')) {
                const parts = base64Data.split(';base64,');
                mimeType = parts[0].replace('data:', '');
                base64Content = parts[1];
              }
              const buffer = Buffer.from(base64Content, 'base64');
              const safeFilename = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
              const filePath = `${folder}/${safeFilename}`;
              const { error } = await supabase.storage.from('website_data').upload(filePath, buffer, {
                upsert: true,
                contentType: mimeType
              });
              if (error) throw error;
              const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/website_data/${filePath}`;
              res.end(JSON.stringify({ success: true, url: publicUrl, path: filePath }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  }
});
