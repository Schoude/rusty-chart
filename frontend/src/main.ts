import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { AllCommunityModule, ModuleRegistry } from 'ag-charts-community';
import { AllCommunityModule as AllCommunityModuleGrid, ModuleRegistry as ModuleRegistryGrid } from 'ag-grid-community';

// Register all Community features
import init from '../../chart-processor/pkg/chart_processor';
import App from './App.vue';
import router from './router';
import { DataLoaderPlugin } from 'vue-router/experimental';
import { PiniaColada, PiniaColadaQueryHooksPlugin } from '@pinia/colada';
import { PiniaColadaCachePersister } from '@pinia/colada-plugin-cache-persister';

// Enable all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
ModuleRegistryGrid.registerModules([AllCommunityModuleGrid]);
await init();

const app = createApp(App);

app.use(createPinia());

app.use(PiniaColada, {
  plugins: [
    PiniaColadaQueryHooksPlugin({
      onError(error) {
        console.log({ error });

        alert(error);
      },
      onSuccess(data, entry) {
        console.log({ data });
        console.log({ entry });
      },
    }),
    PiniaColadaCachePersister({
      // optional
      key: 'pinia-colada-cache',
      debounce: 1000,
      // storage: localStorage,
      // filter: { key: ['todos'] },
    }),
  ],
});
app.use(DataLoaderPlugin, { router });
app.use(router);

app.mount('#app');
