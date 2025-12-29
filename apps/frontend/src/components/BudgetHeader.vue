<template>
  <header class="budget-header">
    <div class="header-top">
      <time class="date-display u-body">{{ formattedDate }}</time>
      <div class="payday-badge">
        <i class="pi pi-calendar" />
        <span>{{ daysToPayday }} days to payday</span>
      </div>
    </div>
    <h1 class="title u-headline">Your Budget</h1>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  payday?: number;
}>(), {
  payday: 1
});

const now = new Date();

const formattedDate = computed(() => {
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
});

const daysToPayday = computed(() => {
  const today = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let targetDate: Date;
  if (today < props.payday) {
    targetDate = new Date(currentYear, currentMonth, props.payday);
  } else {
    targetDate = new Date(currentYear, currentMonth + 1, props.payday);
  }

  const diffTime = targetDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});
</script>

<style scoped>
.budget-header {
  padding-block: 1.5rem 1rem;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.date-display {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.payday-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border: 1px solid color-mix(in srgb, var(--color-accent) 40%, transparent);
  border-radius: 999px;
  color: var(--color-accent);
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
}

.payday-badge i {
  font-size: 0.875rem;
}

.title {
  margin: 0;
  font-size: 1.75rem;
  color: var(--color-text);
  font-weight: 700;
}
</style>
