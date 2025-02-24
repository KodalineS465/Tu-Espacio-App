import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Obtener las variables de entorno desde expo-constants
const SUPABASE_URL = Constants.expoConfig?.extra?.SUPABASE_URL;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY;

console.log("SUPABASE_URL: ", SUPABASE_URL);
console.log("SUPABASE_ANON_KEY: ", SUPABASE_ANON_KEY ? "OK" : "NO DEFINIDO");

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Las variables de entorno de Supabase no están definidas correctamente.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
