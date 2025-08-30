import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'goldPrice')
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ goldPrice: data?.value || null });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
