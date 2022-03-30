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
						<uni-list-item showArrow>
							<view slot="body" class="slot-box"
								@click="showSpecialPopup(voltRange,'voltRange','voltRangePopup')">
								<view class="box-left">
									<text>电压监测范围</text>
								</view>
								<view class="box-right">
									<text>{{deviceInfo.voltRange.min}}~{{deviceInfo.voltRange.max}}V</text>
								</view>
							</view>
						</uni-list-item>
						<uni-list-item title="溶解氧监测" note="监测溶解氧值,低于5mg/L时推送报警" :show-switch="true"
							:switchChecked="deviceInfo.dissolvedOxygenCheckStatus"
							@switchChange="switchChange($event,deviceRid,'dissolvedOxygenCheckStatus')"></uni-list-item>
					</uni-list>
				</uni-group>
				<qiun-title-bar title="溶解氧值" />
				<view class="charts-box">
					<qiun-data-charts type="demotype" canvasId="oxygenDataId"
						:opts="{enableScroll:true,dataLabel:false,xAxis:{scrollShow:true,itemCount:5,disableGrid:true},yAxis:{max:8,min:4}}"
						:chartData="oxygenData" :ontouch="true" :canvas2d="false" />
				</view>
				<qiun-title-bar title="水温值" />
				<view class="charts-box">
					<qiun-data-charts type="demotype" canvasId="tempDataId"
						:opts="{enableScroll:true,dataLabel:false,xAxis:{scrollShow:true,itemCount:5,disableGrid:true},yAxis:{max:27,min:17}}"
						:chartData="tempData" :ontouch="true" :canvas2d="false" />
				</view>
				<view class="btnBox">
					<view class="btn" @click="removeDevice">
						移除该设备
					</view>
				</view>
			</view>
			
		</view>
		
		<uni-popup ref="removePopup" type="dialog">
		    <uni-popup-dialog mode="base" title="温馨提示" content="确认移除该设备？" :duration="2000" @confirm="confirmRemoveDevice(deviceRid)"></uni-popup-dialog>
		</uni-popup>
		
		<uni-popup ref="voltRangePopup" type="center">
			<view class="voltRangePanel">
				<view class="panel-title">
					<text style="color:#909399;font-size: 16px;font-weight: 500;;">修改监测范围</text>
				</view>
				<view class="panel-content">
					<uni-number-box :value="deviceInfo.voltRange.min" step="1" @change="changeRange($event,'min')">
					</uni-number-box>~
					<uni-number-box :value="deviceInfo.voltRange.max" step="1" @change="changeRange($event,'max')">
					</uni-number-box>
				</view>
				<view class="panel-btngroup">
					<view class="panel-btn" @click="closePopup('voltRangePopup')">
						<text style="font-size: 16px;color:#333">取消</text>
					</view>
					<view class="panel-btn" style="border-left: #f0f0f0 solid 1px;"
						@click="confirmPopup(voltRange,'voltRange','voltRangePopup')">
						<text style="font-size: 16px;color: #007aff;">确定</text>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="settingPopup" type="dialog" mask-background-color="rgba(0,0,0,0.3)">
			<uni-popup-dialog mode="input" message="成功消息" :duration="2000" :title="popupContent.title"
				:placeholder="popupContent.placeholder" value=" " @confirm="settingConfirm($event,popupContent.prop)">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	export default {
		data() {
			return {
				deviceRid:'', //设备rid
				deviceInfo:{}, //设备信息
				fishPondArr:[], //全部鱼塘对象数组
				outageAlarmSettingArr:['短信提示','电话通知','微信提示','全部方式'] ,//全部断电告警方式设置项
				voltRange:{min:'',max:''}, //电压范围
				// 溶解氧
				oxygenData: {
					"categories": ["1时", "2时", "3时", "4时", "5时", "6时", "7时", "8时", "9时", "10时", "11时", "12时", "13时", "14时", "15时", "16时",
						"17时", "18时", "19时", "20时", "21时", "22时", "23时", "24时"
					],
					"series": [{
							"name": "溶氧值(mg/L)",
							"data": [5.3, 5.3, 5.5, 5.4, 5.2, 5.2, 5.1, 5.1, 5.3, 5.3, 5.6, 5.7, 5.7,5.4, 5.5, 5.5,
								5.7,5.7, 6.1,6.0, 5.8, 6.2, 5.7, 5.3]
						}]
				},
				// 水温
				tempData: {
					"categories": ["1时", "2时", "3时", "4时", "5时", "6时", "7时", "8时", "9时", "10时", "11时", "12时", "13时", "14时", "15时", "16时",
						"17时", "18时", "19时", "20时", "21时", "22时", "23时", "24时"
					],
					"series": [{
							"name": "水温(℃)",
							"data": [18.2, 18.2, 18.3, 18.3, 18.5, 18.9, 19.1, 19.2, 20.3, 20.7, 20.9, 21.3, 21.6,21.9, 22.1, 21.4,
								21.1,20.4, 20.4,19.5, 19.2, 19.2, 18.9, 18.6]
						}]
				},
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
					// console.log(fishPondList);
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
					deviceInfo.voltRange = typeof deviceInfo.voltRange=='string'?JSON.parse(deviceInfo.voltRange):deviceInfo.voltRange
					this.deviceInfo = deviceInfo
					this.voltRange = deviceInfo.voltRange
					console.log(this.deviceInfo);
				}
				
			},
			// 修改断电告警方式
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
			
			// 显示特殊弹框:电压监测范围弹框
			showSpecialPopup(val, prop, popup) {
				this[prop] = _.cloneDeep(val)
				this.$refs[popup].open()
			},
			// 更改电压范围
			changeRange(val, prop) {
				this.voltRange[prop] = val
			},
			// 特殊弹框提交确认事件：电压监测范围弹框
			async confirmPopup(val, prop, popup) {
				let updateParams = [{
					report_id: this.deviceRid,
					report_data: {
						[prop]: val
					}
				}]
				let updateRes = await uni.$http.post('apiUpdate', updateParams)
				if(updateRes.code=='2000'){
					console.log(val)
					this[prop] = val
					this.deviceInfo[prop] = val
					this.$refs[popup].close()
				}
				
				
			},
			// 关闭弹框
			closePopup(popup) {
				this.$refs[popup].close()
			},
			
			removeDevice(){
				this.$refs.removePopup.open()
			},
			async confirmRemoveDevice(deviceRid){
				let deleteParams = [deviceRid]
				let deleteRes = await uni.$http.post('apiDelete',deleteParams)
				if(deleteRes.code=='2000'){
					uni.navigateBack({
						delta: 1
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
		.content{
			.slot-box {
				display: flex;
				justify-content: space-between;
				width: 100%;
			}
			.charts-box {
				width: 100%;
				height: 300px;
			}
		}
	}
	
	.voltRangePanel{
		width: 600rpx;
		border-radius: 11px;
		background-color: #fff;
	
		.panel-title {
			display: flex;
			flex-direction: row;
			justify-content: center;
			padding-top: 50rpx;
		}
	
		.panel-content {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			padding: 40rpx;
		}
	
		.panel-btngroup {
			display: flex;
			flex-direction: row;
			border-top-color: #f5f5f5;
			border-top-style: solid;
			border-top-width: 1px;
	
			.panel-btn {
				display: flex;
				flex: 1;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				height: 90rpx;
			}
		}
	}
	.btnBox{
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
