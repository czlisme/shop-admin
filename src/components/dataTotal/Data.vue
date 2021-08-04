<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card style="overflow:auto;width:90%;height:100%">
            <div id="main"></div>
        </el-card>
    </div>
</template>
<script>
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { LineChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent
} from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import {
    CanvasRenderer
} from 'echarts/renderers'
echarts.use(
    [TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer, LegendComponent]
)
export default {
    // 导入echarts
    data(){
        return {
        options: {
                title: {
                text: '用户来源'
                },
                tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                    backgroundColor: '#E9EEF3'
                    }
                }
                },
                grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
                },
                xAxis: [
                {
                    boundaryGap: false
                }
                ],
                yAxis: [
                {
                    type: 'value'
                }
                ],
            }
        }
    },
    created(){},
    async mounted(){
        var myChart = echarts.init(document.getElementById('main'))
        const { data:res } = await this.$http.get('reports/type/1')
        if (res.meta.status !== 200){
            this.$message.error('获取折现数据失败')
        }
        // 指定图表的配置项和数据

        // 使用刚指定的配置项和数据显示图表。
        console.log(res.data)
        // 对象覆盖原有的属性和没有的覆盖到this.options中
        Object.assign(this.options, res.data)
        myChart.setOption(this.options)
    }
}
</script>
<style scoped>
#main {
    width: 100%;
    min-width:480px;
    height: 550px;
}
</style>
