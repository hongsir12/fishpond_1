<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="292rpx" :border="false" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				我的钱包
			</view>
			<view class="navbar-balance">
				<text>￥{{balance?balance.toFixed(2):'0.00'}}</text>
			</view>
			<!-- <view class="fill-box"></view> -->
		</uni-nav-bar>
		<view class="mainBody">
			<view class="fill-box">
				<view class="fill-box-cover"></view>
			</view>
			<view class="content">
				<uni-grid :column="3" :showBorder="false">
					<uni-grid-item v-for="(item,i) in rechargeList" :key="i">
						<view class="grid-item"  :data-item="i" @click="activeGrid">
							<view class="item-box" :class="activeItem==i?'active':''">
								<view class="price">
									{{item.price}}元
								</view>
								<view class="discount">
									售价:{{item.discount}}元
								</view>
							</view>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<view class="btn" @click="confirmRecharge(activeItem)">
				<text>确认充值</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				openID: '',
				balanceRid:'', //当前用户余额表rid
				balance:'',
				rechargeList:[
					{price:10,discount:9.98},
					{price:20,discount:19.98},
					{price:30,discount:29.98},
					{price:50,discount:49.98},
					{price:100,discount:99.98},
					{price:200,discount:199.98},
					{price:300,discount:299.98},
					{price:500,discount:499.98},
				],
				activeItem:null,
			}
		},
		onLoad(option) {
			this.openID = option.openID
		},
		onShow() {
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
			this.getBalance(this.openID)
		},
		methods: {
			// 获取余额
			async getBalance(openid) {
				let queryParams = [{
					report_type: '用户余额表',
					conditions: {
						openID: openid
					}
				}]
				// 发起请求查询当前用户余额
				let queryRes = await uni.$http.post('apiQuery', queryParams)
				console.log(queryRes);
				this.balanceRid = queryRes.data.list[0].report_id;
				this.balance = parseInt(JSON.parse(queryRes.data.list[0].report_data).balance)
			},
			// 选中的宫格
			activeGrid(e){
				let id = e.currentTarget.dataset.item
				this.activeItem = id
			},
			// 确认充值
			confirmRecharge(activeItem){
				let charge = this.rechargeList[activeItem];
				uni.showModal({
				    title: '温馨提示',
				    content: `确认充值${charge.price}元？`,
				    success: async (res) =>{
				        if (res.confirm) {
				            console.log('用户点击确定');
							let balanceSum = this.balance + charge.price
							let updateParams = [{
								report_id:this.balanceRid,
								report_data:{balance:balanceSum}
							}]
							let updateRes = await uni.$http.post('apiUpdate',updateParams)
							if(updateRes.code=='2000'){
								let insertParams = [{
									report_type:'充值记录表',
									report_data:{openID:this.$store.state.userAccount.openid,rechargeMoney:charge.price},
									report_time:this.$moment().format('YYYY-MM-DD HH:mm:ss')
								}]
								await uni.$http.post('apiInsert',insertParams)
								this.balance = balanceSum
								uni.showToast({
									title: '充值成功',
									icon: 'success',
									duration: 2000
								})
							}
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
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

	.navbar-balance {
		position: absolute;
		left: 30rpx;
		bottom: 30rpx;
		font-size: 90rpx;
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
			.grid-item{
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				.item-box{
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 95%;
					height: 85%;
					border-radius: 30rpx;
					background: #f5f5f5;
					box-shadow:  5rpx 5rpx 30rpx #d8d8d8;
					.price{
						color: #999;
						font-size: 55rpx;
					}
					.discount{
						
					}
					
				}
				.active{
					border: 3px solid #FF5A5F;
				}
				
			}			
		}
		.btn{
			position: absolute;
			bottom:60rpx;
			left: 50%;
			transform: translateX(-50%);
			height: 90rpx;
			width: 70%;
			background-color: #FF5A5F;
			border-radius: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			font-size: 40rpx;
		}
	}
</style>
