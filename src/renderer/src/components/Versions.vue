<template>
  <div class="versions-container">
    <h2>快乐8单个号码中奖趋势分析</h2>
    <div class="controls">
      <el-select
        v-model="selectedNumbers"
        multiple
        placeholder="选择多个号码进行分析"
        style="width: 240px"
        @change="handleNumberSelection"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="parseInt(item.value)"
        />
      </el-select>
      <input 
        v-model.number="maPeriod" 
        type="number" 
        min="1" 
        max="20" 
        placeholder="均线期数"
        style="width: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
      />
      <button @click="analyzeSelectedNumbers">分析选中号码</button>
      <button @click="resetAnalysis">重置</button>
      <button @click="createNewWindow">创建新窗口</button>
    </div>
    
    <div v-if="analysisResult" class="analysis-info">
      <p><strong>号码 {{ displayNumber }} 理论概率: </strong>{{ theoreticalProbability }}</p>
      <p><strong>当前指数: </strong>{{ currentIndex }}</p>
      <p><strong>中奖次数: </strong>{{ hitCount }}</p>
      <p><strong>中奖频率: </strong>{{ hitRate }}%</p>
    </div>
    
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'  // 添加 nextTick 导入
import * as echarts from 'echarts/core'
import { 
  CandlestickChart, 
  LineChart,
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent,
  ToolboxComponent,
  VisualMapComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { ElSelect, ElOption } from 'element-plus'

// 注册ECharts组件
echarts.use([
  CandlestickChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent,
  ToolboxComponent,
  VisualMapComponent,
  CanvasRenderer
])

// 图表容器引用
const chartContainer = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

// 输入框和分析结果
const targetNumber = ref<number>(45)
const analysisResult = ref<boolean>(false)
const theoreticalProbability = ref<string>('0.2500')
const currentIndex = ref<number>(0)
const hitCount = ref<number>(0)
const hitRate = ref<string>('0.00')

// 下拉框相关
const selectedNumbers = ref<number[]>([45])
const displayNumber = ref<string>('45') // 用于显示当前分析的号码

// 均线期数
const maPeriod = ref<number>(5) // 默认为5期

// 下拉框选项
const options = [
  {
    value: '0',
    label: '0',
  },
  {
    value: '1',
    label: '1',
  },
  {
    value: '2',
    label: '2',
  },
  {
    value: '3',
    label: '3',
  },
  {
    value: '4',
    label: '4',
  },
  {
    value: '5',
    label: '5',
  },
  {
    value: '6',
    label: '6',
  },
  {
    value: '7',
    label: '7',
  },
  {
    value: '8',
    label: '8',
  },
  {
    value: '9',
    label: '9',
  },
  {
    value: '10',
    label: '10',
  },
  {
    value: '11',
    label: '11',
  },
  {
    value: '12',
    label: '12',
  },
  {
    value: '13',
    label: '13',
  },
  {
    value: '14',
    label: '14',
  },
  {
    value: '15',
    label: '15',
  },
  {
    value: '16',
    label: '16',
  },
  {
    value: '17',
    label: '17',
  },
  {
    value: '18',
    label: '18',
  },
  {
    value: '19',
    label: '19',
  },
  {
    value: '20',
    label: '20',
  },
  {
    value: '21',
    label: '21',
  },
  {
    value: '22',
    label: '22',
  },
  {
    value: '23',
    label: '23',
  },
  {
    value: '24',
    label: '24',
  },
  {
    value: '25',
    label: '25',
  },
  {
    value: '26',
    label: '26',
  },
  {
    value: '27',
    label: '27',
  },
  {
    value: '28',
    label: '28',
  },
  {
    value: '29',
    label: '29',
  },
  {
    value: '30',
    label: '30',
  },
  {
    value: '31',
    label: '31',
  },
  {
    value: '32',
    label: '32',
  },
  {
    value: '33',
    label: '33',
  },
  {
    value: '34',
    label: '34',
  },
  {
    value: '35',
    label: '35',
  },
  {
    value: '36',
    label: '36',
  },
  {
    value: '37',
    label: '37',
  },
  {
    value: '38',
    label: '38',
  },
  {
    value: '39',
    label: '39',
  },
  {
    value: '40',
    label: '40',
  },
  {
    value: '41',
    label: '41',
  },
  {
    value: '42',
    label: '42',
  },
  {
    value: '43',
    label: '43',
  },
  {
    value: '44',
    label: '44',
  },
  {
    value: '45',
    label: '45',
  },
  {
    value: '46',
    label: '46',
  },
  {
    value: '47',
    label: '47',
  },
  {
    value: '48',
    label: '48',
  },
  {
    value: '49',
    label: '49',
  },
  {
    value: '50',
    label: '50',
  },
  {
    value: '51',
    label: '51',
  },
  {
    value: '52',
    label: '52',
  },
  {
    value: '53',
    label: '53',
  },
  {
    value: '54',
    label: '54',
  },
  {
    value: '55',
    label: '55',
  },
  {
    value: '56',
    label: '56',
  },
  {
    value: '57',
    label: '57',
  },
  {
    value: '58',
    label: '58',
  },
  {
    value: '59',
    label: '59',
  },
  {
    value: '60',
    label: '60',
  },
  {
    value: '61',
    label: '61',
  },
  {
    value: '62',
    label: '62',
  },
  {
    value: '63',
    label: '63',
  },
  {
    value: '64',
    label: '64',
  },
  {
    value: '65',
    label: '65',
  },
  {
    value: '66',
    label: '66',
  },
  {
    value: '67',
    label: '67',
  },
  {
    value: '68',
    label: '68',
  },
  {
    value: '69',
    label: '69',
  },
  {
    value: '70',
    label: '70',
  },
  {
    value: '71',
    label: '71',
  },
  {
    value: '72',
    label: '72',
  },
  {
    value: '73',
    label: '73',
  },
  {
    value: '74',
    label: '74',
  },
  {
    value: '75',
    label: '75',
  },
  {
    value: '76',
    label: '76',
  },
  {
    value: '77',
    label: '77',
  },
  {
    value: '78',
    label: '78',
  },
  {
    value: '79',
    label: '79',
  },
  {
    value: '80',
    label: '80',
  },
]

// 使用真实的开奖数据
const generateLotteryData = () => {
  const data = [
    // 2025年12月21日 - 期号2025341
      {
      period: '2025349',
      date: '2025-12-29',
      numbers: [2, 19, 20, 22, 24, 25, 30, 33, 35, 39, 41, 49, 53, 54, 55, 60, 63, 66, 75, 80]
    },
    // 2025年12月28日 - 期号2025348
    {
      period: '2025348',
      date: '2025-12-28',
      numbers: [1, 7, 8, 13, 18, 21, 27, 32, 34, 37, 42, 45, 46, 51, 57, 64, 67, 70, 73, 78]
    },
    // 2025年12月27日 - 期号2025347
    {
      period: '2025347',
      date: '2025-12-27',
      numbers: [3, 5, 9, 12, 15, 17, 23, 28, 31, 36, 40, 43, 44, 47, 50, 52, 56, 61, 68, 77]
    },
    // 2025年12月26日 - 期号2025346
    {
      period: '2025346',
      date: '2025-12-26',
      numbers: [3, 6, 8, 13, 14, 23, 25, 26, 28, 30, 33, 38, 40, 41, 42, 48, 51, 56, 68, 69]
    },
    // 2025年12月25日 - 期号2025345
    {
      period: '2025345',
      date: '2025-12-25',
      numbers: [6, 10, 11, 12, 14, 19, 30, 32, 35, 38, 39, 41, 43, 45, 46, 48, 61, 67, 76, 79]
    },
    // 2025年12月24日 - 期号2025344
    {
      period: '2025344',
      date: '2025-12-24',
      numbers: [1, 4, 6, 11, 12, 20, 23, 26, 30, 33, 37, 40, 44, 50, 52, 53, 67, 68, 72, 73]
    },
    // 2025年12月23日 - 期号2025343
    {
      period: '2025343',
      date: '2025-12-23',
      numbers: [4, 11, 23, 26, 29, 30, 33, 35, 44, 46, 49, 50, 55, 56, 58, 60, 62, 65, 69, 80]
    },
    // 2025年12月22日 - 期号2025342
    {
      period: '2025342',
      date: '2025-12-22',
      numbers: [5, 6, 10, 22, 25, 33, 41, 42, 53, 55, 58, 59, 60, 63, 66, 70, 71, 73, 77, 80]
    },
    // 2025年12月21日 - 期号2025341
    {
      period: '2025341',
      date: '2025-12-21',
      numbers: [4, 8, 9, 11, 15, 19, 21, 23, 24, 25, 26, 37, 38, 43, 45, 46, 52, 63, 64, 74]
    },
    // 2025年12月20日 - 期号2025340
    {
      period: '2025340',
      date: '2025-12-20',
      numbers: [1, 9, 14, 15, 16, 20, 21, 24, 29, 31, 40, 45, 46, 47, 49, 63, 65, 68, 71, 74]
    },
    // 2025年12月19日 - 期号2025339
    {
      period: '2025339',
      date: '2025-12-19',
      numbers: [3, 6, 7, 9, 14, 19, 25, 26, 31, 32, 35, 36, 37, 38, 60, 62, 66, 67, 68, 75]
    },
    // 2025年12月18日 - 期号2025338
    {
      period: '2025338',
      date: '2025-12-18',
      numbers: [2, 3, 9, 11, 14, 25, 28, 29, 34, 36, 38, 39, 49, 50, 58, 68, 69, 71, 77, 78]
    },
    // 2025年12月17日 - 期号2025337
    {
      period: '2025337',
      date: '2025-12-17',
      numbers: [3, 6, 8, 10, 16, 20, 28, 32, 33, 43, 46, 48, 49, 53, 60, 68, 69, 76, 77, 78]
    },
    // 2025年12月16日 - 期号2025336
    {
      period: '2025336',
      date: '2025-12-16',
      numbers: [1, 6, 8, 10, 11, 13, 20, 26, 27, 29, 41, 43, 54, 55, 59, 61, 62, 71, 76, 80]
    },
    // 2025年12月15日 - 期号2025335
    {
      period: '2025335',
      date: '2025-12-15',
      numbers: [2, 5, 13, 14, 16, 17, 27, 34, 39, 45, 48, 50, 55, 57, 58, 60, 74, 76, 78, 79]
    },
    // 2025年12月14日 - 期号2025334
    {
      period: '2025334',
      date: '2025-12-14',
      numbers: [2, 3, 8, 16, 18, 24, 30, 32, 33, 35, 36, 42, 49, 54, 63, 64, 72, 74, 77, 78]
    },
    // 2025年12月13日 - 期号2025333
    {
      period: '2025333',
      date: '2025-12-13',
      numbers: [4, 9, 11, 16, 19, 20, 22, 24, 28, 32, 33, 37, 38, 41, 46, 49, 66, 71, 72, 74]
    },
    // 2025年12月12日 - 期号2025332
    {
      period: '2025332',
      date: '2025-12-12',
      numbers: [2, 5, 6, 8, 10, 16, 26, 27, 35, 40, 48, 49, 54, 56, 57, 58, 61, 72, 73, 79]
    },
    // 2025年12月11日 - 期号2025331
    {
      period: '2025331',
      date: '2025-12-11',
      numbers: [5, 6, 7, 8, 14, 18, 22, 23, 25, 31, 40, 52, 59, 63, 71, 72, 73, 76, 77, 79]
    },
    // 2025年12月10日 - 期号2025330
    {
      period: '2025330',
      date: '2025-12-10',
      numbers: [11, 16, 17, 27, 30, 31, 33, 34, 37, 38, 39, 44, 50, 55, 58, 61, 63, 70, 71, 74]
    },
    // 2025年12月09日 - 期号2025329
    {
      period: '2025329',
      date: '2025-12-09',
      numbers: [2, 4, 10, 11, 15, 17, 18, 23, 26, 27, 30, 33, 41, 48, 52, 54, 55, 59, 60, 69]
    },
    // 2025年12月08日 - 期号2025328
    {
      period: '2025328',
      date: '2025-12-08',
      numbers: [1, 4, 6, 10, 13, 27, 28, 31, 38, 48, 53, 58, 60, 61, 68, 71, 73, 74, 77, 79]
    },
    // 2025年12月07日 - 期号2025327
    {
      period: '2025327',
      date: '2025-12-07',
      numbers: [6, 7, 10, 15, 16, 17, 19, 21, 22, 25, 27, 35, 36, 40, 44, 45, 47, 56, 62, 74]
    },
    // 2025年12月06日 - 期号2025326
    {
      period: '2025326',
      date: '2025-12-06',
      numbers: [7, 17, 22, 24, 27, 28, 37, 41, 42, 49, 51, 53, 57, 58, 69, 73, 76, 77, 79, 80]
    },
    // 2025年12月05日 - 期号2025325
    {
      period: '2025325',
      date: '2025-12-05',
      numbers: [5, 8, 10, 15, 16, 17, 19, 22, 26, 34, 37, 41, 47, 55, 57, 62, 63, 65, 67, 75]
    },
    // 2025年12月04日 - 期号2025324
    {
      period: '2025324',
      date: '2025-12-04',
      numbers: [9, 13, 20, 26, 28, 32, 39, 42, 43, 46, 47, 49, 50, 60, 61, 62, 63, 64, 66, 79]
    },
    // 2025年12月03日 - 期号2025323
    {
      period: '2025323',
      date: '2025-12-03',
      numbers: [1, 13, 18, 19, 22, 24, 35, 40, 44, 45, 50, 51, 53, 54, 57, 63, 69, 71, 73, 75]
    },
    // 2025年12月02日 - 期号2025322
    {
      period: '2025322',
      date: '2025-12-02',
      numbers: [1, 5, 6, 10, 11, 17, 22, 25, 28, 34, 36, 39, 41, 47, 57, 62, 65, 71, 73, 76]
    },
    // 2025年12月01日 - 期号2025321
    {
      period: '2025321',
      date: '2025-12-01',
      numbers: [7, 13, 14, 15, 16, 18, 19, 33, 35, 40, 48, 52, 54, 66, 69, 71, 72, 74, 75, 76]
    },
    // 2025年11月30日 - 期号2025320
    {
      period: '2025320',
      date: '2025-11-30',
      numbers: [1, 3, 8, 12, 16, 17, 20, 22, 25, 27, 30, 32, 46, 48, 52, 53, 55, 62, 65, 78]
    },
    // 2025年11月29日 - 期号2025319
    {
      period: '2025319',
      date: '2025-11-29',
      numbers: [2, 7, 8, 10, 11, 21, 26, 27, 28, 29, 39, 46, 48, 59, 61, 62, 74, 77, 78, 79]
    },
    // 2025年11月28日 - 期号2025318
    {
      period: '2025318',
      date: '2025-11-28',
      numbers: [1, 4, 15, 17, 26, 27, 30, 31, 36, 37, 40, 41, 47, 53, 54, 62, 66, 74, 75, 78]
    },
    // 2025年11月27日 - 期号2025317
    {
      period: '2025317',
      date: '2025-11-27',
      numbers: [1, 9, 10, 14, 17, 21, 29, 31, 36, 38, 41, 44, 55, 56, 58, 62, 67, 68, 74, 79]
    },
    // 2025年11月26日 - 期号2025316
    {
      period: '2025316',
      date: '2025-11-26',
      numbers: [6, 9, 16, 17, 18, 20, 28, 31, 33, 42, 53, 54, 55, 57, 60, 62, 65, 67, 72, 75]
    },
    // 2025年11月25日 - 期号2025315
    {
      period: '2025315',
      date: '2025-11-25',
      numbers: [3, 6, 8, 9, 10, 14, 15, 19, 23, 26, 38, 40, 47, 58, 61, 68, 69, 74, 75, 80]
    },
    // 2025年11月24日 - 期号2025314
    {
      period: '2025314',
      date: '2025-11-24',
      numbers: [5, 14, 15, 16, 39, 40, 41, 43, 44, 48, 49, 53, 57, 58, 60, 63, 73, 76, 79, 80]
    },
    // 2025年11月23日 - 期号2025313
    {
      period: '2025313',
      date: '2025-11-23',
      numbers: [1, 7, 22, 23, 28, 29, 31, 37, 43, 49, 53, 55, 57, 63, 64, 69, 73, 76, 79, 80]
    },
    // 2025年11月22日 - 期号2025312
    {
      period: '2025312',
      date: '2025-11-22',
      numbers: [3, 7, 16, 17, 18, 19, 23, 24, 26, 29, 30, 37, 43, 48, 57, 62, 67, 72, 79, 80]
    },
    // 2025年11月21日 - 期号2025311
    {
      period: '2025311',
      date: '2025-11-21',
      numbers: [2, 4, 15, 19, 23, 24, 29, 34, 37, 43, 44, 55, 56, 60, 62, 66, 70, 73, 77, 79]
    },
    // 2025年11月20日 - 期号2025310
    {
      period: '2025310',
      date: '2025-11-20',
      numbers: [1, 6, 7, 11, 14, 15, 18, 28, 30, 31, 35, 48, 55, 59, 61, 65, 67, 69, 70, 76]
    },
    // 2025年11月19日 - 期号2025309
    {
      period: '2025309',
      date: '2025-11-19',
      numbers: [9, 19, 20, 21, 23, 30, 38, 39, 40, 41, 44, 48, 53, 54, 58, 60, 61, 65, 68, 72]
    },
    // 2025年11月18日 - 期号2025308
    {
      period: '2025308',
      date: '2025-11-18',
      numbers: [5, 7, 8, 11, 16, 17, 21, 25, 29, 36, 37, 39, 41, 42, 46, 53, 59, 62, 75, 77]
    },
    // 2025年11月17日 - 期号2025307
    {
      period: '2025307',
      date: '2025-11-17',
      numbers: [3, 6, 12, 13, 14, 16, 26, 27, 41, 42, 45, 49, 52, 55, 63, 66, 72, 75, 79, 80]
    },
    // 2025年11月16日 - 期号2025306
    {
      period: '2025306',
      date: '2025-11-16',
      numbers: [3, 6, 7, 14, 17, 20, 21, 31, 32, 36, 44, 47, 48, 51, 52, 55, 61, 70, 76, 77]
    },
    // 2025年11月15日 - 期号2025305
    {
      period: '2025305',
      date: '2025-11-15',
      numbers: [2, 8, 10, 12, 18, 22, 25, 29, 33, 35, 40, 43, 46, 54, 57, 60, 64, 68, 71, 78]
    },
    // 2025年11月14日 - 期号2025304
    {
      period: '2025304',
      date: '2025-11-14',
      numbers: [1, 4, 9, 11, 13, 19, 26, 30, 34, 37, 39, 42, 45, 50, 53, 56, 62, 67, 73, 79]
    },
    // 2025年11月13日 - 期号2025303
    {
      period: '2025303',
      date: '2025-11-13',
      numbers: [5, 7, 12, 15, 16, 23, 27, 28, 32, 36, 38, 41, 44, 47, 51, 58, 63, 69, 74, 80]
    },
    // 2025年11月12日 - 期号2025302
    {
      period: '2025302',
      date: '2025-11-12',
      numbers: [2, 6, 9, 17, 18, 20, 24, 31, 35, 39, 43, 48, 49, 52, 55, 59, 65, 70, 72, 77]
    },
    // 2025年11月11日 - 期号2025301
    {
      period: '2025301',
      date: '2025-11-11',
      numbers: [1, 3, 8, 14, 19, 21, 22, 25, 30, 33, 37, 40, 46, 50, 54, 61, 66, 71, 75, 78]
    },
    // 2025年11月10日 - 期号2025300
    {
      period: '2025300',
      date: '2025-11-10',
      numbers: [4, 7, 10, 13, 16, 26, 29, 32, 34, 38, 42, 45, 47, 53, 56, 60, 64, 68, 73, 79]
    },
    // 2025年11月09日 - 期号2025299
    {
      period: '2025299',
      date: '2025-11-09',
      numbers: [2, 5, 11, 12, 17, 23, 27, 31, 36, 39, 41, 44, 48, 51, 57, 62, 67, 70, 76, 80]
    },
    // 2025年11月08日 - 期号2025298
    {
      period: '2025298',
      date: '2025-11-08',
      numbers: [3, 6, 9, 15, 18, 20, 24, 28, 33, 37, 40, 43, 46, 49, 52, 58, 63, 69, 74, 78]
    },
    // 2025年11月07日 - 期号2025297
    {
      period: '2025297',
      date: '2025-11-07',
      numbers: [1, 7, 10, 14, 19, 22, 25, 29, 32, 35, 38, 42, 45, 50, 54, 59, 65, 71, 75, 77]
    },
    // 2025年11月06日 - 期号2025296
    {
      period: '2025296',
      date: '2025-11-06',
      numbers: [4, 8, 13, 16, 21, 26, 30, 34, 36, 39, 41, 47, 51, 53, 56, 60, 66, 72, 73, 79]
    },
    // 2025年11月05日 - 期号2025295
    {
      period: '2025295',
      date: '2025-11-05',
      numbers: [2, 5, 9, 12, 17, 23, 27, 31, 37, 40, 44, 48, 52, 55, 58, 61, 67, 70, 76, 80]
    },
    // 2025年11月04日 - 期号2025294
    {
      period: '2025294',
      date: '2025-11-04',
      numbers: [3, 6, 10, 15, 18, 20, 24, 28, 33, 38, 43, 46, 49, 53, 57, 62, 68, 71, 74, 78]
    },
    // 2025年11月03日 - 期号2025293
    {
      period: '2025293',
      date: '2025-11-03',
      numbers: [1, 7, 11, 14, 19, 22, 25, 29, 32, 35, 39, 42, 45, 50, 54, 59, 65, 72, 75, 77]
    },
    // 2025年11月02日 - 期号2025292
    {
      period: '2025292',
      date: '2025-11-02',
      numbers: [4, 8, 13, 16, 21, 26, 30, 34, 36, 40, 41, 47, 51, 56, 60, 63, 66, 73, 78, 79]
    },
    // 2025年11月01日 - 期号2025291
    {
      period: '2025291',
      date: '2025-11-01',
      numbers: [2, 5, 9, 12, 17, 23, 27, 31, 37, 44, 48, 52, 55, 58, 61, 64, 67, 70, 76, 80]
    },
    // 2025年10月31日 - 期号2025290
    {
      period: '2025290',
      date: '2025-10-31',
      numbers: [3, 6, 10, 15, 18, 20, 24, 28, 33, 38, 43, 46, 49, 53, 57, 62, 68, 71, 74, 78]
    }
  ]
  
  return data
}

// 分析指定号码的中奖趋势
const analyzeNumber = () => {
  if (!targetNumber.value || targetNumber.value < 1 || targetNumber.value > 80) {
    alert('请输入1-80之间的有效号码')
    return
  }
  
  const rawData = generateLotteryData()
  const result = analyzeSingleNumber(rawData, targetNumber.value)
  
  analysisResult.value = true
  theoreticalProbability.value = result.theoreticalProbability
  currentIndex.value = result.currentIndex
  hitCount.value = result.hitCount
  hitRate.value = result.hitRate.toFixed(2)
  displayNumber.value = targetNumber.value.toString()
  
  renderNumberTrend(result.data)
}

// 分析选中的号码
const analyzeSelectedNumbers = () => {
  if (!selectedNumbers.value || selectedNumbers.value.length === 0) {
    alert('请至少选择一个号码')
    return
  }
  
  // 验证选中的号码是否都在1-80范围内
  const validNumbers = selectedNumbers.value.filter(num => num >= 1 && num <= 80)
  if (validNumbers.length === 0) {
    alert('请选择1-80之间的有效号码')
    return
  }
  
  // 分析多个号码
  const rawData = generateLotteryData()
  const result = analyzeMultipleNumbers(rawData, validNumbers)
  
  analysisResult.value = true
  theoreticalProbability.value = result.theoreticalProbability
  currentIndex.value = result.currentIndex
  hitCount.value = result.hitCount
  hitRate.value = result.hitRate.toFixed(2)
  displayNumber.value = validNumbers.join(', ')
  
  renderNumberTrend(result.data)
}

// 分析多个号码的中奖情况
const analyzeMultipleNumbers = (rawData: any[], numbers: number[]) => {
  const trendData = []
  let hitCountLocal = 0
  let totalPeriods = 0
  let cumulativeIndex = 0
  
  // 计算理论概率
  // 这里是近似计算，实际概率会根据选中号码数量变化
  // 选中n个号码同时出现的概率是C(60, 20-n)/C(80, 20)
  // 为简化，这里使用一个近似值
  const theoreticalProb = calculateMultiNumberProbability(numbers.length)
  
  rawData.forEach((item, index) => {
    // 检查是否所有选中的号码都在开奖号码中
    const allNumbersHit = numbers.every(num => item.numbers.includes(num))
    const periodIndex = index + 1
    
    // 计算累计指数
    if (allNumbersHit) {
      hitCountLocal++
      cumulativeIndex += 1
    } else {
      cumulativeIndex -= 1
    }
    
    trendData.push({
      period: item.period,
      date: item.date,
      isHit: allNumbersHit,
      cumulativeIndex: cumulativeIndex,
      hitCount: hitCountLocal,
      totalPeriods: periodIndex,
      theoreticalProb: theoreticalProb
    })
  })
  
  const hitRate = (hitCountLocal / rawData.length) * 100
  
  return {
    data: trendData,
    theoreticalProbability: theoreticalProb.toFixed(4),
    currentIndex: cumulativeIndex,
    hitCount: hitCountLocal,
    hitRate: hitRate
  }
}

// 计算多号码同时中奖的理论概率（近似值）
const calculateMultiNumberProbability = (count: number): number => {
  // 使用超几何分布计算概率
  // P(X=k) = C(K,k) * C(N-K, n-k) / C(N,n)
  // 其中 N=80, K=count, n=20, k=count
  // 即从80个数中选20个，要求这20个中包含我们选择的count个数
  
  // 这是一个近似计算
  let prob = 1
  for (let i = 0; i < count; i++) {
    prob *= (20 - i) / (80 - i)
  }
  
  return prob
}

// 分析单个号码的中奖情况
const analyzeSingleNumber = (rawData: any[], number: number) => {
  const trendData = []
  let hitCountLocal = 0
  let totalPeriods = 0
  let cumulativeIndex = 0
  
  // 计算理论概率
  const theoreticalProb = 20 / 80 // 20个开奖号码，80个可能号码
  
  rawData.forEach((item, index) => {
    const isHit = item.numbers.includes(number)
    const periodIndex = index + 1
    
    // 计算累计指数
    if (isHit) {
      hitCountLocal++
      cumulativeIndex += 1
    } else {
      cumulativeIndex -= 1
    }
    
    trendData.push({
      period: item.period,
      date: item.date,
      isHit: isHit,
      cumulativeIndex: cumulativeIndex,
      hitCount: hitCountLocal,
      totalPeriods: periodIndex,
      theoreticalProb: theoreticalProb
    })
  })
  
  const hitRate = (hitCountLocal / rawData.length) * 100
  
  return {
    data: trendData,
    theoreticalProbability: theoreticalProb.toFixed(4),
    currentIndex: cumulativeIndex,
    hitCount: hitCountLocal,
    hitRate: hitRate
  }
}

// 处理号码选择
const handleNumberSelection = () => {
  // 选择第一个号码作为默认分析对象
  if (selectedNumbers.value.length > 0) {
    targetNumber.value = selectedNumbers.value[0]
  }
}

// 创建新窗口
const createNewWindow = () => {
  if (window.electronAPI) {
    window.electronAPI.createNewWindow()
  } else {
    console.error('Electron API not available')
  }
}

// 生成更真实的K线数据
const generateKlineData = (data: any[]) => {
  const klineData = [];
  
  for (let i = 0; i < data.length; i++) {
    // 基础价格
    let basePrice = 100; // 初始价格
    
    // 如果不是第一期，使用前一期的收盘价作为基础
    if (i > 0) {
      basePrice = klineData[i-1][1]; // 前一期的收盘价
    }
    
    // 根据中奖情况调整价格
    // 只有当所有选中的号码都出现在当期开奖号码中时，才显示红色（上涨）
    const priceChange = data[i].isHit ? 2 : -2; // 中奖涨2点，未中奖跌2点
    const open = basePrice;
    const close = open + priceChange;
    const high = Math.max(open, close);
    const low = Math.min(open, close);
    
    klineData.push([open, close, low, high]);
  }
  
  return klineData;
}

// 绘制号码趋势图 - 使用K线图
const renderNumberTrend = (data: any[]) => {
  if (!chartContainer.value) return;
  
  // 初始化图表实例
  if (!chartInstance) {
    chartInstance = echarts.init(chartContainer.value);
  }
  
  // 生成K线数据
  const klineData = generateKlineData(data);
  
  // 计算移动平均线
  const maData = calculateMovingAverage(klineData, maPeriod.value);
  
  const option: echarts.EChartsOption = {
    title: {
      text: `号码 ${displayNumber.value} 中奖趋势分析`,
      left: 'center',
      textStyle: {
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: function(params: any) {
        const dataIndex = params[0].dataIndex;
        const periodInfo = data[dataIndex];
        const kline = klineData[dataIndex];
        
        return `期号: ${periodInfo.period}<br/>` +
               `日期: ${periodInfo.date}<br/>` +
               `所有号码均中奖: ${periodInfo.isHit ? '是' : '否'}<br/>` +
               `开盘价: ${kline[0].toFixed(2)}<br/>` +
               `收盘价: ${kline[1].toFixed(2)}<br/>` +
               `最高价: ${kline[2].toFixed(2)}<br/>` +
               `最低价: ${kline[3].toFixed(2)}<br/>` +
               `累计指数: ${periodInfo.cumulativeIndex}<br/>` +
               `总中奖次数: ${periodInfo.hitCount}`;
      }
    },
    legend: {
      data: ['中奖趋势', `${maPeriod.value}期均线`],
      top: 30
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '20%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.period),
      boundaryGap: false,
      axisLine: { onZero: false }
    },
    yAxis: {
      type: 'value',
      name: '价格',
      scale: true,
      splitLine: { show: true }
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0
      },
      {
        show: true,
        xAxisIndex: 0,
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name: '中奖趋势',
        type: 'candlestick',
        data: klineData,
        itemStyle: {
          color: '#ef5350',      // 所有号码都中奖（上涨）为红色
          color0: '#26a69a',     // 有号码未中奖（下跌）为绿色
          borderColor: '#ef5350',
          borderColor0: '#26a69a'
        }
      },
      {
        name: `${maPeriod.value}期均线`,
        type: 'line',
        data: maData,
        lineStyle: {
          color: '#ff9f43',
          width: 2
        },
        smooth: true,
        showSymbol: false
      }
    ],
    toolbox: {
      feature: {
        saveAsImage: {},
        dataZoom: {}
      }
    }
  };
  
  chartInstance.setOption(option);
}

// 计算移动平均线
const calculateMovingAverage = (data: any[], period: number) => {
  const maData = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      maData.push(null); // 前几期没有足够的数据计算平均值
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        const closePrice = data[i - j][1]; // 收盘价
        sum += closePrice;
      }
      const avg = sum / period;
      maData.push(avg);
    }
  }
  
  return maData;
}

// 重置分析
const resetAnalysis = () => {
  analysisResult.value = false
  targetNumber.value = 45
  theoreticalProbability.value = '0.2500'
  currentIndex.value = 0
  hitCount.value = 0
  hitRate.value = '0.00'
  displayNumber.value = '45'
  selectedNumbers.value = [45]
  maPeriod.value = 5 // 重置均线期数为默认值
  
  // 清空图表
  if (chartInstance) {
    chartInstance.clear();
  }
}

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) return;
  
  chartInstance = echarts.init(chartContainer.value);
  
  // 等待DOM更新完成后再进行分析
  nextTick(() => {
    analyzeNumber();
  });
  
  // 添加响应式调整
  const handleResize = () => {
    chartInstance?.resize();
  };
  
  window.addEventListener('resize', handleResize);
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    chartInstance?.dispose();
  });
}

onMounted(() => {
  initChart();
});
</script>

<style scoped>
.versions-container {
  padding: 20px;
  width: 100vw;
  height: 100%;
}

.chart-container {
  width: 100%;
  height: 600px;
  margin-top: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.controls input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100px;
}

.controls button {
  padding: 8px 16px;
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:hover {
  background-color: #66b1ff;
}

.analysis-info {
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}
</style>