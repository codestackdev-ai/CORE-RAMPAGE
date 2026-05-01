import { supabase } from '../lib/supabase'

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) return res.status(500).json({ error })
  return res.status(200).json(data)
}
