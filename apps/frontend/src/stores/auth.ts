import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const loading = ref(false);
  const initialized = ref(false);

  const isAuthenticated = computed(() => !!session.value);
  const accessToken = computed(() => session.value?.access_token ?? null);

  async function init() {
    if (initialized.value) return;

    loading.value = true;

    const { data } = await supabase.auth.getSession();
    session.value = data.session;
    user.value = data.session?.user ?? null;

    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession;
      user.value = newSession?.user ?? null;
    });

    loading.value = false;
    initialized.value = true;
  }

  async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    session.value = data.session;
    user.value = data.user;
  }

  async function signup(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    session.value = data.session;
    user.value = data.user;
  }

  async function logout() {
    await supabase.auth.signOut();
    session.value = null;
    user.value = null;
  }

  return {
    user,
    session,
    loading,
    initialized,
    isAuthenticated,
    accessToken,
    init,
    login,
    signup,
    logout,
  };
});
