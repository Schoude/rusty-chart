import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { AllCommunityModule, ModuleRegistry } from 'ag-charts-community';
import { AllCommunityModule as AllCommunityModuleGrid, ModuleRegistry as ModuleRegistryGrid } from 'ag-grid-community';

// Register all Community features
import init from '../../chart-processor/pkg/chart_processor';
import App from './App.vue';

// Enable all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
ModuleRegistryGrid.registerModules([AllCommunityModuleGrid]);
await init();

const app = createApp(App);

app.use(createPinia());

app.mount('#app');
