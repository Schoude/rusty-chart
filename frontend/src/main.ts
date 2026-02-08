import init, { get_chart_data } from "../../chart-processor/pkg/chart_processor";
import { AllCommunityModule, ModuleRegistry } from 'ag-charts-community';
import { createChart } from './chart'

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
await init()

window.addEventListener('load', async () => {
  console.time('chart');
  const data = await get_chart_data(['BMW', 'Hyundai', 'Kia', 'Mercedes-Benz', 'Volkswagen', 'Volvo', 'Honda', 'Toyota', 'Ford', 'Chevrolet']);
  createChart(data.title, data.data);
  console.timeEnd('chart');
});
