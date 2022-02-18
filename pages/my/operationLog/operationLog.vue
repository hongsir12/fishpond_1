<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="148rpx" :border="false" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				设备操作记录
			</view>
			<!-- <view class="fill-box"></view> -->
		</uni-nav-bar>
		<view class="mainBody">
			<view class="fill-box">
				<view class="fill-box-cover"></view>
			</view>
			<view class="content">
				<uni-list :border="false">
					 <uni-list-item :title="item.log" :note="item.time" v-for="(item,i) in operationLog" :key="i"></uni-list-item>
				    <!-- <uni-list-item  title="列表文字" v-for="(item,i) in operationLog" :key="i">
						<view slot="body" class="slot-box">
							<view class="box-left">
								<text>{{item.log}}</text>
							</view>
							<view class="box-right">
								<text>{{item.time}}</text>
							</view>
						</view>
					</uni-list-item> -->
				</uni-list>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				operationLog:[]
			}
		},
		onShow(){
			if(!this.$store.state.userAccount.isAuth){
				this.operationLog = []
				uni.showModal({
					title:"温馨提示",
					content:"请先授权登录，否则将无法使用完整功能",
					showCancel:false,
					success: () => {
						this.back()
					}
				})
				return 
			}
			this.getOperationLog()
		},
		methods: {
			//获取操作记录
			async getOperationLog(){
				let queryParams = [{
					report_type:'操作记录表',
				}]
				let queryRes = await uni.$http.post('apiQuery',queryParams)
				let operationLog = queryRes.data.list.map(e=>{
					return {time:e.report_time,log:JSON.parse(e.report_data).operationLog}
				});
				console.log(operationLog.reverse());
				this.operationLog = _.take(operationLog,15)
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
