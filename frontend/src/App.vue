<script setup lang="ts">
import { computed, onBeforeMount, ref, watchEffect } from 'vue';
import { get_consumption_chart } from '../../chart-processor/pkg/chart_processor';
import type { AgBarSeriesOptions, AgChartOptions, AgLineSeriesOptions } from 'ag-charts-community';
import { AgCharts } from 'ag-charts-vue3';

const data = ref<[]>();
const productFilter = ref<string>();
const chart = ref<{ month: string; total: number }[]>();

onBeforeMount(async () => {
  data.value = await fetch('consumption.json').then((res) => res.json());
  chart.value = await get_consumption_chart(data.value);
});

watchEffect(async () => {
  if (!data.value) return;

  chart.value = await get_consumption_chart(data.value, productFilter.value);
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

async function filterByMeterProduct(product?: string) {
  productFilter.value = product;
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
    <AgCharts :options="options" />
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
  max-inline-size: 75%;
  margin: auto;
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
