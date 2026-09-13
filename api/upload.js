import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bmplfuzkyyuqtlfgifvm.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtcGxmdXpreXl1cXRsZmdpZnZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjIxODA2NywiZXhwIjoyMDk3Nzk0MDY3fQ.zL_rLi4XuPryquqJCW4fv4k8PZFYzvW67mozqwRnkvM';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { filename, base64Data, folder = 'uploads' } = body || {};
    if (!filename || !base64Data) {
      return res.status(400).json({ error: 'Missing filename or base64Data' });
    }

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

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ error: error.message });
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/website_data/${filePath}`;
    return res.status(200).json({ success: true, url: publicUrl, path: filePath });
  } catch (err) {
    console.error('Upload handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
