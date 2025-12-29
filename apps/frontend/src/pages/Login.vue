<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="title u-headline">Sign In</h1>
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="field">
          <label for="email" class="label u-body">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="input"
            placeholder="you@example.com"
            required
          />
        </div>
        <div class="field">
          <label for="password" class="label u-body">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="input"
            placeholder="Your password"
            required
          />
        </div>
        <p v-if="error" class="error u-body">{{ error }}</p>
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
      <p class="switch-link u-body">
        Don't have an account?
        <router-link to="/signup">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function handleSubmit() {
  error.value = '';
  loading.value = true;

  try {
    await auth.login(email.value, password.value);
    router.push('/budget');
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auth-card {
  background: var(--color-card);
  border-radius: 1.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.title {
  color: var(--color-text);
  font-size: 1.5rem;
  margin: 0 0 1.5rem;
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.input {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  color: var(--color-text);
  transition: border-color 0.15s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.input::placeholder {
  color: var(--color-text-muted);
}

.error {
  color: #f87171;
  font-size: 0.875rem;
  margin: 0;
}

.submit-btn {
  background: var(--color-accent);
  color: var(--color-background);
  border: none;
  border-radius: 0.75rem;
  padding: 0.875rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch-link {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.switch-link a {
  color: var(--color-accent);
  text-decoration: none;
}
</style>
