<template>
  <article class="expense-card">
    <div class="icon-wrap" :style="iconStyles">
      <i :class="icon" />
    </div>
    <div class="content">
      <span class="label u-body">{{ label }}</span>
      <span class="amount u-amount">${{ formattedAmount }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  amount: number;
  icon: string;
  iconColor: string;
  iconBg: string;
}>();

const formattedAmount = computed(() => {
  return props.amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
});

const iconStyles = computed(() => ({
  backgroundColor: props.iconBg,
  color: props.iconColor
}));
</script>

<style scoped>
.expense-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  background: var(--color-card);
  border-radius: 1rem;
  padding: 1rem;
}

.icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  font-size: 1.25rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.label {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

.amount {
  color: var(--color-text);
  font-size: 1.375rem;
  font-weight: 600;
}
</style>
