import { createClient } from '@supabase/supabase-js'

/**
 * 初始化 - 连接supabase后端
 */
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
