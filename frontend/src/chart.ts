import { AgCharts, type AgChartCaptionOptions, type AgChartLegendOptions, type AgChartOptions, type AgNumberAxisOptions, type AgScatterSeriesOptions } from 'ag-charts-community';

export function createChart<T>(title: string, data: Map<string, T[]>) {
  console.log(data);

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
