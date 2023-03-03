<template>
  <div class="chart-warp">
    <div class="title">{{ $t('NFT.CollectionChart.title') }}</div>
    <Line :data="data" :options="options" :chart-options="options" class="collection-chart" />
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: '#f87979',
      data: [40, 39, 10, 40, 39, 80, 40],
      pointRadius: 10,
      pointHoverRadius: 15,
      pointBackgroundColor: '#FFE57B',
    },
  ],
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
    tooltips: {
      display: false,
    },
  },
  scales: {
    y: {
      display: true,
      title: {
        display: true,
        text: i18n.t('NFT.CollectionChart.yAxisTitle'),
      },
    },
  },
  elements: {
    line: {
      borderWidth: 0,
    },
    point: {},
  },
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
</script>

<style lang="scss" scoped src="./CollectionChart.scss"></style>
