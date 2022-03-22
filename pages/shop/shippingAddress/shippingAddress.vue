<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="148rpx" :border="false" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				我的收货地址
			</view>
		</uni-nav-bar>
		<view class="mainBody">
			<uni-list>
				<uni-list-item v-for="item in addressList" :key="item.rid"  direction="column" >
					<view slot="header" class="header-box" @click="changeAddress(item.rid)">
						<view class="name">
							{{item.name}}
						</view>
						<view class="phone">
							{{item.phone}}
						</view>
					</view>
					<view slot="body" class="body-box" @click="changeAddress(item.rid)">
						<view class="address">
							{{item.address}}
						</view>
					</view>
					<view slot="footer" class="footer-box" >
						<uni-icons  type="compose" size="30" color="#1296db" @click="addShippingAddress($event,'修改',item.rid)"></uni-icons>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		<view class="btnBox">
			<view class="btn" @click="addShippingAddress($event,'新增')">
				添加收货地址
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressList:[]
			}
		},
		onShow(){
			this.getShippingAddress()
		},
		methods: {
			// 选择收货地址
			changeAddress(rid){
				let selectedAddress = this.addressList.filter(item=>{
					return item.rid == rid
				})
				const eventChannel = this.getOpenerEventChannel();
				eventChannel.emit('changeAddress', selectedAddress[0]);
				uni.navigateBack();
			},
			// 获取收获地址表信息
			async getShippingAddress(){
				let queryParams = [{
					report_type:'用户收货地址表',
					conditions:{openID:this.$store.state.userAccount.openid}
				}]
				let queryRes = await uni.$http.post('apiQuery',queryParams)
				if(queryRes.code=='2000'){
					console.log('查询用户收货地址列表成功');
					this.addressList = queryRes.data.list.map(item=>{
						let obj = JSON.parse(item.report_data)
						obj.rid = item.report_id
						return obj
					})
					console.log(this.addressList);
				}
			},
			// 新增收货地址
			addShippingAddress(e,type,rid){
				if(type=='修改'){
					uni.navigateTo({
						url:`/pages/shop/addShippingAddress/addShippingAddress?rid=${rid}`
					})
				}else{
					uni.navigateTo({
						url:`/pages/shop/addShippingAddress/addShippingAddress`
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
	.mainBody{
		.header-box{
			display:flex;
			align-items: center;
			.name{
				font-size: 45rpx;
			}
			.phone{
				color: #999;
			}
		}
		.body-box{
			display:flex;
			justify-content: space-between;
		}
		.footer-box{
			display: flex;
			justify-content:flex-end;
		}
	}
	.btnBox{
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #f5f5f5;
		.btn{
			width: 96%;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			font-size: 40rpx;
			color: #fff;
			border-radius: 90rpx;
			background: -webkit-linear-gradient(left, #fa6c9f 0%, #ffe140 80%, #ffe140 100%);
			background: linear-gradient(to right, #fa6c9f 0%, #ffe140 80%, #ffe140 100%);
		}
	}
</style>
