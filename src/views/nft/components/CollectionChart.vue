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

const getOrCreateTooltip = chart => {
  let tooltipEl = chart.canvas.parentNode.querySelector('#tooltip')

  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    tooltipEl.id = 'tooltip'

    const avatar = document.createElement('img')
    avatar.className = 'avatar'
    avatar.src = 'https://cdn.v2ex.com/avatar/ae5e/b824/5656_normal.png?m=1663294138'

    const cont = document.createElement('div')
    cont.style.flex = '1'
    const title = document.createElement('div')
    title.className = 'amount'

    title.innerText = '9.60 Space'
    const desc = document.createElement('div')
    desc.className = 'name'

    desc.innerText = '#443-MetaBot Avatar 大苏打多啊实打实的'
    const time = document.createElement('div')
    time.className = 'time'
    time.innerText = 'Jan 4 at 7:36 PM'
    cont
      .appendChild(title)
      .appendChild(desc)
      .appendChild(time)

    tooltipEl.appendChild(avatar)
    tooltipEl.appendChild(cont)
    chart.canvas.parentNode.appendChild(tooltipEl)
  }

  return tooltipEl
}

const externalTooltipHandler = (context: any) => {
  // Tooltip Element
  const { chart, tooltip } = context
  const tooltipEl = getOrCreateTooltip(chart)

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0
    return
  }

  const index = chart._active[0]._index
  // tooltipEl.querySelector('.amount').innerHTML = data.datasets[0].data[index]

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1
  tooltipEl.style.left = positionX + tooltip.caretX + 'px'
  tooltipEl.style.top = positionY + tooltip.caretY + 20 + 'px'
  tooltipEl.style.font = tooltip.options.bodyFont.string
  tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px'
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
    tooltip: {
      enabled: false,
      position: 'nearest',
      external: externalTooltipHandler,
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
    x: {
      // The axis for this scale is determined from the first letter of the id as `'x'`
      // It is recommended to specify `position` and / or `axis` explicitly.
      // type: 'time',
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
