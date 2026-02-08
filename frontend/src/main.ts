import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { AllCommunityModule, ModuleRegistry } from 'ag-charts-community';
import init from '../../chart-processor/pkg/chart_processor';
import App from './App.vue';

// Enable all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
await init();

const app = createApp(App);

app.use(createPinia());

app.mount('#app');
