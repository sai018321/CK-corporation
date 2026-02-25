import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Only initialize if keys are present
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL') 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const databaseService = {
  async getSiteData() {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('site_configs')
      .select('content')
      .eq('id', 'main_config')
      .single();
      
    if (error) {
      console.error('Error fetching from Supabase:', error);
      return null;
    }
    return data.content;
  },

  async saveSiteData(content: any) {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.');
    }
    
    const { error } = await supabase
      .from('site_configs')
      .upsert({ id: 'main_config', content, updated_at: new Date().toISOString() });
      
    if (error) {
      throw error;
    }
    return true;
  }
};
