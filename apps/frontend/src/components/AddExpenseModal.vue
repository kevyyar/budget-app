<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-container">
          <header class="modal-header">
            <h2 class="modal-title">Add Expense</h2>
            <button class="close-btn" @click="$emit('close')">
              <i class="pi pi-times" />
            </button>
          </header>

          <div class="modal-body">
            <!-- Amount Input -->
            <div class="field">
              <label class="field-label">AMOUNT</label>
              <div class="amount-input-wrapper">
                <span class="currency-symbol">$</span>
                <input
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
              <label class="field-label">DESCRIPTION</label>
              <input
                type="text"
                class="description-input"
                placeholder="What did you spend on?"
              />
            </div>

            <!-- Category Selection -->
            <div class="field">
              <label class="field-label">CATEGORY</label>
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
                <span class="fixed-expense-title">Fixed Expense</span>
                <span class="fixed-expense-desc">Recurring bills like rent, subscriptions</span>
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
            <button class="submit-btn">Add Expense</button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  visible: boolean
}>()

defineEmits<{
  close: []
}>()

const selectedCategory = ref('food')
const isFixedExpense = ref(false)

const categories = [
  { id: 'food', label: 'Food', icon: 'pi pi-shopping-bag', color: '#1a1a2e', bg: '#f87171' },
  { id: 'transport', label: 'Transport', icon: 'pi pi-car', color: '#5eead4', bg: '#1e3a3a' },
  { id: 'shopping', label: 'Shopping', icon: 'pi pi-calendar', color: '#c084fc', bg: '#2d1f3d' },
  { id: 'bills', label: 'Bills', icon: 'pi pi-bolt', color: '#fbbf24', bg: '#2d2a1f' },
  { id: 'housing', label: 'Housing', icon: 'pi pi-home', color: '#4ade80', bg: '#1f2d1f' },
  { id: 'health', label: 'Health', icon: 'pi pi-heart', color: '#f472b6', bg: '#2d1f2a' },
  { id: 'entertainment', label: 'Entertainment', icon: 'pi pi-mobile', color: '#60a5fa', bg: '#1f2a3d' },
  { id: 'coffee', label: 'Coffee', icon: 'pi pi-star', color: '#f97316', bg: '#2d241f' },
]
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
