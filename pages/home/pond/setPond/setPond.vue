<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="148rpx" :border="false" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				鱼塘详情
			</view>
		</uni-nav-bar>
		<view class="mainBody">
			<view class="content">
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pondRid:'',
			}
		},
		onLoad(option) {
			this.pondRid = option.pondRid
		},
		onShow() {
			this.getPondInfo(this.pondRid)
		},
		methods: {
			async getPondInfo(pondRid){
				let queryParams = [{
					report_id:pondRid
				}]
				let queryRes = await uni.$http.post('apiQuery',queryParams)
				console.log(queryRes);
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
	.mainBody{
		.content{
			.slot-box {
				display: flex;
				justify-content: space-between;
				width: 100%;
			}
		}
	}
</style>