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
import ChartZoom from 'chartjs-plugin-zoom';
import {computed, reactive, ref} from 'vue'
export function useEchart(chartData:{
  labelNum:number,growth:number
}) {

  const label=[]
  const values=[]
  for(let i=0;i<chartData.labelNum;i++){
    label.push(i) 
  }
  for(let i=0;i<chartData.labelNum;i++){
    values.push(i * chartData.growth) 
  }

 



  const data = ref({
    labels:label,
    datasets: [
      {
        label: 'Market Price',
        backgroundColor: '#EB4C93',
        data: values,
        borderColor: '#EB4C93',
        borderWidth: 6,
        //pointBackgroundColor:'#EB4C93',
         pointBackgroundColor:'#FFA2CC',
        pointRadius:1,
        pointBorderWidth:0,
    
      
      },
    ],
 
  })

  const options =ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
          labels: {
              color: '#fff' // 图例文字颜色
          }
      },
      tooltip: {
          bodyColor: '#fff',  // Tooltip 字体颜色
          titleColor: '#fff'  // Tooltip 标题颜色
      }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Index', // X 轴标题
        color: '#fff'
    },
    
      grid: {
        color: 'rgba(255,255,255,0.1)', // 设置 X 轴网格颜色
        borderDash: [1, 1]
    },

        ticks: {
            color: '#fff' // X 轴标签颜色
        },
        
        
        
    },
    y: {
      title: {
        display: true,
        text: 'Unit (BTC)', // Y 轴标题和单位
        color: '#fff'
    },
      grid: {
        color: 'rgba(255,255,255,0.1)', // 设置 X 轴网格颜色
        borderDash: [1, 1]
    },
        ticks: {
        
        
            color: '#fff' // Y 轴标签颜色
        },
        
       
    }
},
 // 添加缩放配置
 interaction: {
  mode: 'index',
  intersect: false
},
zoom: {
  pan: {
      enabled: true, // 启用平移
      mode: 'xy' // 可以在 X 和 Y 轴上平移
  },
  zoom: {
      enabled: true, // 启用缩放
      mode: 'xy', // 可以在 X 和 Y 轴上缩放
      speed: 0.1, // 缩放速度
      threshold: 2 // 缩放阈值
  }
}

    
   
  })
  function setVals(){
      for(let i=1;i <= labelNum;i++){
    label.push(i)
  }
  for(let i=1;i <= labelNum;i++){
    values.push(i * growth)
  }

  data.value.labels=label
  data.value.datasets[0].data= values

  }

  ChartJS.register(CategoryScale,ChartZoom, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

  return {
    data,
    options,
    setVals
  }
}
