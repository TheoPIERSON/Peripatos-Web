// plugins/supabase.client.ts
import { createClient } from "@supabase/supabase-js";

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();

  const supabase = createClient(config.public.SUPABASE_URL as string, config.public.SUPABASE_KEY as string, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  // Récupérer la session initiale
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Créer un état réactif pour l'utilisateur
  const user = useState("supabase.user", () => session?.user ?? null);

  // Écouter les changements d'état d'authentification
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user ?? null;
  });

  return {
    provide: {
      supabase,
      user: readonly(user),
    },
  };
});
