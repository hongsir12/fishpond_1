<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="148rpx" :border="false" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				{{pondName}}
			</view>
			<!-- <view class="fill-box"></view> -->
		</uni-nav-bar>
		<view class="mainBody">
			<view class="fill-box">
				<view class="fill-box-cover"></view>
			</view>
			<view class="body-title">
				<text>设备列表</text>
				<view class="title-btn" @click="showAddDeviceDialog">
					<uni-icons type="plus" color="#1296db" size="30"></uni-icons>
					<text>添加</text>
				</view>
			</view>
			<view class="body-list">
				<uni-collapse>
					<uni-collapse-item title-border="none" :border="false" v-for="(device,index) in devices"
						:key="index">
						<template v-slot:title>
							<view class="device-title" @longpress="toDeviceDetail(device.deviceRid)">
								<uni-icons type="my_wifi" color="#00aa00" size="30"></uni-icons>
								<view class="device-title-text">
									<view class="device-code">
										<text>{{device.order}}</text>
										:{{device.name?device.name:device.code}}
									</view>
									<view class="device-type">
										{{device.type}}
										<text v-show="device.name">({{device.code}})</text>
									</view>
								</view>
							</view>

						</template>
						<view class="content">
							<uni-list>
								<uni-list-item v-if="" v-for="(aerator,i) in device.aerators" :key="i"
									:show-extra-icon="true"
									:extra-icon="{color: '#1296db',size: '33',type: 'my_oxygen'}">
									<view slot="body" class="slot-box" @click="showAeratorInfo(aerator.aeratorRid)">
										<view class="uni-flex uni-column">
											<view>{{aerator.aeratorName}}</view>
											<view style="font-size: 28rpx;color:#7c7d7f">{{aerator.aeratorID}}</view>
										</view>
										<view class="uni-inline-item">
											<uni-icons type="smallcircle-filled" size="20"
												:color="aerator.isOnline?'#07C120':'#C8C9CC'"></uni-icons>
											<view>{{aerator.aeratorType}}</view>
										</view>
									</view>
								</uni-list-item>
							</uni-list>
							<button v-if="device.aerators.length>=4?false:true" type="default"
								@click="toAddAerator(device.code,device.deviceRid)">绑定增氧机</button>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>

		</view>

		<uni-popup ref="addDevicePopup" type="dialog" mask-background-color="rgba(0,0,0,0.3)">
			<uni-popup-dialog mode="input" message="成功消息" :duration="2000" :before-close="true" title="添加设备"
				placeholder="请输入设备ID" cancelText="扫描二维码" @close="scanCode" @confirm="addDeviceConfirm">
			</uni-popup-dialog>
		</uni-popup>

		<uni-popup ref="aeratorInfoPopup" type="bottom"  @maskClick="closeaeratorInfoPopup">
			<view class="aeratorInfoPanel">
				<view class="panel-title uni-inline-item">
					<view class="title-text uni-flex uni-column">
						<view class="uni-flex uni-h3">
							<text>{{aeratorInfoPanel.aeratorName}}({{aeratorInfoPanel.ratedVoltage}})</text>
						</view>
						<text class="uni-h5">{{aeratorInfoPanel.aeratorID}}</text>
					</view>
					<view class="title-btn" @click="removeAerator(aeratorInfoPanel.aeratorRid)">
						<uni-icons type="minus" color="#ee0a24" size="30"></uni-icons>
						<text style="color: #ee0a24;">移除</text>
					</view>
				</view>
				<view class="panel-body">
					<uni-list>
						<uni-list-item title="监测运行电流" note="监测设备运行电流,超过或低于设定的范围都会主动提醒" :show-switch="true" :switchChecked="aeratorInfoPanel.ampereMonitorStatus"  @switchChange="switchChange($event,aeratorInfoPanel.aeratorRid,'ampereMonitorStatus')" ></uni-list-item>
						<uni-list-item title="过流停机" note="如果开启过流停机,当运行电流超过监测范围上限时,会自动关闭该增氧机" :show-switch="true" :switchChecked="aeratorInfoPanel.overCurrentShutdownStatus"  @switchChange="switchChange($event,aeratorInfoPanel.aeratorRid,'overCurrentShutdownStatus')"></uni-list-item>
						<uni-list-item title="停机警告" note="运行电流低于设定值时,会主动电话告警" :show-switch="true" :switchChecked="aeratorInfoPanel.shutdownAlarmStatus"  @switchChange="switchChange($event,aeratorInfoPanel.aeratorRid,'shutdownAlarmStatus')" ></uni-list-item>
						<!-- <uni-list-item>
							<view slot="body" class="slot-box uni-inline-item">
								<view>过流停机</view>
								<switch :checked="aeratorInfoPanel.overCurrentShutdownStatus"
									@change="switchChange($event,aeratorInfoPanel.aeratorRid,'overCurrentShutdownStatus')" />
							</view>
						</uni-list-item>
						<uni-list-item>
							<view slot="body" class="slot-box uni-inline-item">
								<view>停机告警</view>
								<switch :checked="aeratorInfoPanel.shutdownAlarmStatus"
									@change="switchChange($event,aeratorInfoPanel.aeratorRid,'shutdownAlarmStatus')" />
							</view>
						</uni-list-item> -->
					</uni-list>
					<view class="btn-group">
						<view class="btn-item" @click="toSetAerator(aeratorInfoPanel.aeratorRid,0)">
							<uni-icons type="gear-filled" size="30"></uni-icons>
							<text>设置</text>
						</view>
						<view class="btn-item" @click="toSetAerator(aeratorInfoPanel.aeratorRid,1)">
							<uni-icons type="gear-filled" size="30"></uni-icons>
							<text>定时开关</text>
						</view>
						<view class="btn-item" v-if="!aeratorInfoPanel.isOnline" style="flex:1;background-color: #18BC37;color: #ffffff;" @click="changOnline(aeratorInfoPanel.aeratorRid,aeratorInfoPanel.isOnline)">
							<uni-icons type="gear" size="30"></uni-icons>
							<text>立即启动</text>
						</view>
						<view class="btn-item" v-if="aeratorInfoPanel.isOnline" style="flex:1;background-color: #ee0a24;color: #ffffff;"  @click="changOnline(aeratorInfoPanel.aeratorRid,aeratorInfoPanel.isOnline)">
							<uni-icons type="gear" size="30"></uni-icons>
							<text>立即停止</text>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	
		<uni-popup ref="removePopup" type="dialog">
		    <uni-popup-dialog mode="base" title="温馨提示" content="确认移除增氧机？" :duration="2000" @confirm="confirmRemoveAerator(aeratorInfoPanel.aeratorRid,aeratorInfoPanel.isOnline)"></uni-popup-dialog>
		</uni-popup>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				openid: '',
				pondName: '', //鱼塘名称
				fishPondRid: '', // 该鱼塘信息表的report_id
				devices: [], // 设备列表
				aeratorInfoPanel: {}, //增氧机信息弹框面板数据
				removedAeratorRid:'', //被移除的增氧机的rid
				currentSettingAeratorRid:'', // 当前前往设置的增氧机rid
			}
		},

		onLoad(option) {
			this.openid = this.$store.state.userAccount.openid
			this.pondName = option.pondName
			this.fishPondRid = option.rid
			// 获取鱼塘拥有的设备信息
			// this.getDevicesData(this.fishPondRid)
		},
		onShow() {
			this.getDevicesData(this.fishPondRid)
			this.showAeratorInfo(this.currentSettingAeratorRid)
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 显示添加设备弹框
			showAddDeviceDialog() {
				this.$refs.addDevicePopup.open()
			},
			// 扫码
			scanCode() {
				uni.scanCode({
					success: function(res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
					}
				});
				this.$refs.addDevicePopup.close()
			},

			// 确认添加设备
			async addDeviceConfirm(value) {
				let newDevices = this.devices
				let patt = /123+/
				

				if (patt.test(value) || /321+/.test(value)) {
					let type = ''
					if (patt.test(value)) {
						type = '3KW控制器'
					} else {
						type = '溶氧监测仪'
					}
					// 新增鱼塘设备
					let insertParams = [{
						report_type: '鱼塘设备表',
						report_data: {
							openID: this.openid,
							fishPondRid: this.fishPondRid,
							fishPondName:this.pondName,
							code: value,
							name: '',
							type: type,
							warrantyExDate:'2024-01-23', //质保到期日
							serviceExDate:'2023-04-12',  //服务到期日
							serviceHotline:'13510424336', //服务热线
							outageAlarmSetting:'未设置',  //断电告警设置
							inputVoltCheckStatus:false,  //输入电压检测
							
						},
						report_time: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
					}]
					let insertRes = await uni.$http.post('apiInsert', insertParams)
					if(insertRes.code=='2000'){
						uni.showToast({
							title: '添加成功',
							icon: 'success'
						})
						let insertLogParams = [{
							report_type:'操作记录表',
							report_data:{
								operationLog:`添加了${type}:${value}`
							},
							report_time:this.$moment().format('YYYY-MM-DD HH:mm:ss')
						}]
						await uni.$http.post('apiInsert',insertLogParams)
					}
					// this.getDevicesData(this.fishPondRid)
					

					this.$refs.addDevicePopup.close()
					this.toDeviceDetail(insertRes.data.list[0].report_id)
				} else {
					uni.showToast({
						title: '添加失败',
						icon: 'error'
					})
					this.$refs.addDevicePopup.close()
				}
			},
			// 获取鱼塘设备信息
			async getDevicesData(fishPondRid) {
				// 查询该鱼塘下全部设备信息
				let queryParams = [{
					report_type: '鱼塘设备表',
					conditions:{fishPondRid:fishPondRid}
				}]
				let queryRes = await uni.$http.post('apiQuery', queryParams)
				if(queryRes.code=='2000'){
					let devices = queryRes.data.list.map((device,i)=>{
						return{
							order:String.fromCharCode(i + 65),
							deviceRid:device.report_id,
							code:JSON.parse(device.report_data).code,
							name:JSON.parse(device.report_data).name,
							type:JSON.parse(device.report_data).type,
						}					
					})
					// 再根据设备信息去查询该鱼塘全部设备下的全部增氧机信息
					let queryAeratorsParams = devices.map(device=>{
						let obj = {report_type:'增氧机信息表',conditions:{deviceRid:device.deviceRid}}
						return obj
					})
					let queryAeratorRes = await uni.$http.post('apiQuery',queryAeratorsParams)
					if(queryAeratorRes.code=='2000'){
						let aeratorInfoList = queryAeratorRes.data.list.map(aeratorInfo=>{
							let obj = _.omit(JSON.parse(aeratorInfo.report_data),['openID'])
							obj.aeratorRid = aeratorInfo.report_id
							obj.isOnline = typeof obj.isOnline =='string'?JSON.parse(obj.isOnline):obj.isOnline
							return obj
						})
						console.log(aeratorInfoList)
						devices.forEach(device=>{
							
							device.aerators = aeratorInfoList.filter(aeratorInfo=>aeratorInfo.deviceRid==device.deviceRid)
						})
						console.log('鱼塘拥有设备',devices);
						this.devices = devices
					}else{
						this.devices = devices
					}

					
					// devices.forEach(async device=>{
					// 	let aeratorInfoList = await this.getDevicesAeratorData(device.deviceRid)
					// 	if(aeratorInfoList.length!==0){
					// 		aeratorInfoList = aeratorInfoList.map(aeratorInfo=>{
					// 			let obj = _.omit(JSON.parse(aeratorInfo.report_data),['openID'])
					// 			obj.aeratorRid = aeratorInfo.report_id
					// 			return obj
					// 		})
					// 	}
						
					// 	device.aerators = aeratorInfoList
					// })
					// setTimeout(() => {
						// this.devices = devices
					// }, 800)
				}else{
					console.log('该鱼塘无设备');
					this.devices = []
				}
			},
			// 获取设备所含增氧机Rid信息
			async getDevicesAeratorData(deviceRid) {
				let queryParams = [{
					report_type: '增氧机信息表',
					conditions:{deviceRid:deviceRid}
				}]
				let queryRes = await uni.$http.post('apiQuery', queryParams)
				if(queryRes.code=='2000'){
					return queryRes.data.list
				}else{
					return []
				}
				
			},
			// 获取增氧机信息具体数据info
			async getAeratorInfo(aeratorRid){
				let queryParams = [{
					report_id:aeratorRid
				}]
				let queryRes = await uni.$http.post('apiQuery',queryParams)
				if(queryRes.code == '2000'){
					return JSON.parse(queryRes.data.list[0].report_data)
				}
			},
			async showAeratorInfo(aeratorRid) {
				this.aeratorInfoPanel = {aeratorName:'',ratedVoltage:'',aeratorID:''}
				if(!aeratorRid){
					return
				}
				let queryParams = [{
					report_id:aeratorRid
				}]
				let {data:queryRes} = await uni.$http.post('apiQuery',queryParams)
				let aeratorInfo = JSON.parse(queryRes.list[0].report_data)
				aeratorInfo.shutdownAlarmStatus = typeof aeratorInfo.shutdownAlarmStatus=='string'?JSON.parse(aeratorInfo.shutdownAlarmStatus) : aeratorInfo.shutdownAlarmStatus
				aeratorInfo.ampereMonitorStatus = typeof aeratorInfo.ampereMonitorStatus=='string'?JSON.parse(aeratorInfo.ampereMonitorStatus) : aeratorInfo.ampereMonitorStatus
				aeratorInfo.overCurrentShutdownStatus = typeof aeratorInfo.overCurrentShutdownStatus=='string'?JSON.parse(aeratorInfo.overCurrentShutdownStatus) : aeratorInfo.overCurrentShutdownStatus
				aeratorInfo.isOnline = typeof aeratorInfo.isOnline=='string'?JSON.parse(aeratorInfo.isOnline) : aeratorInfo.isOnline
				aeratorInfo.aeratorRid = queryRes.list[0].report_id
				this.aeratorInfoPanel = aeratorInfo
				console.log('弹出面板信息',this.aeratorInfoPanel);
				this.$refs.aeratorInfoPopup.open()
			},
			// 显示移除增氧机确认弹框
			removeAerator(aeratorRid) {
				this.removedAeratorRid = aeratorRid
				this.$refs.removePopup.open()
			},
			// 确认移除增氧机
			async confirmRemoveAerator(aeratorRid){
				let deleteParams = [
					aeratorRid
				]
				let delRes = await uni.$http.post('apiDelete', deleteParams)
				if(delRes.code=='2000'){
					this.getDevicesData(this.fishPondRid)
					this.$refs.removePopup.close()
					this.currentSettingAeratorRid = ''
					this.$refs.aeratorInfoPopup.close()
					let insertParams = [{
						report_type:'操作记录表',
						report_data:{
							operationLog:`移除了增氧机:${this.aeratorInfoPanel.aeratorID}`
						},
						report_time:this.$moment().format('YYYY-MM-DD HH:mm:ss')
					}]
					await uni.$http.post('apiInsert',insertParams)
				}
				
			},
			closeaeratorInfoPopup(){
				this.currentSettingAeratorRid = ''
				this.getDevicesData(this.fishPondRid)
				setTimeout(()=>{
					this.aeratorInfoPanel = {}
				},200)
			},
			// 开关状态变化
			async switchChange(e, aeratorRid, prop) {
				let updateParams = [{
					report_id:aeratorRid,
					report_data:{[prop]:e.value}
				}]
				let updateRes = await uni.$http.post('apiUpdate',updateParams)
			},
			// 开启关闭增氧机
			async changOnline(aeratorRid,isOnline){
				this.aeratorInfoPanel.isOnline = !JSON.parse(isOnline)
				let updateParams = [{
					report_id:aeratorRid,
					report_data:{isOnline:!JSON.parse(isOnline)}
				}]
				let updateRes = await uni.$http.post('apiUpdate',updateParams)
				if(updateRes.code='2000'){
					//插入操作记录
					let text = '关闭'
					if(!JSON.parse(isOnline)){
						text = '开启'
					}
					let insertParams = [{
						report_type:'操作记录表',
						report_data:{
							operationLog:`${text}了增氧机:${this.aeratorInfoPanel.aeratorID}`
						},
						report_time:this.$moment().format('YYYY-MM-DD HH:mm:ss')
					}]
					await uni.$http.post('apiInsert',insertParams)
				}
			},
			// 跳转至添加增氧机页面
			toAddAerator(deviceCode, deviceRid) {
				uni.navigateTo({
					url: `../../aerator/addAerator/addAerator?deviceCode=${deviceCode}&deviceRid=${deviceRid}`
				})
			},
			// 跳转至设置增氧机页面
			toSetAerator(aeratorRid,current){
				this.currentSettingAeratorRid = aeratorRid
				this.$refs.aeratorInfoPopup.close()
				uni.navigateTo({
					url: `../../aerator/setAerator/setAerator?aeratorRid=${aeratorRid}&current=${current}`
				})
			},
			toDeviceDetail(deviceRid){
				uni.navigateTo({
					url: `../../device/deviceDetail/deviceDetail?deviceRid=${deviceRid}`
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
		.body-title {
			position: fixed;
			top: 190rpx;
			width: 95%;
			display: flex;
			// margin: 10rpx 20rpx;
			padding: 10rpx 20rpx;
			height: 60rpx;
			justify-content: space-between;
			align-items: center;
			background-color: #f5f5f5;
			z-index: 3;

			.title-btn {
				display: flex;
				align-items: center;
				color: #1296db;
			}
		}

		.body-list {
			margin-top: 122rpx;

			.device-title {
				display: flex;
				align-items: center;
				width: 100%;
				height: 120rpx;

				.device-title-text {
					.device-code {
						font-size: 30rpx;

						text {
							color: #09BB07;
						}
					}

					.device-type {
						color: #b1b1b1;
					}
				}
			}

			.content {
				.slot-box {
					display: flex;
					justify-content: space-between;
					width: 100%;
				}
			}
		}

	}

	.aeratorInfoPanel {
		width: 100%;
		height: 800rpx;
		border-top-right-radius: 21rpx;
		border-top-left-radius: 21rpx;
		background-color: #fff;

		.panel-title {
			padding: 20rpx;
			width: 95%;
			justify-content: space-between;

			.title-btn {
				display: flex;
				align-items: center;
			}
		}

		.panel-body {
			.slot-box {
				justify-content: space-between;
				width: 100%;
			}

			.btn-group {
				position: absolute;
				bottom: 0;
				width: 100%;
				height: 100rpx;
				display: flex;

				.btn-item {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 30%;
					height: 100%;
				}
			}
		}
	}
</style>
