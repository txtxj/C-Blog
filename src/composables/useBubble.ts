import { ECharts, init } from 'echarts'
import { Ref } from 'vue'

function initBubble(
	data = [],
	format = [], // [label, amount, route]
	dom: Ref<HTMLDivElement | null | undefined>,
): ECharts {
	let bubbleChart: ECharts
	let [maxValue, temp] = [0, []]
	data.forEach((item) => {
		temp.push(item[format[1]])
	})
	maxValue = Math.max.apply(null, temp)

	// 气泡颜色数组
	let color = [
		'#FFB600',
		'#886CFF',
		'#0084FF',
		'#4CB690',
		'#58B458',
		'#6C6C6C',
		'#F56161',
		'#FC754C',
		'#5F5EEC',
	]
	// 气泡颜色备份
	let bakeColor = [...color]
	// 气泡数据
	let bubbleData = []
	// 气泡基础大小
	let basicSize = 70
	// 节点之间的斥力因子,值越大,气泡间距越大
	let repulsion = 450
	// 根据气泡数量配置基础大小和斥力因子（以实际情况进行适当调整，使气泡合理分布）
	if (data.length >= 5 && data.length < 10) {
		basicSize = 60
		repulsion = 350
	}
	if (data.length >= 10 && data.length < 20) {
		basicSize = 50
		repulsion = 250
	} else if (data.length >= 20) {
		basicSize = 40
		repulsion = 150
	}

	// 填充气泡数据数组bubbleData
	for (let item of data) {
		// 确保气泡数据条数少于或等于气泡颜色数组大小时，气泡颜色不重复
		if (!bakeColor.length) bakeColor = [...color]
		let colorSet = new Set(bakeColor)
		let curIndex = Math.round(Math.random() * (colorSet.size - 1))
		let curColor = bakeColor[curIndex]
		colorSet.delete(curColor)
		bakeColor = [...colorSet]
		// 气泡大小设置
		let size = (item[format[1]] * basicSize * 2) / maxValue
		if (size < basicSize) size = basicSize

		bubbleData.push({
			name: item[format[0]],
			value: item[format[1]],
			route: item[format[2] ?? 1],
			symbolSize: size,
			draggable: false,
			itemStyle: {
				normal: { color: curColor },
			},
		})
	}
	let bubbleOptions = {
		backgroundColor: '#fff',
		animationEasingUpdate: 'bounceIn',
		series: [
			{
				type: 'graph',
				layout: 'force',
				force: {
					repulsion: repulsion,
					edgeLength: 10,
				},
				roam: false,
				label: {
					normal: {
						show: true,
						align: 'center',
						formatter: function (params: any) {
							return `${params.name}\n${params.value}`
						},
						fontSize: 15,
					},
				},
				data: bubbleData,
				emphasis: { scale: 1 },
			},
		],
	}

	bubbleChart = init(dom.value as HTMLDivElement)
	bubbleChart?.setOption(bubbleOptions as any)
	bubbleChart.on('mouseout', function (params) {
		bubbleChart.getDom().removeAttribute('data-clickable')
	})
	bubbleChart.on('mousemove', function (params) {
		bubbleChart.getZr().setCursorStyle('inherit')
		bubbleChart.getDom().setAttribute('data-clickable', '')
	})

	if (format[2]) {
		const router = useRouter()
		bubbleChart.on('mousedown', function (params) {
			router.push((params.data as { route: string }).route)
		})
	}

	return bubbleChart
}

function resizeBubble(chart: ECharts | null) {
	if (chart) {
		chart.resize()
		chart.getOption()
	}
}

export default () => ({
	initBubble,
	resizeBubble,
})
