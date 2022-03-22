<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="148rpx" :border="false" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				商品详情
			</view>
		</uni-nav-bar>
		<view class="mainBody">
			<image :src="goodInfo.img_url" mode="widthFix"></image>
			<view class="box1">
				<view class="goods-price">
					<text>￥{{goodInfo.price}}</text>
				</view>
				<view class="goods-title">
					{{goodInfo.title}}
				</view>
			</view>
			<view class="goods-code">
				商品编号:{{goodInfo.code}}
			</view>
			<image :src="goodInfo.content_imgUrl" mode="widthFix"></image>
		</view>
		
		<uni-goods-nav class="goods-nav" :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
			@buttonClick="buttonClick" />
			
	</view>
</template>

<script>
	export default {
		data() {
			return {
				openid:'',
				goodRid: '', //商品rid
				goodInfo: {},//商品信息
				cartsRid:[], //购物车内商品rid
				options: [{
					icon: 'headphones',
					text: '客服'
				}, {
					icon: 'cart',
					text: '购物车',
					info: 0
				}],
				buttonGroup: [{
						text: '加入购物车',
					 backgroundColor: '#ff0000',
						color: '#fff'
					}
				]
			}
		},
		onLoad(option) {
			this.openid = this.$store.state.userAccount.openid
			this.goodRid = option.goodsID;
			this.getGoodDetail(option.goodsID)
		},
		onShow() {
			this.getCartInfo(this.openid)
		},
		methods: {
			async getGoodDetail(rid) {
				let queryParams = [{
					report_id: rid
				}]
				let {
					data
				} = await uni.$http.post('apiQuery', queryParams)
				console.log(JSON.parse(data.list[0].report_data));
				let info = JSON.parse(data.list[0].report_data)
				this.goodInfo = info
			},
			// 获取购物车详情
			async getCartInfo(openid){
				let queryParam = [{
					report_type:'用户购物车',
					conditions:{openID:openid}
				}]
				let queryRes = await uni.$http.post('apiQuery',queryParam)
				if(queryRes.code=='2000'){
					this.options[1].info = queryRes.data.list.length
					this.cartsRid = queryRes.data.list.map(item=>{
						return JSON.parse(item.report_data).goodsRid
					})
					
				}else{
					this.options[1].info = 0
				}
				console.log(this.cartsRid);
				
			},
			onClick(e) {
				if(e.index==0){
					uni.showToast({
						title: `点击${e.content.text}`,
						icon: 'none'
					})
				}else if(e.index==1){
					uni.navigateTo({
						url:`/pages/shop/cart/cart`
					})
				}
				
			},
			async buttonClick(e) {
				// console.log(e)
				if(e.index==0){
					if(this.cartsRid.includes(this.goodRid)){
						uni.showToast({
							title: `已有该商品`,
							icon: 'none'
						})
						return
					}
					let insertParam = [{
						report_type:'用户购物车',
						report_data:{openID:this.openid,goodsRid:this.goodRid,goodsNum:1,goodsTitle:this.goodInfo.title,goodsPrice:this.goodInfo.price,goodsImgUrl:this.goodInfo.img_url},
						report_time: this.$moment().format('YYYY-MM-DD HH:mm:ss')
					}]
					let insertRes = await uni.$http.post('apiInsert',insertParam)
					if(insertRes.code=='2000'){
						this.cartsRid.push(this.goodRid)
						this.options[1].info++
						uni.showToast({
							title: `已添加至购物车`,
							icon: 'success'
						})
					}else{
						console.log('添加至购物车失败');
					}
				}else{
					uni.navigateTo({
						url:`/pages/shop/fillInOrder/fillInOrder`
					})
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
		margin-bottom: 100rpx;
		image {
			width: 100%;
		}

		.box1 {
			padding: 10px;
			background-color: #fff;

			.goods-price {
				color: #E43D33;
				font-size: 40rpx;
			}

			.goods-title {
				font-size: 36rpx;
			}
		}

		.goods-code {
			margin: 10rpx 0;
			padding: 10px;
			font-size: 28rpx;
			background-color: #fff;
		}
	}
	.goods-nav{
		position: fixed;
		bottom: 0;
		width: 100%;
	}
</style>
