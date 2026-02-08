import init, { get_chart_data, get_consumption_chart } from "../../chart-processor/pkg/chart_processor";
import { AllCommunityModule, ModuleRegistry } from 'ag-charts-community';
import { createBarChart, createChart } from './chart'

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
await init()

let chart: ReturnType<typeof createBarChart> | null = null;

window.addEventListener('load', async () => {
  const gasButton = document.getElementById('gas');
  const electricityButton = document.getElementById('electricity');

  gasButton?.addEventListener('click', async () => {
    const parsed = await get_consumption_chart(consumptions, 'gas');
    const currentOptions = chart?.getOptions();

    await chart?.update({ ...currentOptions, data: parsed })
  });

  electricityButton?.addEventListener('click', async () => {
    const parsed = await get_consumption_chart(consumptions, 'electricity');
    const currentOptions = chart?.getOptions();

    await chart?.update({ ...currentOptions, data: parsed })
  });

  // const data = await get_chart_data(['BMW', 'Hyundai', 'Kia', 'Mercedes-Benz', 'Volkswagen', 'Volvo', 'Honda', 'Toyota', 'Ford', 'Chevrolet']);
  // createChart(data.title, data.data);

  console.time('consumption load');
  const consumptions = await fetch('/consumption.json').then(res => res.json());
  console.timeEnd('consumption load');

  console.time('consumption parse');

  const parsed = await get_consumption_chart(consumptions);
  console.timeEnd('consumption parse');

  chart = createBarChart('Total Consumption by Month', parsed);
});
