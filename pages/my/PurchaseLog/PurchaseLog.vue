<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="148rpx" :border="false" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				购买记录
			</view>
			<!-- <view class="fill-box"></view> -->
		</uni-nav-bar>
		<view class="mainBody">
			<view class="fill-box">
				<view class="fill-box-cover"></view>
			</view>
			<view class="content">
				<uni-list :border="false">
					 <uni-list-item direction="column" v-for="(item,i) in purchaseLog" :key="i">
						 <view slot="header" class="header-box">
							 {{item.title}}
						 </view>
						 <view slot="body" class="body-box">
							 <view>单价:￥{{parseInt(item.price).toFixed(2)}}</view>
							 <view class="goodNum">x{{item.num}}</view>
						 </view>
						 <view slot="footer" class="footer-box">
							 <view style="color: #fc520a;font-size: 45rpx;">共计:￥{{parseInt(item.totalCount).toFixed(2)}}</view>
							 <view style="color: #666;">{{item.time}}</view>
						 </view>
					 </uni-list-item>
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
				purchaseLog:[]
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
					report_type:'用户购物记录表',
					conditions:{openID:openID}
				}]
				let queryRes = await uni.$http.post('apiQuery',queryParams)
				console.log(queryRes);
				let purchaseLog = queryRes.data.list.map(e=>{
					let data = JSON.parse(e.report_data)
					let totalCount = (+data.goodsPrice)*(+data.goodsNum)
					let obj = {
						time:e.report_time,
						num:data.goodsNum,
						price:data.goodsPrice,
						totalCount:totalCount,
						title:data.goodsTitle
					}
					
					return obj
				})
				this.purchaseLog = purchaseLog.reverse()
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
			.header-box{
				
			}
			.body-box{
				    display: flex;
				    justify-content: space-between;
					align-items: center;
					.goodNum {
						width: 70rpx;
						height: 70rpx;
						background-color: #ccc;
						border-radius: 25rpx;
						line-height: 70rpx;
						text-align: center;
						margin-right: 20rpx;
					}
			}
			.footer-box{
				    display: flex;
				    justify-content: space-between;
					align-items: center;
			}
		}
	}
</style>
