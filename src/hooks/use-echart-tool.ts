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

export function useEchart() {
  const data = {
    labels: ['1', '2', '3', '4', '5', '6', '7'],
    datasets: [
      {
        label: 'Market Price',
        backgroundColor: '#EB4C93',
        data: [],
        borderColor: '#EB4C93',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  }

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

  return {
    data,
    options,
  }
}
