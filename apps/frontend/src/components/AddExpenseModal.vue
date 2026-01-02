<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-container">
          <header class="modal-header">
            <h2 class="modal-title">Agregar Gasto</h2>
            <button class="close-btn" @click="$emit('close')">
              <i class="pi pi-times" />
            </button>
          </header>

          <div class="modal-body">
            <!-- Amount Input -->
            <div class="field">
              <label class="field-label">MONTO</label>
              <div class="amount-input-wrapper">
                <span class="currency-symbol">$</span>
                <input
                  v-model="amount"
                  type="text"
                  class="amount-input"
                  placeholder="0.00"
                  inputmode="decimal"
                />
                <div class="amount-controls">
                  <button class="amount-btn" type="button">
                    <i class="pi pi-chevron-up" />
                  </button>
                  <button class="amount-btn" type="button">
                    <i class="pi pi-chevron-down" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Description Input -->
            <div class="field">
              <label class="field-label">DESCRIPCIÓN</label>
              <input
                v-model="description"
                type="text"
                class="description-input"
                placeholder="¿En qué gastaste?"
              />
            </div>

            <!-- Category Selection -->
            <div class="field">
              <label class="field-label">CATEGORÍA</label>
              <div class="category-grid">
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  :class="['category-btn', { selected: selectedCategory === cat.id }]"
                  :style="{ '--cat-color': cat.color, '--cat-bg': cat.bg }"
                  @click="selectedCategory = cat.id"
                >
                  <span class="category-icon">
                    <i :class="cat.icon" />
                  </span>
                  <span class="category-label">{{ cat.label }}</span>
                </button>
              </div>
            </div>

            <!-- Fixed Expense Toggle -->
            <div class="fixed-expense-row">
              <div class="fixed-expense-info">
                <span class="fixed-expense-title">Gasto Fijo</span>
                <span class="fixed-expense-desc">Gastos recurrentes como renta, suscripciones</span>
              </div>
              <button
                :class="['toggle-btn', { active: isFixedExpense }]"
                @click="isFixedExpense = !isFixedExpense"
              >
                <span class="toggle-knob" />
              </button>
            </div>
          </div>

          <footer class="modal-footer">
            <p v-if="error" class="error-msg">{{ error }}</p>
            <button class="submit-btn" :disabled="submitting" @click="handleSubmit">
              {{ submitting ? 'Agregando...' : 'Agregar Gasto' }}
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useBudgetStore } from '@/stores/budget';
import { useCategoriesStore } from '@/stores/categories';
import { useExpensesStore } from '@/stores/expenses';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  close: [];
  added: [];
}>();

const categoriesStore = useCategoriesStore();
const expensesStore = useExpensesStore();
const budgetStore = useBudgetStore();

const amount = ref('');
const description = ref('');
const selectedCategory = ref('');
const isFixedExpense = ref(false);
const submitting = ref(false);
const error = ref('');

const categories = computed(() =>
  categoriesStore.items.map((cat) => {
    const hex = cat.color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return {
      id: cat.id,
      label: cat.name,
      icon: cat.icon,
      color: cat.color,
      bg: `rgba(${r}, ${g}, ${b}, 0.15)`,
    };
  })
);

watch(() => props.visible, async (isVisible) => {
  if (!isVisible) {
    return;
  }

  if (categoriesStore.items.length === 0) {
    categoriesStore.fetch();
  }

  if (!budgetStore.summary?.budget?.id) {
    await budgetStore.fetchSummary();
  }
});

function resetForm() {
  amount.value = '';
  description.value = '';
  selectedCategory.value = '';
  isFixedExpense.value = false;
  error.value = '';
}

async function handleSubmit() {
  error.value = '';

  if (!budgetStore.summary?.budget?.id) {
    await budgetStore.fetchSummary();
  }

  const amountNum = parseFloat(amount.value);
  if (isNaN(amountNum) || amountNum <= 0) {
    error.value = 'Ingresa un monto válido';
    return;
  }

  if (!selectedCategory.value) {
    error.value = 'Selecciona una categoría';
    return;
  }

  if (!description.value.trim()) {
    error.value = 'Ingresa una descripción';
    return;
  }

  if (!budgetStore.summary?.budget.id) {
    error.value = 'Sin presupuesto activo';
    return;
  }

  submitting.value = true;

  try {
    await expensesStore.create({
      budget_id: budgetStore.summary.budget.id,
      category_id: selectedCategory.value,
      amount: amountNum,
      description: description.value,
      is_fixed: isFixedExpense.value,
    });

    await budgetStore.fetchSummary();
    resetForm();
    emit('added');
    emit('close');
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: linear-gradient(180deg, #1e2235 0%, #151822 100%);
  border-radius: 1.5rem 1.5rem 0 0;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
}

.modal-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.02em;
}

.close-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #2a2f42;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #3a3f52;
  color: #fff;
}

.modal-body {
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.amount-input-wrapper {
  display: flex;
  align-items: center;
  background: #0d1017;
  border: 2px solid #4ade80;
  border-radius: 0.75rem;
  padding: 0 1rem;
  height: 3.5rem;
  gap: 0.5rem;
}

.currency-symbol {
  font-size: 1.5rem;
  font-weight: 600;
  color: #4ade80;
}

.amount-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1.5rem;
  font-weight: 500;
  color: #fff;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  letter-spacing: 0.05em;
}

.amount-input::placeholder {
  color: #4b5563;
}

.amount-controls {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.amount-btn {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  font-size: 0.75rem;
  line-height: 1;
  transition: color 0.15s ease;
}

.amount-btn:hover {
  color: #4ade80;
}

.description-input {
  background: #1a1f2e;
  border: none;
  border-radius: 0.75rem;
  padding: 1rem;
  font-size: 1rem;
  color: #fff;
  outline: none;
  transition: box-shadow 0.2s ease;
}

.description-input::placeholder {
  color: #6b7280;
}

.description-input:focus {
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.3);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.category-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  background: var(--cat-bg);
  border: 2px solid transparent;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.category-btn.selected {
  border-color: var(--cat-color);
  background: var(--cat-bg);
}

.category-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--cat-color);
}

.category-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: #9ca3af;
  text-align: center;
}

.category-btn.selected .category-label {
  color: #fff;
}

.fixed-expense-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1a1f2e;
  border-radius: 0.75rem;
  padding: 1rem;
}

.fixed-expense-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.fixed-expense-title {
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
}

.fixed-expense-desc {
  font-size: 0.8rem;
  color: #6b7280;
}

.toggle-btn {
  width: 3.5rem;
  height: 2rem;
  border-radius: 1rem;
  background: #374151;
  border: none;
  cursor: pointer;
  position: relative;
  transition: background 0.3s ease;
}

.toggle-btn.active {
  background: #4ade80;
}

.toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-btn.active .toggle-knob {
  transform: translateX(1.5rem);
}

.modal-footer {
  padding: 1.5rem;
}

.error-msg {
  color: #f87171;
  font-size: 0.875rem;
  margin: 0 0 0.75rem;
  text-align: center;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #2d4a3e 0%, #1f3d32 100%);
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: #4ade80;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #3d5a4e 0%, #2f4d42 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.2);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: translateY(100%);
}
</style>
