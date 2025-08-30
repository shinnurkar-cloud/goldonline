import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Missing key or value' });
    }

    const { error } = await supabase
      .from('settings')
      .upsert({ key, value }, { onConflict: 'key' });

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
