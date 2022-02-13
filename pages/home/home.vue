<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="190rpx" fixed>
			<view class="navbar-title">我的鱼塘</view>
			<view class="fill-box"></view>
		</uni-nav-bar>
		<view class="mainBody">
			<view v-for="(item,index) in fishPondInfo">
				<view class="pondCard" @click="toPondDetail(item.fishPondName,item.reportID)">
					<view class="card-title">
						<view class="pond-name">
							<uni-icons custom-prefix="iconfont" type="icon-fishpond" size="30" color="#129fdb"></uni-icons>
							{{item.fishPondName}}
						</view>
					</view>
					<view class="card-body">
						<view class="fishSpecies">
							{{item.fishSpecies}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-fab ref="fab" :pattern="fab.pattern" :popMenu="fab.popMenu" :horizontal="fab.horizontal"
			:vertical="fab.vertical" :content="fab.content" :direction="fab.direction" @trigger="trigger"></uni-fab>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				// 悬浮按钮
				fab: {
					popMenu: true,
					pattern: {
						color: 'gray',
						backgroundColor: '#FFFFFF',
						selectedColor: '#1296db',
						buttonColor: '#1296db'
					},
					content: [{
						text: '新增鱼塘',
						iconPath: '/static/fab_icons/yu.png',
						selectedIconPath: '/static/fab_icons/yu-active.png',
						active: false
					}],
					horizontal: 'right',
					vertical: 'bottom',
					direction: 'horizontal'
				},
				fishPondInfo:[],
			};
		},
		onLoad() {
			console.log('homeLoad');
		},
		onShow() {
			console.log(this.$store.state.userAccount.isAuth);
			if(!this.$store.state.userAccount.isAuth){
				uni.showModal({
					title:"温馨提示",
					content:"请先授权登录，否则将无法使用完整功能",
					showCancel:false,
					
				})
				return 
			}
			this.getPondInfo()
		},
		watch: {
			'$store.state.userAccount.openid': {
				handler: function(newVal, oldVal) {
					this.getPondInfo()
				}
			}
		},
		methods: {
			trigger(e) {
				if(!this.$store.state.userAccount.isAuth){
					uni.showModal({
						title:"温馨提示",
						content:"请先授权登录，否则将无法使用完整功能",
						showCancel:false,
						
					})
					return 
				}
				console.log(e);
				this.fab.content[e.index].active = true
				uni.navigateTo({
					url: '../addFishPond/addFishPond'
				})
			},
			// 获取鱼塘信息
			async getPondInfo() {
				
				console.log(this.$store.state.userAccount.openid);
				let queryParams = [{
					report_type: '鱼塘信息表',
					conditions: {
						openID: this.$store.state.userAccount.openid
					}
				}]
				let queryRes = await uni.$http.post('apiQuery', queryParams)
				if(queryRes.code=='5000'){
					this.fishPondInfo = []
					return
				}else{
					this.fishPondInfo = queryRes.data.list.map(e=>{
						let obj = JSON.parse(e.report_data).info
						obj.fishPondName = JSON.parse(e.report_data).fishPondName
						obj.reportID = e.report_id
						return obj
						})
					console.log(this.fishPondInfo);
				}
			},
			toPondDetail(pondName,rid){
				uni.navigateTo({
					url: `../pondDetail/pondDetail?pondName=${pondName}&rid=${rid}`
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
		position: absolute;
		left: 0;
		bottom: -13rpx;
		width: 100%;
		height: 42rpx;
		border-top-right-radius: 21rpx;
		border-top-left-radius: 21rpx;
		background-color: #f5f5f5;
	}
	.mainBody{
		display:flex;
		flex-direction:column;
		.pondCard{
			display:flex;
			flex-direction: column;
			height: 134rpx;
			padding: 0 20rpx;
			margin: 20rpx 30rpx;
			border-radius: 26rpx;
			box-shadow: 8px 8px 18px #e1e1e1,-8px -8px 18px #f5f5f5;
			background-color: linear-gradient(145deg,#ffffff,#d5e7ef);
			.card-title{
				display:flex;
				align-items: center;
				width: 100%;
				height:40%;
				font-size: 40rpx;
				border-bottom:2px solid #dddddd;
				.pond-name{
					display: flex;
					align-items: center;
				}
			}
			.card-body{
				flex:1;
				display: flex;
				align-items: center;
			}
		}
	}
</style>
