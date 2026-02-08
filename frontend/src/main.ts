import init, { get_chart_data, get_consumption_chart } from "../../chart-processor/pkg/chart_processor";
import { AllCommunityModule, ModuleRegistry } from 'ag-charts-community';
import { createBarChart, createChart } from './chart'

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
await init()

window.addEventListener('load', async () => {
  const data = await get_chart_data(['BMW', 'Hyundai', 'Kia', 'Mercedes-Benz', 'Volkswagen', 'Volvo', 'Honda', 'Toyota', 'Ford', 'Chevrolet']);
  createChart(data.title, data.data);

  console.time('consumption load');
  const consumptions = (await import('../public/consumption.json')).default;
  console.timeEnd('consumption load');

  console.time('consumption parse');

  const parsed = await get_consumption_chart(consumptions);
  console.timeEnd('consumption parse');

  createBarChart('Total Consumption by Month', parsed);
});
