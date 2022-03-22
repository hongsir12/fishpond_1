<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="148rpx" :border="false" fixed>
			<view class="navbar-title">
				商城
			</view>
			<!-- <view class="fill-box"></view> -->
		</uni-nav-bar>
		<view class="mainBody">
			<view class="fill-box">
				<view class="fill-box-cover"></view>
			</view>
			<view class="content">
				<view class="goods-list">
					<view class="goods-item" v-for="item in goodsList" :key="item.rid" @click="toGoodDetail(item.rid)">
						<image :src="item.img_url" mode=""></image>
						<view class="goods-price">
							<text>￥{{item.price}}</text>
						</view>
						<view class="goods-title">
							{{item.title}}
						</view>
					</view>					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsList:[],
			}
		},
		onLoad() {
			this.getGoods()
		},
		methods: {
			// 获取商城商品列表
			async getGoods(){
				let queryParams = [{
					report_type:'商城商品表'
				}]
				let queryRes = await uni.$http.post('apiQuery',queryParams)
				let goodsList = queryRes.data.list.map(e=>{
					let obj = JSON.parse(e.report_data)
					obj.rid = e.report_id
					return obj
				})
				console.log(goodsList);
				this.goodsList = goodsList
			},
			// 跳转到商品详情页
			toGoodDetail(rid){
				uni.navigateTo({
					url:`/pages/shop/goodsDetail/goodsDetail?goodsID=${rid}`
				})
			}
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
			.goods-list{
				padding: 0 15rpx;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				.goods-item{
					background-color: #fff;
					width: 355rpx;
					margin: 10rpx 0;
					padding:15rpx;
					box-sizing: border-box;
					image{
						width: 80%;
						height: 150px;
						display: block;
						margin: 0 auto;
					}
					.goods-price{
						color: #E43D33;
						font-size: 36rpx;
						margin: 15rpx 0 5rpx 0 ;
					}
					.goods-title{
						font-size: 28rpx;
						padding-bottom: 15rpx;
						padding-top: 10rpx;
					}
				}
			}
		}
	}
</style>