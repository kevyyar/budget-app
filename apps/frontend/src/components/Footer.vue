<template>
    <div class="card u-container">
        <Tabs :value="currentRoute">
            <TabList>
                <Tab v-for="tab in items" :value="tab.route" :key="tab.label">
                    <router-link v-if="tab.route" :to="tab.route" class="tab-item">
                        <i :class="[tab.icon, tab.class]" />
                        <span class="u-label">{{ tab.label }}</span>
                    </router-link>
                    <button v-else class="tab-item add-btn" @click="showModal = true">
                        <i :class="[tab.icon, tab.class]" />
                        <span class="u-label">{{ tab.label }}</span>
                    </button>
                </Tab>
            </TabList>
        </Tabs>
    </div>
    <AddExpenseModal :visible="showModal" @close="showModal = false" />
</template>

<style scoped>
.card {
    display: flex;
    justify-content: center;
    align-items: center;
}

.card a {
    text-decoration: none;
}

.tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    text-decoration: none;
    color: var(--color-accent);
}

.tab-item i {
    font-size: 1rem;
}

.tab-item i.add {
    font-size: 2rem;
    background-color: var(--color-accent);
    border-radius: 50%;
    padding: 0.5rem;
    color: var(--color-background);
}

.add-btn {
    background: none;
    border: none;
    cursor: pointer;
}
</style>

<script setup lang="ts">
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import Tabs from 'primevue/tabs';
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import AddExpenseModal from './AddExpenseModal.vue';

const route = useRoute();
const currentRoute = computed(() => route.path);
const showModal = ref(false);

const items = ref([
    { route: '/budget', label: 'Budget', icon: 'pi pi-wallet', class: '' },
    { route: '/analytics', label: 'Analytics', icon: 'pi pi-chart-line', class: '' },
    { route: '', label: 'Add', icon: 'pi pi-plus', class: 'add' },
    { route: '/expenses', label: 'Expenses', icon: 'pi pi-inbox', class: '' },
    { route: '/settings', label: 'Settings', icon: 'pi pi-cog', class: '' },
]);
</script>
