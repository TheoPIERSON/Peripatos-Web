export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const signUp = async (email: string, password: string, username?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split("@")[0],
        },
      },
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  // Fonction pour récupérer le profil de l'utilisateur
  const getProfile = async (userId: string) => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    return { data, error };
  };

  // Fonction pour mettre à jour le profil
  const updateProfile = async (
    userId: string,
    updates: Partial<{
      username: string;
      is_premium: boolean;
    }>
  ) => {
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single();
    return { data, error };
  };

  return {
    user,
    signUp,
    signIn,
    signOut,
    getProfile,
    updateProfile,
  };
};
