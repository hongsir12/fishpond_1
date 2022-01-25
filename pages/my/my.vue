<template>
	<view>
		<uni-nav-bar color="#ffffff" backgroundColor="#1296db" height="280rpx">
			<view class="user-avatar-box" @click="login">
				<image class="avatar" :src="userInfo.avatar?userInfo.avatar:'../../static/weixin_login.png'"></image>
				<view class="userInfo">
					<view>{{userInfo.nickName?userInfo.nickName:'授权登录'}}</view>
				</view>
			</view>
		</uni-nav-bar>
		<button type="default" @click="logout">退出登录</button>
			
		<uni-popup ref="popup">
			<view  class="authTip">
				<text>请先授权登录</text>
				<text>否则将无法使用完整功能</text>				
			</view>
		</uni-popup>
		
		<uni-popup ref="popupDialog" type="dialog">
		    <uni-popup-dialog mode="base" title="温馨提示" content="确定退出当前登录账户？" message="成功消息" :duration="2000"  @confirm="logoutConfirm(userInfo)"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 用户信息
				userInfo:{
					avatar: '',
					nickName:'',
				}
				
			}
		},
		onLoad(options) {
			this.AuthorizedOrNot()
		},
		methods: {
			// 点击授权登录
			login(){
				// 如果头像和昵称不为空，返回
				if(!_.isEmpty(this.$store.state.userAccount.userInfo)){
					return
				}
				// 获取用户头像和昵称
				uni.getUserProfile({
					desc:'授权使用',
					success:async(res)=> {
						uni.showLoading({
							title: '登录中...'
						})
						let user = res.userInfo
						// 将头像和昵称存到userInfo
						this.userInfo.nickName = user.nickName
						this.userInfo.avatar = user.avatarUrl
						let updateParams =  [{
							report_id:this.$store.state.userAccount.report_id,
							report_data:{userInfo:this.userInfo}
						}]
						// 更新微信用户表中该用户的信息
						let updateRes = await uni.$http.post('apiUpdate',updateParams)
						if(updateRes.code=='2000'){ //更新成功
							uni.hideLoading()
							this.$store.commit('updateUserAccount',{userInfo:this.userInfo})
							uni.showToast({
								title:'登录成功',
								duration:2000
							})
						}else{
							uni.hideLoading()
							uni.showToast({
								title:'登录失败',
								icon:'error',
								duration:2000
							})
						}
					},
					fail:(res)=> {
						console.log('授权失败',res);
					}
				})
			},
			
			// 用户是否授权
			AuthorizedOrNot(){
				// 未授权，弹出提示框
				if(!this.$store.state.userAccount.isAuth){
					this.$refs.popup.open()
				}else{
					// 已授权，将用户信息显示出来
					this.userInfo = this.$store.state.userAccount.userInfo
				}
			},
			
			// 退出登录
			logout(){
				 this.$refs.popupDialog.open()
			},
			
			// 登出确认
			async logoutConfirm(userInfo){
				userInfo.nickName = ''
				userInfo.avatar = ''
				// 更新store中的用户信息
				this.$store.commit('updateUserAccount',{userInfo: {}})
				// 更新微信用户表中的用户信息
				let updateParams = [{
					report_id:this.$store.state.userAccount.report_id,
					report_data:{userInfo:{}}
				}]
				let updateRes = await uni.$http.post('apiUpdate',updateParams)
				if(updateRes.code==2000){
					uni.showToast({
						title:'用户已退出',
						icon:'none',
						duration:2000
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
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
		.userInfo{
			margin-left: 20rpx;
			font-size: 50rpx;
		}
	}
	.authTip{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		width: 600rpx;
		height: 200rpx;
		border-radius: 15rpx;
	}
</style>
