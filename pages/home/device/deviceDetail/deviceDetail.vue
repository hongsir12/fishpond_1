<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="148rpx" :border="false" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				设备详情
			</view>
		</uni-nav-bar>
		<view class="mainBody">
			<view class="content">
				<uni-group title="设备信息" mode="card">
				    <uni-list>
						<uni-list-item>
							<view slot="body" class="slot-box">
								<view class="box-left">
									<text>设备编码</text>
								</view>
								<view class="box-right">
									<text>{{deviceInfo.code}}</text>
								</view>
							</view>
						</uni-list-item>
						<uni-list-item>
							<view slot="body" class="slot-box">
								<view class="box-left">
									<text>设备类型</text>
								</view>
								<view class="box-right">
									<text>{{deviceInfo.type}}</text>
								</view>
							</view>
						</uni-list-item>
						<uni-list-item showArrow >
							<view slot="body" class="slot-box"  @click="showPopup('修改别名','请输入别名','name')">
								<view class="box-left">
									<text>设备别名</text>
								</view>
								<view class="box-right">
									<text>{{deviceInfo.name}}</text>
								</view>
							</view>
						</uni-list-item>
						<uni-list-item>
							<view slot="body" class="slot-box">
								<view class="box-left">
									<text>质保到期日</text>
								</view>
								<view class="box-right">
									<text>{{deviceInfo.warrantyExDate}}</text>
								</view>
							</view>
						</uni-list-item>
						<uni-list-item showArrow>
							<view slot="body" class="slot-box">
								<view class="box-left">
									<text>服务到期日</text>
								</view>
								<view class="box-right">
									<text>{{deviceInfo.serviceExDate}}</text>
								</view>
							</view>
						</uni-list-item>
						<uni-list-item>
							<view slot="body" class="slot-box">
								<view class="box-left">
									<text>服务热线</text>
								</view>
								<view class="box-right">
									<text>{{deviceInfo.serviceHotline}}</text>
								</view>
							</view>
						</uni-list-item>
						<uni-list-item showArrow>
							<view slot="body" class="slot-box">
								<view class="box-left">
									<text>所在鱼塘</text>
								</view>
								<view class="box-right">
									<picker @change="changeFishPond($event,deviceRid)"
										:range="fishPondArr" range-key="name">
										<text>{{deviceInfo.fishPondName}}</text>
									</picker>								
								</view>								
							</view>
						</uni-list-item>
					</uni-list>
				</uni-group>
				
				<uni-group title="安全设置" mode="card">
				    <uni-list>
						<uni-list-item showArrow>
							<view slot="body" class="slot-box">
								<view class="box-left">
									<text>断电告警方式</text>
								</view>
								<view class="box-right">
									<picker @change="changeOutageAlarmSetting($event,deviceRid)"
										:range="outageAlarmSettingArr">
										<text>{{deviceInfo.outageAlarmSetting}}</text>
									</picker>
								</view>
							</view>
						</uni-list-item>
						<uni-list-item title="输入电压检测" note="检测设备输入电压,超过或低于设定的范围都会主动断电" :show-switch="true"
							:switchChecked="deviceInfo.inputVoltCheckStatus"
							@switchChange="switchChange($event,deviceRid,'inputVoltCheckStatus')"></uni-list-item>
					</uni-list>
				</uni-group>
			</view>
			
		</view>
		
		<uni-popup ref="settingPopup" type="dialog" mask-background-color="rgba(0,0,0,0.3)">
			<uni-popup-dialog mode="input" message="成功消息" :duration="2000" :title="popupContent.title"
				:placeholder="popupContent.placeholder" value=" " @confirm="settingConfirm($event,popupContent.prop)">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceRid:'', //设备rid
				deviceInfo:{}, //设备信息
				fishPondArr:[], //全部鱼塘对象数组
				outageAlarmSettingArr:['短信提示','电话通知','微信提示','全部方式'] ,//全部断电告警方式设置项
				// 对话弹出框内容
				popupContent: {
					title: '',
					placeholder: '',
					prop: ''
				},
			}
		},
		onLoad(option){
			this.deviceRid = option.deviceRid
			this.getFishPondName()
			this.getDeviceInfo(this.deviceRid)
		},
		methods: {
			// 获取全部鱼塘名
			async getFishPondName(){
				let queryParams = [{
					report_type:'鱼塘信息表',
				}]
				let queryRes = await uni.$http.post('apiQuery',queryParams)
				if(queryRes.code=='2000'){
					let fishPondList = queryRes.data.list.map(e=>{
						let obj = {name:JSON.parse(e.report_data).fishPondName,rid:e.report_id}
						return obj
					})
					console.log(fishPondList);
					this.fishPondArr = fishPondList
				}
			},
			// 获取设备信息
			async getDeviceInfo(deviceRid){
				let queryParams = [{
					report_id:deviceRid
				}]
				let queryRes = await uni.$http.post('apiQuery',queryParams)
				if(queryRes.code=='2000'){
					let deviceInfo = JSON.parse(queryRes.data.list[0].report_data)
					deviceInfo.inputVoltCheckStatus = typeof deviceInfo.inputVoltCheckStatus=='string'?JSON.parse(deviceInfo.inputVoltCheckStatus):deviceInfo.inputVoltCheckStatus
					this.deviceInfo = deviceInfo
					console.log(this.deviceInfo);
				}
				
			},
			async changeOutageAlarmSetting(e,deviceRid){
				let index = parseInt(e.detail.value)
				let newOutageAlarm = this.outageAlarmSettingArr[index]
				let updateParams = [{
					report_id:deviceRid,
					report_data:{outageAlarmSetting:newOutageAlarm}
				}]
				let updateRes = await uni.$http.post('apiUpdate',updateParams)
				if(updateRes.code=='2000'){
					this.deviceInfo.outageAlarmSetting = newOutageAlarm
				}
			},
			// 显示设置弹框
			showPopup(title, placeholder, prop) {
				console.log(123);
				this.popupContent.title = title
				this.popupContent.placeholder = placeholder
				this.popupContent.prop = prop
				this.$refs.settingPopup.open()
			},
			// 普通对话框弹框修改确认
			async settingConfirm(e, prop) {			
				let updateParams = [{
					report_id: this.deviceRid,
					report_data: {
						[prop]: e
					}
				}]
				let updateRes = await uni.$http.post('apiUpdate', updateParams)
				if(updateRes.code=='2000'){
					this.deviceInfo[prop] = e
				}
			},
			// 更换所在鱼塘
			async changeFishPond(e,deviceRid){
				let index = parseInt(e.detail.value)
				let newFishPondRid = this.fishPondArr[index].rid
				let newFishPondName = this.fishPondArr[index].name
				let updateParams = [{
					report_id:deviceRid,
					report_data:{fishPondRid:newFishPondRid,fishPondName:newFishPondName}
				}]
				let updateRes = await uni.$http.post('apiUpdate',updateParams)
				if(updateRes.code=='2000'){
					this.deviceInfo.fishPondName = newFishPondName
				}
			},
			// 开关状态变化
			async switchChange(e, deviceRid, prop) {
				let updateParams = [{
					report_id: deviceRid,
					report_data: {
						[prop]: e.value
					}
				}]
				let updateRes = await uni.$http.post('apiUpdate', updateParams)
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
		.content{
			.slot-box {
				display: flex;
				justify-content: space-between;
				width: 100%;
			}
		}
	}
</style>
