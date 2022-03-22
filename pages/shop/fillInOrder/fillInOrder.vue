<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="148rpx" :border="false" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				填写订单
			</view>
		</uni-nav-bar>
		<view class="mainBody">
			<view class="topFix">
				<view class="addressBox" @click="toShippingAddress">
					<uni-icons type="location" size="30" color="#fc520a"></uni-icons>
					<view class="addressInfo">
						<view class="peopleInfo">
							<view>{{defaultAddress.name}}</view>
							<view class="phone">{{defaultAddress.phone}}</view>
						</view>
						<view class="detailAddress">
							{{defaultAddress.address}}
						</view>
					</view>
					<uni-icons type="right" size="20"></uni-icons>
				</view>
			</view>
			<view class="goodsCard" v-for="item in balancedGoodsList" :key="item.goodsRid">
				<view class="goodImg">
					<image style="width: 100%; height: 100%; background-color: #eeeeee;" :src="item.goodsImgUrl"
						mode="scaleToFill"></image>
				</view>
				<view class="goodContent">
					<view class="content-top">
						{{item.goodsTitle}}
					</view>
					<view class="content-bottom">
						<view class="goodPrice">
							￥{{parseInt(item.goodsPrice).toFixed(2)}}
						</view>
						<view class="goodNum">
							x{{item.goodsNum}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="submit">
			<view class="box1">
				<text style="color: #666;">共{{balancedGoodsList.length}}件</text>
				<text>合计:</text>
				<text style="color: #fc520a;font-size: 40rpx;">￥{{parseInt(totalCount).toFixed(2)}}</text>
				<view class="btn" @click="submitOrder">
					提交订单
				</view>
			</view>
		</view>
		
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog mode="base" title="温馨提示" content="确认购买？" :duration="2000"
				 @confirm="confirmPopup(balancedGoodsList,totalCount)">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				openid: '',
				balancedGoodsRid: [],
				balancedGoodsList: [],
				totalCount: 0,
				defaultAddress:{
					name:'',
					address:'',
					phone:'',
				}
			}
		},
		onLoad(option) {
			this.openid = this.$store.state.userAccount.openid
			this.balancedGoodsRid = JSON.parse(option.balancedGoodsRid)
			this.getBalancedGoods(this.balancedGoodsRid)
			this.getDefaultAddress()
		},
		onShow() {
			
		},
		methods: {
			async getDefaultAddress(){
				let queryParams = [{
					report_type:'用户收货地址表',
					conditions:{openID:this.$store.state.userAccount.openid,defaultAddress:'true'}
				}]
				let queryRes = await uni.$http.post('apiQuery',queryParams)
				if(queryRes.code=='2000'){
					let data = JSON.parse(queryRes.data.list[0].report_data)
					this.defaultAddress = data
					
				}
			},
			// 获得选中的购物车商品
			async getBalancedGoods(balancedGoodsRid) {
				let queryParams = balancedGoodsRid.map(e => {
					return {
						report_id: e
					}
				})
				let queryRes = await uni.$http.post('apiQuery', queryParams)
				if (queryRes.code == '2000') {
					this.balancedGoodsList = queryRes.data.list.map(e => {
						return JSON.parse(e.report_data)
					})
					console.log(this.balancedGoodsList);
					this.totalCount = this.balancedGoodsList.reduce((total, item) => {
						return total + parseInt(item.goodsNum) * parseInt(item.goodsPrice)
					}, 0)
				}
			},
			// 选择收货地址页面
			toShippingAddress() {
				uni.navigateTo({
					url: `/pages/shop/shippingAddress/shippingAddress`,
					events:{
						changeAddress:(data)=>{
							console.log('切换的地址',data,this.defaultAddress);
							this.defaultAddress.name = data.name
							this.defaultAddress.address = data.address
							this.defaultAddress.phone = data.phone
						}
					}
				})
			},
			submitOrder(){
				this.$refs.popup.open()
			},
			async confirmPopup(balancedGoodsList,totalCount){
				console.log(balancedGoodsList,totalCount);
				let queryParams = [{
					report_type:'用户余额表',
					conditions:{openID:this.$store.state.userAccount.openid}
				}]
				let {data} = await uni.$http.post('apiQuery',queryParams)
				let balance = +JSON.parse(data.list[0].report_data).balance
				let newBalance = balance-this.totalCount
				let balanceRid = data.list[0].report_id
				if(newBalance<0){					
					uni.showToast({
						title: `余额不足`,
						icon: 'error'
					})
					return
					
				}
				let insertParams = balancedGoodsList.map(item=>{
					let obj = {
						report_type:'用户购物记录表',
						report_Data:{openID:this.$store.state.userAccount.openid,goodsTitle:item.goodsTitle,goodsNum:item.goodsNum,goodsPrice:item.goodsPrice},
						report_time:this.$moment().format('YYYY-MM-DD HH:mm:ss')
					}
					return obj
				})
				let insertRes = await uni.$http.post('apiInsert',insertParams)
				if(insertRes.code=='2000'){
					let deleteParams = this.balancedGoodsRid
					let deleteRes = await uni.$http.post('apiDelete',deleteParams)
					if(deleteRes.code=='2000'){
						
						let updateParams = [{
							report_id:balanceRid,
							report_data:{balance:newBalance}
						}]
						let updateRes = await uni.$http.post('apiUpdate',updateParams)
						if(updateRes.code=='2000'){
							uni.navigateBack({
								delta: 3
							})
						}
						
					}
				}
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

	.mainBody {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		padding-top: 170rpx;
		margin-bottom: 100rpx;
		width: 100%;

		.topFix {
			position: fixed;
			width: 100%;
			height: 160rpx;
			top: 148rpx;
			background-color: #f5f5f5;
			display: flex;
			justify-content: center;
			align-items: center;

			.addressBox {
				display: flex;
				align-items: center;
				width: 96%;
				height: 80%;
				border-radius: 30rpx;
				background-color: #fff;

				.addressInfo {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					margin-left: 20rpx;

					.peopleInfo {
						display: flex;
						align-items: center;
						margin-top: 20rpx;
						font-size: 40rpx;

						.phone {
							font-size: 30rpx;
							color: #666;
							margin-left: 10rpx;
						}
					}

					.detailAddress {
						margin-bottom: 20rpx;
						color: #666;
					}
				}
			}
		}

		.goodsCard {
			width: 96%;
			height: 300rpx;
			border-radius: 30rpx;
			background-color: #fff;
			margin: 10rpx 0;
			display: flex;
			align-items: center;

			.goodImg {
				width: 35%;
				height: 70%;
				margin: 0 20rpx;
				border-radius: 40rpx;
				overflow: hidden;
			}

			.goodContent {
				flex: 1;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 20rpx 0;
				box-sizing: border-box;

				.content-top {
					font-size: 40rpx;
				}

				.content-bottom {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.goodPrice {
						font-size: 35rpx;
						color: #fc520a;
					}

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
			}
		}
	}


	.submit {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		background-color: #fff;

		.box1 {
			position: absolute;
			right: 0;
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.btn {
				width: 270rpx;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				margin: 0 10rpx;
				border-radius: 100rpx;
				background: #fa6c9f;
				background: -webkit-linear-gradient(left, #fa6c9f 0%, #ffe140 80%, #ffe140 100%);
				background: linear-gradient(to right, #fa6c9f 0%, #ffe140 80%, #ffe140 100%);
				color: #fff;
				font-size: 38rpx;
			}
		}
	}
</style>
