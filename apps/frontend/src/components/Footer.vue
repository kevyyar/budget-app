<template>
    <div class="card">
        <Tabs :value="currentRoute">
            <TabList>
                <Tab v-for="tab in items" :value="tab.route" :key="tab.label">
                    <router-link :to="tab.route" class="tab-item">
                        <i :class="[tab.icon, tab.class]" />
                        <span class="u-label">{{ tab.label }}</span>
                    </router-link>
                </Tab>
            </TabList>
        </Tabs>
    </div>
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
    color: #2afc98;
}

.tab-item i {
    font-size: 1rem;
}

.tab-item i.add {
    font-size: 2rem;
    background-color: #2afc98;
    border-radius: 50%;
    padding: 0.5rem;
    color: black;
}
</style>

<script setup lang="ts">
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import Tabs from 'primevue/tabs';
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const currentRoute = computed(() => route.path);

const items = ref([
    { route: '/budget', label: 'Budget', icon: 'pi pi-wallet', class: '' },
    { route: '/analytics', label: 'Analytics', icon: 'pi pi-chart-line', class: '' },
    { route: '/add', label: 'Add', icon: 'pi pi-plus', class: 'add' },
    { route: '/expenses', label: 'Expenses', icon: 'pi pi-inbox', class: '' },
    { route: '/settings', label: 'Settings', icon: 'pi pi-cog', class: '' },
]);
</script>
