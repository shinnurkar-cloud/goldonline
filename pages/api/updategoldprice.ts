import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { value } = req.body;

  if (!value) {
    return res.status(400).json({ error: 'Gold price is required' });
  }

  try {
    const { error } = await supabase
      .from('settings')
      .upsert(
        { key: 'goldPrice', value: value },
        { onConflict: 'key' }
      );

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
