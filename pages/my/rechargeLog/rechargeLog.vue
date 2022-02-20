<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="148rpx" :border="false" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				充值记录
			</view>
			<!-- <view class="fill-box"></view> -->
		</uni-nav-bar>
		<view class="mainBody">
			<view class="fill-box">
				<view class="fill-box-cover"></view>
			</view>
			<view class="content">
				<uni-list :border="false">
					 <uni-list-item :title="`充值${item.log}元`" :note="item.time" v-for="(item,i) in rechargeLog" :key="i"></uni-list-item>
				</uni-list>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				openID:'',
				rechargeLog:[]  //充值记录列表
			}
		},
		onLoad(option) {
			this.openID = option.openID
		},
		onShow() {
			this.getRechargeLog(this.openID)
		},
		methods: {
			async getRechargeLog(openID){
				let queryParams = [{
					report_type:'充值记录表',
					conditions:{openID:openID}
				}]
				let queryRes = await uni.$http.post('apiQuery',queryParams)
				console.log(queryRes);
				let rechargeLog = queryRes.data.list.map(e=>{
					return {time:e.report_time,log:JSON.parse(e.report_data).rechargeMoney}
				})
				console.log(rechargeLog.reverse());
				this.rechargeLog = rechargeLog
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
		z-index:10;
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
	.mainBody{
		.content{
			margin-top:42rpx;
			.slot-box {
				display: flex;
				justify-content: space-between;
				width: 100%;
			}
		}
	}
</style>
