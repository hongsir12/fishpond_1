<template>
	<view>
		<button type="default" @click="getData">点击</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			async getData(){
				let params = [{
					"report_type":"全部已保存图表配置",
					    "conditions":{"chartName":"磁盘IO分布图表配置"},
					    "starttime":"2021-11-08 00:00:00",
					    "overtime":"2021-11-09 12:00:00"
				}]
				let data = await uni.$http.post('apiQuery',params)
				console.log(data)
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
