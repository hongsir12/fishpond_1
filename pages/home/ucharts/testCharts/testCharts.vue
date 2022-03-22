<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="148rpx" :border="false" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				数据图表
			</view>
			<!-- <view class="fill-box"></view> -->
		</uni-nav-bar>
		<view class="mainBody">
			<view class="fill-box">
				<view class="fill-box-cover"></view>
			</view>
			<view class="content">
				<qiun-title-bar title="进线电压统计" />
				<view class="charts-box">
					<qiun-data-charts type="demotype" canvasId="voltDataId"
						:opts="{enableScroll:true,dataLabel:false,xAxis:{scrollShow:true,itemCount:5,disableGrid:true},yAxis:{max:350,min:0}}"
						:chartData="voltData" :ontouch="true" :canvas2d="false" />
				</view>
				<qiun-title-bar title="每月用电量统计" />
				<view class="charts-box">
					<qiun-data-charts type="column" canvasId="selectricUseDataId"
						:opts="{enableScroll:true,xAxis:{scrollShow:true,itemCount:4,disableGrid:true}}"
						:chartData="electricUseData" :ontouch="true" :canvas2d="false" />
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	var canvaLineA = null;
	export default {
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				textarea: '',
				electricUseData: {
					"categories": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
					"series": [{
						"name": "用电量统计",
						"data": [512, 487, 537, 443, 534, 456, 596, 477, 566, 498, 495, 564]
					}]
				},
				voltData: {
					"categories": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16",
						"17", "18", "19", "20", "21", "22", "23", "24"
					],
					"series": [{
							"name": "A口",
							"data": [244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244,
								244, 244, 244, 244, 244, 244, 244, 244
							]
						},
						{
							"name": "B口",
							"data": [244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244,
								244, 244, 244, 244, 244, 244, 244, 244
							]
						},
						{
							"name": "C口",
							"data": [244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244,
								244, 244, 244, 244, 244, 244, 244, 244
							]
						}
					]
				}
			}
		},
		onLoad(options) {
			console.log(options)

		},
		methods: {
			showvoltData(canvasId, chartData) {
				canvasVolt = new uCharts({

				})
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
	.navbar-title {
		position: absolute;
		left: 30rpx;
		top: 90rpx;
		font-size: 40rpx;
		color: #ffffff;
	}

	.fill-box {
		position: fixed;
		top: 148rpx;
		left: 0;
		width: 100%;
		height: 42rpx;
		z-index: 10;
		// border-top-right-radius: 21rpx;
		// border-top-left-radius: 21rpx;
		background-color: #1296db;

		.fill-box-cover {
			width: 100%;
			height: 100%;
			border-top-right-radius: 21rpx;
			border-top-left-radius: 21rpx;
			background-color: #f5f5f5;
		}
	}

	.mainBody {
		.content {
			margin-top: 42rpx;

			.charts-box {
				width: 100%;
				height: 300px;
			}
		}
	}
</style>
