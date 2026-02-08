import { AgCharts, type AgBarSeriesOptions, type AgChartCaptionOptions, type AgChartLegendOptions, type AgChartOptions, type AgNumberAxisOptions, type AgScatterSeriesOptions } from 'ag-charts-community';

export function createChart<T>(title: string, data: Map<string, T[]>) {
  const series = [...data.entries()].map(([make, data]) => ({
    type: "scatter" as const,
    xKey: "x",
    xName: 'Fuel Tank Size (liter)',
    yKey: "y",
    yName: "Range (km)",
    yKeyAxis: "range",
    legendItemName: make,
    data,
    tooltip: {
      renderer: (params) => {
        return {
          title: params.legendItemName,
          data: [
            { label: 'Fuel Tank Size', value: `${params.datum.x.toLocaleString()} l` },
            { label: 'Range', value: `${params.datum.y.toLocaleString()} km` },
          ],
        };
      },
    },
  } as AgScatterSeriesOptions));

  const options: AgChartOptions = {
    title: { text: title } as AgChartCaptionOptions,
    series,
    axes: {
      range: {
        type: "number",
        position: "right",
        label: {
          formatter: (params) => {
            return parseFloat(params.value).toLocaleString();
          },
        },
      } as AgNumberAxisOptions,
    },
    legend: {
      position: "bottom",
    } as AgChartLegendOptions,
  };

  options.container = document.getElementById("myChart");

  return AgCharts.create(options);
}

export function createBarChart(title: string, data: { month: string, total: number }[]) {
  const options: AgChartOptions = {
    title: { text: title } as AgChartCaptionOptions,
    data,
    series: [
      {
        type: "bar",
        xKey: "month",
        yKey: "total",
        yName: "Total Consumption (kWh)",
        tooltip: {
          renderer: (params) => {
            return {
              title: params.datum.month,
              data: [
                { label: 'Total Consumption', value: `${params.datum.total.toLocaleString()} kWh` },
              ],
            };
          },
        },
      } as AgBarSeriesOptions,
    ],
    axes: {
      total: {
        type: "number",
        position: "left",
        label: {
          formatter: (params) => {
            return parseFloat(params.value).toLocaleString();
          },
        },
      } as AgNumberAxisOptions,
    },
    legend: {
      position: "bottom",
    } as AgChartLegendOptions,
  };
  options.container = document.getElementById("chart-consumption");

  return AgCharts.create(options);
}
