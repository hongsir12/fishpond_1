<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="190rpx" fixed>
			<view class="navbar-title">我的鱼塘</view>
			<view class="fill-box"></view>
		</uni-nav-bar>
		<view class="mainBody">
			<!-- 鱼塘视图 -->
			<view v-for="(item,index) in fishPondInfo" v-if="!deviceMode">
				<view class="pondCard" @click="toPondDetail(item.fishPondName,item.reportID)" @longpress="toSetPond(item.reportID)">
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
						<view class="runingAeratorCount">
							<text v-show="item.runingAeratorCount" style="color: #4ba92f;">{{`${item.runingAeratorCount}个运行中的增氧机`}}</text>
							<text v-show="!item.runingAeratorCount" style="color: #999;">无运行中的增氧机</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 设备视图 -->
			
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
					}
					// ,{
					// 	text:'切换视图',
					// 	iconPath: '/static/fab_icons/loop.png',
					// 	selectedIconPath: '/static/fab_icons/loop-active.png',
					// 	active: false
					// },
					],
					horizontal: 'right',
					vertical: 'bottom',
					direction: 'horizontal'
				},
				fishPondInfo:[],  //鱼塘信息列表
				deviceMode:false, //设备视图
				deviceInfo:[],    //设备信息列表
			};
		},
		onLoad() {
			console.log('homeLoad');
		},
		onShow() {
			if(!this.$store.state.userAccount.isAuth){
				this.fishPondInfo = []
				uni.showModal({
					title:"温馨提示",
					content:"请先授权登录，否则将无法使用完整功能",
					showCancel:false,
					
				})
				return 
			}
			this.fab.content.forEach(e=>{
				e.active = false
			})
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
				if(e.index==0){
					uni.navigateTo({
						url: '../pond/addFishPond/addFishPond'
					})
					this.$refs.fab.close()
					
				}else{
					
					this.deviceMode = true
				}
				
			},
			// 获取鱼塘信息
			async getPondInfo() {
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
					
					let fishPondInfo = queryRes.data.list.map(e=>{
						let obj = JSON.parse(e.report_data).info
						if(typeof obj=='string'){
							obj = JSON.parse(obj)
						}
						obj.fishPondName = JSON.parse(e.report_data).fishPondName
						obj.reportID = e.report_id
						obj.runingAeratorCount = 0
						return obj
						})
					
					// 全部运行中的增氧机列表
					let aeratorList = await this.getAeratorInfo()
					if(aeratorList.length==0){
						this.fishPondInfo = fishPondInfo
						return 
					}
					// 计算返回每个鱼塘拥有的运行中的增氧机数量
					let count = await this.pondHasAeratorCount(aeratorList)
					let pondCountMap = {}
					for(let rec of count){
						pondCountMap[`${rec.pondRid}`] = pondCountMap[`${rec.pondRid}`]||0
						pondCountMap[`${rec.pondRid}`] +=  rec.aeratorsCount
					}
					fishPondInfo.forEach(e=>{
						e.runingAeratorCount = pondCountMap[`${e.reportID}`] || 0
					})
					this.fishPondInfo = fishPondInfo
				}
			},
			// 获取运行中的增氧机信息
			async getAeratorInfo(){
				let queryParams = [{
					report_type:'增氧机信息表',
					conditions:{isOnline:'true'}
				}]
				let queryRes = await uni.$http.post('apiQuery',queryParams)
				if(queryRes.code=='2000'){
					let aeratorList = queryRes.data.list.map(e=>{
						let obj = {deviceRid:JSON.parse(e.report_data).deviceRid}
						return obj
					});
					return aeratorList
				}else{
					return []
				}
				
			},
			// 获取鱼塘拥有的运行中的增氧机数量
			async pondHasAeratorCount(aeratorList){
				let queryParams = aeratorList.map(e=>{
					return {report_id:e.deviceRid}
				})
				let queryRes = await uni.$http.post('apiQuery',queryParams)
				let deviceHasAeratorList = queryRes.data.list.map(device=>{
					return {rid:device.report_id,pondRid:JSON.parse(device.report_data).fishPondRid}
				})
				let tmp = {}
				for(let rec of aeratorList){			
					tmp[`${rec.deviceRid}`] = tmp[`${rec.deviceRid}`] || 0
					tmp[`${rec.deviceRid}`]+=1
				}
				return deviceHasAeratorList.map(e=>{					
					return {pondRid:e.pondRid,aeratorsCount:tmp[`${e.rid}`]}
				})
			},
			toSetPond(rid){
				uni.navigateTo({
					url: `../pond/addFishPond/addFishPond?pondRid=${rid}`
				})
			},
			toPondDetail(pondName,rid){
				uni.navigateTo({
					url: `../pond/pondDetail/pondDetail?pondName=${pondName}&rid=${rid}`
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
				justify-content: space-between;
				.fishSpecies{
					
				}
				.runingAeratorCount{
					font-size: 27rpx;
				}
			}
		}
	}
</style>
