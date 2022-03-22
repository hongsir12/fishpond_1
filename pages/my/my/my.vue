<template>
	<view>
		<uni-nav-bar color="#ffffff" backgroundColor="#1296db" height="280rpx" fixed>
			<view class="user-avatar-box" @click="login">
				<image class="avatar" :src="userInfo.avatar?userInfo.avatar:'../../../static/weixin_login.png'"></image>
				<view class="userInfo">
					<view>{{userInfo.nickName?userInfo.nickName:'授权登录'}}</view>
				</view>
			</view>
			<view class="fill-box"></view>
		</uni-nav-bar>

		<view class="uni-flex uni-column">

			<view class="my-wallet-panel uni-flex-item uni-flex uni-row">
				<view class="uni-flex-item uni-flex uni-column" @click="toBalance">
					<image style="width: 100rpx;height: 100rpx;border-radius: 50rpx;" src="https://s4.ax1x.com/2022/01/25/7b6TMR.png"></image>
					<text>￥{{isAuth?balance.toFixed(2):'0.00'}}</text>
				</view>
				<view class="uni-flex-item uni-flex uni-column" @click="toRechargeLog">
					<image style="width: 100rpx;height: 100rpx;border-radius: 50rpx;" src="https://s4.ax1x.com/2022/01/25/7b6zzd.png"></image>
					<text>充值记录</text>
				</view>
				<view class="uni-flex-item uni-flex uni-column" @click="toPurchaseLog">
					<image style="width: 100rpx;height: 100rpx;border-radius: 50rpx;" src="https://s4.ax1x.com/2022/01/25/7b6xRH.png"></image>
					<text>购买记录</text>
				</view>
			</view>


			<uni-list>
				<uni-list-item :show-extra-icon="true" :extra-icon="{color: '#1296db',size: '22',type: 'my_repair'}" title="特约维修点" link to="/pages/my/repairShops/repairShops" ></uni-list-item>
				<uni-list-item :show-extra-icon="true" :extra-icon="{color: '#1296db',size: '22',type: 'settings-filled'}" title="近期设备操作" link to="/pages/my/operationLog/operationLog" ></uni-list-item>
				<uni-list-item :show-extra-icon="true" :extra-icon="{color: '#1296db',size: '22',type: 'my_service'}" title="联系客服" link to="/pages/notice/notice"></uni-list-item>
				<uni-list-item :show-extra-icon="true" :extra-icon="{color: '#1296db',size: '22',type: 'my_writing'}" title="意见反馈" link to="/pages/notice/notice"></uni-list-item>
				<uni-list-item :show-extra-icon="true" :extra-icon="{color: '#1296db',size: '22',type: 'info'}" title="用户协议" link to="/pages/my/userAgreement/userAgreement"></uni-list-item>
				<uni-list-item :show-extra-icon="true" :extra-icon="{color: '#1296db',size: '22',type: 'help'}" title="使用帮助" link to="/pages/my/handbook/handbook"></uni-list-item>
			</uni-list>


		</view>
		<view class="btnBox" v-if="isAuth">
			<view class="btn" @click="logout">
				退出登录
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 用户信息
				userInfo: {
					avatar: '',
					nickName: '',
				},
				// 是否授权
				isAuth:false,
				// 钱包余额
				balance:0,

			}
		},
		onLoad(options) {
			// 判断用户是否授权
			this.AuthorizedOrNot()
			this.getBalance(this.$store.state.userAccount.openid)
		},
		onShow() {
			this.getBalance(this.$store.state.userAccount.openid)
		},
		methods: {
			// 点击授权登录
			login() {
				// 如果头像和昵称不为空，返回
				if (!_.isEmpty(this.$store.state.userAccount.userInfo)) {
					return
				}
				// 获取用户头像和昵称
				uni.getUserProfile({
					desc: '授权使用',
					success: async (res) => {
						uni.showLoading({
							title: '登录中...'
						})
						let user = res.userInfo
						// 将头像和昵称存到userInfo
						this.userInfo.nickName = user.nickName
						this.userInfo.avatar = user.avatarUrl
						let updateParams = [{
							report_id: this.$store.state.userAccount.report_id,
							report_data: {
								userInfo: this.userInfo
							}
						}]
						// 更新微信用户表中该用户的信息
						let updateRes = await uni.$http.post('apiUpdate', updateParams)
						if (updateRes.code == '2000') { //更新成功
							uni.hideLoading()
							this.$store.commit('updateUserAccount', {
								userInfo: this.userInfo,
								isAuth:true
							})
							uni.showToast({
								title: '登录成功',
								duration: 2000
							})
							// 显示退出登录按钮
							this.isAuth = this.$store.state.userAccount.isAuth
						} else {
							uni.hideLoading()
							uni.showToast({
								title: '登录失败',
								icon: 'error',
								duration: 2000
							})
						}
					},
					fail: (res) => {
						console.log('授权失败', res);
					}
				})
			},

			// 用户是否授权
			AuthorizedOrNot() {
				// 未授权，弹出提示框
				if (!this.$store.state.userAccount.isAuth) {
					uni.showModal({
						title:"温馨提示",
						content:"请先授权登录，否则将无法使用完整功能",
						showCancel:false,
						
					})
				} else {
					// 已授权，将用户信息显示出来
					this.userInfo = this.$store.state.userAccount.userInfo
					// 显示退出登录按钮
					this.isAuth = this.$store.state.userAccount.isAuth
				}
			},
			
			// 获取账户余额
			async getBalance(openid){
				let queryParams = [{
					report_type:'用户余额表',
					conditions:{openID:openid}
				}]
				// 发起请求查询当前用户余额
				let queryRes = await uni.$http.post('apiQuery',queryParams)
				// 查不到说明新用户，插入新数据
				if(queryRes.code=='5000'){
					let insertParams = [{
						report_type:'用户余额表',
						report_data:{openID:openid,balance:0},
						report_time:this.$moment().format('YYYY-MM-DD HH:mm:ss')
					}]
					let insertRes = await uni.$http.post('apiInsert',insertParams)
				}else{
					this.$store.commit('updateUserWallet',{balance_id:queryRes.data.list[0].report_id})
					let data = JSON.parse(queryRes.data.list[0].report_data)
					this.balance = parseInt(data.balance)
				}
			},
			
			onClick(e){
				console.log(e);
			},

			// 退出登录
			logout() {
				uni.showModal({
					title:"温馨提示",
					content:"确定退出登录？",
					success: (res) => {
						if(res.confirm){
							this.logoutConfirm(this.userInfo)
							// 隐藏退出登录按钮
							this.isAuth = false
						}
						
					}
				})
			},

			// 登出确认
			async logoutConfirm(userInfo) {
				userInfo.nickName = ''
				userInfo.avatar = ''
				// 更新store中的用户信息
				this.$store.commit('updateUserAccount', {
					isAuth:false,
					userInfo: {}
				})
				// 更新微信用户表中的用户信息
				let updateParams = [{
					report_id: this.$store.state.userAccount.report_id,
					report_data: {
						userInfo: {}
					}
				}]
				let updateRes = await uni.$http.post('apiUpdate', updateParams)
				if (updateRes.code == 2000) {
					uni.showToast({
						title: '用户已退出',
						icon: 'none',
						duration: 2000
					})
				}
			},
			// 前往余额页面
			toBalance(){
				uni.navigateTo({
					url: `../balance/balance?openID=${this.$store.state.userAccount.openid}`
				})
			},
			// 前往充值记录页面
			toRechargeLog(){
				uni.navigateTo({
				url: `../rechargeLog/rechargeLog?openID=${this.$store.state.userAccount.openid}`
				})
			},
			// 前往购买记录页面
			toPurchaseLog(){
				uni.navigateTo({
				url: `../PurchaseLog/PurchaseLog?openID=${this.$store.state.userAccount.openid}`
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.fill-box{
		position: absolute;
		left: 0;
		bottom: -13rpx;
		width: 100%;
		height: 42rpx;
		border-top-right-radius: 21rpx;
		border-top-left-radius: 21rpx;
		background-color: #f5f5f5;
	}
	// 顶部用户头像信息
	.user-avatar-box {
		position: absolute;
		left: 30rpx;
		top: 90rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		.avatar {
			width: 120rpx;
			height: 120rpx;
			border-radius: 60rpx;
		}

		.userInfo {
			margin-left: 20rpx;
			font-size: 50rpx;
		}
	}

	// 我的钱包面板
	.my-wallet-panel {
		border-radius: 30rpx;
		margin: 30rpx;
		height: 200rpx;
		background-color: #fff;
		box-shadow: 7px 7px 7px #ededed,
			-7px -7px 7px #f5f5f5;
		.uni-flex{
			justify-content: center;
			align-items: center;
		}
	}
	
	.btnBox {
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #f5f5f5;
	
		.btn {
			width: 96%;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			font-size: 40rpx;
			color: #fff;
			border-radius: 90rpx;
			background: -webkit-linear-gradient(left, #1FA2FF 0%, #12D8FA 50%, #1FA2FF 100%);
			background: linear-gradient(to right, #1FA2FF 0%, #12D8FA 50%, #1FA2FF 100%);
		}
		
	}

</style>
