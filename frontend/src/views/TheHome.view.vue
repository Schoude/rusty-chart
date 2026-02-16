<script setup lang="ts">
import { computed, onBeforeMount, ref, watchEffect } from 'vue';
import { get_consumption_chart } from '../../../chart-processor/pkg/chart_processor';
import { type AgBarSeriesOptions, type AgChartOptions, type AgLineSeriesOptions } from 'ag-charts-community';
import { AgCharts } from 'ag-charts-vue3';
import { AgGridVue } from 'ag-grid-vue3';
import type { GridOptions, ColDef, FilterChangedEvent, ValueFormatterParams } from 'ag-grid-community';

interface Consumption {
  start: string;
  quantity: number;
  meterProduct: string;
  address: {
    city: string;
    street: string;
    postalCode: string;
  };
}

const data = ref<Consumption[]>();
const chartData = ref<Consumption[]>();
const productFilter = ref<string>();
const chart = ref<{ month: string; total: number }[]>();

onBeforeMount(async () => {
  data.value = await fetch('consumption.json').then((res) => res.json());
  chartData.value = data.value;
  console.time('init chart');
  chart.value = await get_consumption_chart(chartData.value);
  console.timeEnd('init chart');
});

watchEffect(async () => {
  if (!data.value) return;

  console.time('call rust');
  chart.value = await get_consumption_chart(chartData.value, productFilter.value);
  console.timeEnd('call rust');
});

const options = computed<AgChartOptions>(() => ({
  title: {
    text: 'Consumptions by month',
    fontSize: 18,
    fontFamily: 'Avenir, Helvetica, Arial, sans-serif',
  },
  data: chart.value,
  series: [
    {
      type: 'bar',
      xKey: 'month',
      yKey: 'total',
    } as AgBarSeriesOptions,
    {
      type: 'line',
      xKey: 'month',
      yKey: 'total',
      marker: {
        enabled: false,
      },
      strokeWidth: 3,
    } as AgLineSeriesOptions,
  ],
  height: 500,
}));

const gridOptions = ref<GridOptions<Consumption>>({
  pagination: true,
  paginationPageSize: 10,
  paginationPageSizeSelector: [10, 20, 50],
  autoSizeStrategy: { type: 'fitCellContents' },
});
const rowData = computed(() => {
  return data.value;
});

const columnDefs = ref<ColDef<Consumption>[]>([
  {
    field: 'quantity',
    filter: 'agNumberColumnFilter',
    valueFormatter: (params: ValueFormatterParams<Consumption, number>) =>
      `${new Intl.NumberFormat().format(params.value!)} kWh`,
    type: 'numericColumn',
  },
  { field: 'meterProduct', filter: 'agTextColumnFilter' },
  {
    field: 'start',
    filter: 'agDateColumnFilter',
    valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
  },
  { field: 'address.city', filter: 'agTextColumnFilter' },
  { field: 'address.street', filter: 'agTextColumnFilter' },
  { field: 'address.postalCode', filter: 'agTextColumnFilter' },
]);

async function filterByMeterProduct(product?: string) {
  productFilter.value = product;
}

function onFilterChanged(event: FilterChangedEvent<Consumption>) {
  const currentData: Consumption[] = [];

  event.api.forEachNodeAfterFilterAndSort((n) => {
    if (!n.data) return;

    currentData.push(n.data);
  });

  chartData.value = currentData;
}
</script>

<template>
  <div class="button-group">
    <button :disabled="productFilter == null" @click="filterByMeterProduct()">All</button>
    <button :disabled="productFilter === 'gas'" @click="filterByMeterProduct('gas')">Gas</button>
    <button :disabled="productFilter === 'electricity'" @click="filterByMeterProduct('electricity')">
      Electricity
    </button>
  </div>
  <div class="container">
    <AgCharts :options="options" style="border-radius: 10px; overflow: clip" />
    <AgGridVue style="height: 500px" :row-data :column-defs :grid-options @filter-changed="onFilterChanged" />
  </div>
</template>

<style>
html {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #e9e9e9;
}

body {
  margin: 1rem;
}

.container {
  max-inline-size: 90dvw;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1em;
  margin-bottom: 1em;
}

button {
  background-color: #e9e9e9;
  font: inherit;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 0.5em 1em;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
