<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="148rpx" :border="false" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				购物车
			</view>
		</uni-nav-bar>
		<view class="mainBody">
			<view v-if="cartList.length==0" class="emptyCart">
				<uni-icons type="cart" size="60"></uni-icons>
				<view>购物车空空如也~</view>
			</view>
			<view v-if="cartList.length!==0" class="cart-list">
				<checkbox-group @change="checkboxChange">
					<label v-for="item in cartList" :key="item.goodsRid">
						<view class="cart-item">
							<view>
								<checkbox :value="item.goodsTitle" :checked="item.checked" />
							</view>
							<view class="item-img">
								<image style="width: 100%; height: 100%; background-color: #eeeeee;"
									:src="item.goodsImgUrl" mode="scaleToFill"></image>
							</view>
							<view class="item-content">
								<view class="item-top">
									{{item.goodsTitle}}
								</view>
								<view class="item-bottom" @tap.stop.prevent >
									<text>￥{{parseInt(item.goodsPrice).toFixed(2)}}</text>
									<uni-number-box  :value="item.goodsNum"
										@change="debounceHandleChangeGoodsNum($event,item)"></uni-number-box>
								</view>
							</view>
						</view>
					</label>
				</checkbox-group>
			</view>
		</view>
		<view class="submit">

			<checkbox-group name="allCheck" @change="changeAll" style="margin-left:30rpx">
				<label>
					<checkbox :value="allCheck.value" :checked="allCheck.checked" /><text>{{allCheck.name}}</text>
				</label>
			</checkbox-group>
			<view class="box1">
				<text>合计:</text>
				<text style="color: #fc520a;font-size: 40rpx;">￥{{totalCount.toFixed(2)}}</text>
				<view class="btn" @click="toFillInOrder">
					结算
				</view>
			</view>
		</view>

		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog mode="base" title="温馨提示" :content="popup.content" :duration="2000"
				@close="closePopup(popup.type,removedCartRid)" @confirm="confirmPopup(popup.type,removedCartRid)">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				openid: '',
				cartList: [],
				totalCount: 0, //购物车金额总计
				popup: {
					content: '', //弹框内容
					type: '', //弹框类型
				},
				removedCartRid: '', //要被移除购物车的商品
				allCheck: {
					name: '全选',
					value: 'all',
					checked: false
				}
			}
		},
		onLoad() {
			this.openid = this.$store.state.userAccount.openid
		},
		onShow() {
			this.getCartGoodsList(this.openid)
			this.allCheck.checked = false
			this.totalCount = 0
		},
		computed: {
			//点击修改商品数量--防抖
			debounceHandleChangeGoodsNum() {
				return _.debounce(this.changeGoodsNum, 200)
			}
		},
		methods: {
			checkboxChange(e) {
				console.log('复选框选中', e);
				let items = this.cartList;
				let len = this.cartList.length;
				let values = e.detail.value;
				for (let i = 0; i < len; i++) {
					let item = items[i];
					if (values.includes(item.goodsTitle)) {
						this.$set(item, 'checked', true);
					} else {
						this.$set(item, 'checked', false);
					}
				}
				this.totalCount = this.cartList.filter(item => item.checked == true).reduce((total, e) => {
						return total + e.goodsNum * parseInt(e.goodsPrice)
					}, 0)
				// 判断选中状态
				let arr = [];
				console.log(this.cartList);
				this.cartList.forEach(item => item.checked == true ? arr.push(true) : arr.push(false));
				console.log(arr);
				let isAll = arr.every(item => item == true);
				isAll ? this.$set(this.allCheck, 'checked', true) : this.$set(this.allCheck, 'checked', false)
			},
			//全选
			changeAll(e) {
				console.log(e);
				if (e.detail.value.length == 0) {
					this.cartList.map(item => this.$set(item, 'checked', false))
					this.$set(this.allCheck, 'checked', false)
					this.totalCount = 0
				} else {
					this.cartList.map(item => this.$set(item, 'checked', true))
					this.$set(this.allCheck, 'checked', true)
					this.totalCount = this.cartList.reduce((total, e) => {
						return total + e.goodsNum * parseInt(e.goodsPrice)
					}, 0)
				}
			},
			// 获取购物车里商品信息
			async getCartGoodsList(openid) {
				let queryParams = [{
					report_type: '用户购物车',
					conditions: {
						openID: openid
					}
				}]
				let queryRes = await uni.$http.post('apiQuery', queryParams)
				if (queryRes.code == '2000') {
					let carts = queryRes.data.list.map(e => {
						let obj = JSON.parse(e.report_data)
						obj.cartsRid = e.report_id
						obj.checked = false
						// obj.goodsNum = parseInt(obj.goodsNum)
						return obj
					})
					console.log('购物车列表', carts);
					this.cartList = carts

				}
			},
			// 更改购物车商品数量
			async changeGoodsNum(e, item) {
				console.log('更改商品数量', e, item.cartsRid);
				if (e == 0) {
					this.popup.content = '确认将该商品移除出购物车？'
					this.popup.type = '移除出购物车'
					this.removedCartRid = item.cartsRid
					this.$refs.popup.open()
				} else {
					let updateParams = [{
						report_id: item.cartsRid,
						report_data: {
							goodsNum: e
						}
					}]
					let updateRes = await uni.$http.post('apiUpdate', updateParams)
					if (updateRes.code == '2000') {
						item.goodsNum = e
						if (item.checked) {
							this.totalCount = this.cartList.filter(item => item.checked == true).reduce((total, e) => {
								return total + e.goodsNum * parseInt(e.goodsPrice)
							}, 0)
						}
						console.log('修改商品数量成功');
					}
				}
			},
			async confirmPopup(type, removedCartRid) {
				if (type == '移除出购物车') {
					let deleteParam = [
						removedCartRid
					]
					let deleteRes = await uni.$http.post('apiDelete',deleteParam)
					if(deleteRes.code=='2000'){
						this.cartList = this.cartList.filter(e => {
							return e.cartsRid !== removedCartRid
						})
						this.totalCount = this.cartList.filter(item => item.checked == true).reduce((total, e) => {
							return total + e.goodsNum * parseInt(e.goodsPrice)
						}, 0)
					}
					
				}
			},
			async closePopup(type, removedCartRid) {
				if (type == '移除出购物车') {
					let updateParams = [{
						report_id: removedCartRid,
						report_data: {
							goodsNum: 1
						}
					}]
					let updateRes = await uni.$http.post('apiUpdate', updateParams)
					if (updateRes.code == '2000') {
						console.log('取消移除商品返回数量1');
					}
					this.cartList.forEach(e => {
						if (e.cartsRid == removedCartRid) {
							e.goodsNum = 1
						}
					})
				}
			},
			toFillInOrder(){
				let  balancedGoods = this.cartList.filter(e=>{return e.checked})
				if(balancedGoods.length){
					let balancedGoodsRid = balancedGoods.map(e=>e.cartsRid)
					let str = JSON.stringify(balancedGoodsRid)
					uni.navigateTo({
						url:`/pages/shop/fillInOrder/fillInOrder?balancedGoodsRid=${str}`
					})
				}else{
					uni.showToast({
						title: `未选择商品`,
						icon: 'none'
					})
					return
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
		.emptyCart {
			position: fixed;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 90vh;
		}

		.cart-list {
			margin-top: 30rpx;
			margin-bottom: 100rpx;

			.cart-item {
				height: 200rpx;
				display: flex;
				align-items: center;
				margin: 0 30rpx;
				padding: 10rpx;
				background-color: #fff;
				border-radius: 30px;
				box-shadow: 5px 5px 10px #f2f2f2,
					-5px -5px 10px #ffffff;

				.item-img {
					width: 35%;
					height: 100%;
					border-radius: 40rpx;
					overflow: hidden;
				}

				.item-content {
					flex: 1;
					height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					padding: 20rpx;
					font-size: 35rpx;

					.item-bottom {
						display: flex;
						justify-content: space-between;
						font-size: 32rpx;
						color: #fc520a;
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;

		.box1 {
			position: absolute;
			right: 0;
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
