import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bmplfuzkyyuqtlfgifvm.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtcGxmdXpreXl1cXRsZmdpZnZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjIxODA2NywiZXhwIjoyMDk3Nzk0MDY3fQ.zL_rLi4XuPryquqJCW4fv4k8PZFYzvW67mozqwRnkvM';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET request to fetch cloud data
  if (req.method === 'GET') {
    const { key } = req.query;
    if (!key) {
      return res.status(400).json({ error: 'Missing key parameter' });
    }

    try {
      const { data, error } = await supabase.storage.from('website_data').download(`${key}.json`);
      if (error) {
        return res.status(404).json({ error: error.message });
      }
      const text = await data.text();
      return res.status(200).json(JSON.parse(text));
    } catch (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // Handle POST request to update cloud data
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }

    const { key, data } = body || {};
    if (!key || data === undefined) {
      return res.status(400).json({ error: 'Missing key or data' });
    }

    try {
      const jsonBuffer = Buffer.from(JSON.stringify(data, null, 2), 'utf-8');
      const { error: uploadError } = await supabase.storage.from('website_data').upload(`${key}.json`, jsonBuffer, {
        upsert: true,
        contentType: 'application/json'
      });

      if (uploadError) {
        console.error('Error saving to Supabase storage:', uploadError);
        return res.status(500).json({ error: uploadError.message });
      }

      // Update metadata timestamp for real-time listener across all devices
      const timestamp = Date.now();
      const meta = { lastUpdated: timestamp, updatedKey: key };
      await supabase.storage.from('website_data').upload('metadata.json', Buffer.from(JSON.stringify(meta), 'utf-8'), {
        upsert: true,
        contentType: 'application/json'
      });

      return res.status(200).json({ success: true, key, updated_at: timestamp });
    } catch (err) {
      console.error('Unexpected error in /api/data:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
