<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="148rpx" :border="false" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				增氧机设置
			</view>
			<!-- <view class="fill-box"></view> -->
		</uni-nav-bar>
		<view class="mainBody">
			<uni-segmented-control class="segmented-control" :current="current" :values="items" @clickItem="onClickItem" styleType="text"
				activeColor="#1296db"></uni-segmented-control>
			<view class="content">
				<view v-show="current == 0" style="padding-top: 72rpx;">
					<uni-list>
						<uni-list-item showArrow>
							<view slot="body" class="slot-box" @click="showPopup('修改别名','请输入别名','aeratorName')">
								<view class="box-left">
									<text>别名</text>
								</view>
								<view class="box-right">
									<text>{{setting.aeratorName}}</text>
								</view>
							</view>
						</uni-list-item>
						<uni-list-item title="监测运行电流" note="监测设备运行电流,超过或低于设定的范围都会主动提醒" :show-switch="true"
							:switchChecked="setting.ampereMonitorStatus"
							@switchChange="switchChange($event,aeratorRid,'ampereMonitorStatus')"></uni-list-item>
						<uni-list-item showArrow>
							<view slot="body" class="slot-box"
								@click="showSpecialPopup(setting.ampereRange,'ampereRange','ampereRangePopup')">
								<view class="box-left">
									<text>监测范围</text>
								</view>
								<view class="box-right">
									<text>{{setting.ampereRange.min}}~{{setting.ampereRange.max}}A</text>
								</view>
							</view>
						</uni-list-item>
						<uni-list-item title="过流停机" note="如果开启过流停机,当运行电流超过监测范围上限时,会自动关闭该增氧机" :show-switch="true"
							:switchChecked="setting.overCurrentShutdownStatus"
							@switchChange="switchChange($event,aeratorRid,'overCurrentShutdownStatus')">
						</uni-list-item>
						<uni-list-item title="停机警告" note="运行电流低于设定值时,会主动电话告警" :show-switch="true"
							:switchChecked="setting.shutdownAlarmStatus"
							@switchChange="switchChange($event,aeratorRid,'shutdownAlarmStatus')"></uni-list-item>
						<uni-list-item showArrow>
							<view slot="body" class="slot-box" @click="showPopup('修改告警值','请输入告警值','shutdownAlarmVal')">
								<view class="box-left">
									<text>告警值(A)</text>
								</view>
								<view class="box-right">
									<text>{{setting.shutdownAlarmVal}}</text>
								</view>
							</view>
						</uni-list-item>
					</uni-list>
				</view>
				<view v-show="current == 1" class="timing">
					<uni-notice-bar class="notice-bar" v-if="current == 1" text="每日定时:按照设定时间自动开关机器"></uni-notice-bar>
					<view class="imgFix" v-if="setting.timeSwitch.length==0?true:false">
						<image style="flex:1;height: 100%;" class="slot-image"
							src="https://s4.ax1x.com/2022/02/14/HybDl4.png" mode="scaleToFill"></image>
					</view>
					<view class="" style="padding-top: 153rpx;" v-if="setting.timeSwitch.length==0?false:true">
						<uni-list>
							<uni-list-item>
								<view slot="body" class="slot-box">
									<view class="box-left">
										<text>开启时间</text>
									</view>
									<view class="box-right">
										<text>关闭时间</text>
									</view>
								</view>
							</uni-list-item>
							<uni-list-item showArrow v-for="(item,i) in setting.timeSwitch" :key="i" @longpress="longtap" v-if="!delMode">
								<view slot="body" class="slot-box">
									<view class="box-left">
										<text>{{item.turnOnTime}}</text>
									</view>
									<view class="box-right">
										<text>{{item.turnOffTime}}</text>
									</view>
								</view>
							</uni-list-item>
							<checkbox-group @change="checkboxChange">
							<uni-list-item v-for="(item,i) in setting.timeSwitch" :key="i" v-if="delMode">
								<view slot="body" class="slot-box">
									<view class="box-left">
										 <label>
										    <checkbox :value="i" :checked="false" />
										 </label>
										<text>{{item.turnOnTime}}</text>
									</view>
									<view class="box-right">
										<text>{{item.turnOffTime}}</text>
									</view>
								</view>
							</uni-list-item>
							</checkbox-group>
						</uni-list>
					</view>
					<button type="primary" class="button" v-if="!delMode&&setting.timeSwitch.length<10"
						@click="showSpecialPopup(setting.timeSwitch,'timeSwitch','timeSwitchPopup')">添加定时</button>
					<view class="button" style="display: flex;"  v-if="delMode">
						<button type="primary" style="width: 50%;" @click="delMode = false">取消</button>
						<button type="warn" style="width: 50%;"
							@click="delTimeSwitch(delIndex,aeratorRid)">确认删除</button>
					</view>
					
				</view>
			</view>
		</view>

		<uni-popup ref="ampereRangePopup" type="center">
			<view class="ampereRangePanel">
				<view class="panel-title">
					<text style="color:#909399;font-size: 16px;font-weight: 500;;">修改监测范围</text>
				</view>
				<view class="panel-content">
					<uni-number-box :value="setting.ampereRange.min" step="0.1" @change="changeRange($event,'min')">
					</uni-number-box>~
					<uni-number-box :value="setting.ampereRange.max" step="0.1" @change="changeRange($event,'max')">
					</uni-number-box>
				</view>
				<view class="panel-btngroup">
					<view class="panel-btn" @click="closePopup('ampereRangePopup')">
						<text style="font-size: 16px;color:#333">取消</text>
					</view>
					<view class="panel-btn" style="border-left: #f0f0f0 solid 1px;"
						@click="confirmPopup(ampereRange,'ampereRange','ampereRangePopup')">
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

		<uni-popup ref="timeSwitchPopup" type="center">
			<view class="timeSwitchPanel">
				<view class="panel-title">
					<text style="color:#909399;font-size: 16px;font-weight: 500;;">设置设备开关时间</text>
				</view>
				<view class="panel-content">
					<view class="uni-list-cell">
						<view class="uni-list-cell-left">
							定时开启
						</view>
						<view class="uni-list-cell-db">
							<picker mode="time" :value="turnOnTime"  @change="bindTimeChange($event,'turnOnTime')">
								<view class="uni-input">{{turnOnTime}}</view>
							</picker>
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-left">
							定时关闭
						</view>
						<view class="uni-list-cell-db">
							<picker mode="time" :value="turnOffTime"  @change="bindTimeChange($event,'turnOffTime')">
								<view class="uni-input">{{turnOffTime}}</view>
							</picker>
						</view>
					</view>
				</view>
				<view class="panel-btngroup">
					<view class="panel-btn" @click="closePopup('timeSwitchPopup')">
						<text style="font-size: 16px;color:#333">取消</text>
					</view>
					<view class="panel-btn" style="border-left: #f0f0f0 solid 1px;"
						@click="confirmPopup(timeSwitch,'timeSwitch','timeSwitchPopup')">
						<text style="font-size: 16px;color: #007aff;">确定</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				items: ['安全设置', '定时开关'],
				aeratorRid: '',
				current: 0,
				setting: {},
				// 对话弹出框内容
				popupContent: {
					title: '',
					placeholder: '',
					prop: ''
				},
				ampereRange: {}, // 监测范围弹框
				timeSwitch: [], // 定时开关组
				timeSwitchObj:{},  // 单个定时开关对象
				turnOnTime: '12:00',
				turnOffTime: '12:00',
				delMode:false, // 删除定时开关模式
				delIndex:[],  // 被删除的定时开关索引
			}
		},
		onLoad(options) {
			this.aeratorRid = options.aeratorRid
			this.current = options.current
			this.getAeratorInfo(this.aeratorRid)
		},
		methods: {
			
			// 切换选项卡
			onClickItem(e) {
				this.current = e.currentIndex
			},
			// 获取增氧机信息
			async getAeratorInfo(aeratorRid) {
				let queryParams = [{
					report_id: aeratorRid
				}]
				let queryRes = await uni.$http.post('apiQuery', queryParams)
				let data = JSON.parse(queryRes.data.list[0].report_data)
				data.ampereRange = typeof data.ampereRange == 'string' ? JSON.parse(data.ampereRange) : data
					.ampereRange
				data.shutdownAlarmStatus = typeof data.shutdownAlarmStatus == 'string' ? JSON.parse(data
					.shutdownAlarmStatus) : data.shutdownAlarmStatus
				data.ampereMonitorStatus = typeof data.ampereMonitorStatus == 'string' ? JSON.parse(data
					.ampereMonitorStatus) : data.ampereMonitorStatus
				data.overCurrentShutdownStatus = typeof data.overCurrentShutdownStatus == 'string' ? JSON.parse(data
					.overCurrentShutdownStatus) : data.overCurrentShutdownStatus
				data.timeSwitch = typeof data.timeSwitch == 'string' ? JSON.parse(data
					.timeSwitch) : data.timeSwitch
				this.setting = data
				console.log(this.setting);
			},
			// 显示特殊弹框:电流监测范围弹框、定时开关设置弹框
			showSpecialPopup(val, prop, popup) {
				this[prop] = _.cloneDeep(val)
				this.$refs[popup].open()
			},
			// 更改电流范围
			changeRange(val, prop) {
				this.ampereRange[prop] = val
			},
			// 设置开关时间
			bindTimeChange(e,time) {
				let obj = {turnOnTime:this.turnOnTime,turnOffTime:this.turnOffTime}
				obj[time] = e.target.value
				this.timeSwitchObj = obj
				this[time] = e.target.value
			},
			// 特殊弹框提交确认事件：电流监测范围弹框，定时开关设置弹框
			async confirmPopup(val, prop, popup) {
				if(prop=='timeSwitch'){
					val.push(this.timeSwitchObj)
					this.setting[prop].push(this.timeSwitchObj)
					console.log(val);
				}
				let updateParams = [{
					report_id: this.aeratorRid,
					report_data: {
						[prop]: val
					}
				}]
				let updateRes = await uni.$http.post('apiUpdate', updateParams)
				this.setting[prop] = val
				this.$refs[popup].close()
			},
			// 关闭弹框
			closePopup(popup) {
				this.$refs[popup].close()
			},
			// 显示设置弹框
			showPopup(title, placeholder, prop) {
				this.popupContent.title = title
				this.popupContent.placeholder = placeholder
				this.popupContent.prop = prop
				this.$refs.settingPopup.open()
			},
			// 普通对话框弹框修改确认
			async settingConfirm(e, prop) {
				this.setting[prop] = e
				let updateParams = [{
					report_id: this.aeratorRid,
					report_data: {
						[prop]: e
					}
				}]
				let updateRes = await uni.$http.post('apiUpdate', updateParams)
				console.log(updateRes);
			},
			// 开关状态变化
			async switchChange(e, aeratorRid, prop) {
				let updateParams = [{
					report_id: aeratorRid,
					report_data: {
						[prop]: e.value
					}
				}]
				let updateRes = await uni.$http.post('apiUpdate', updateParams)
			},
			// 长按切换至删除模式
			longtap(){
				this.delMode = true
			},
			// 选中的定时开关索引
			checkboxChange(e){
				this.delIndex = e.detail.value
			},
			async delTimeSwitch(delIndex,aeratorRid){
				let arr = this.setting.timeSwitch
				delIndex = delIndex.map(e=>{
					return parseInt(e)
				})
				_.pullAt(arr,delIndex)
				let updateParams = [{
					report_id: aeratorRid,
					report_data: {
						timeSwitch: arr
					}
				}]
				let updateRes = await uni.$http.post('apiUpdate', updateParams)
				this.setting.timeSwitch = arr
				this.delMode = false
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
		.segmented-control{
			position: fixed;
			width: 100%;
			z-index: 10;
			background-color: #f5f5f5;
		}
		.content {
			margin-bottom: 90rpx;
			.slot-box {
				display: flex;
				justify-content: space-between;
				width: 100%;
			}

			.timing {
				.notice-bar{
					position: fixed;
					width: 100%;
					z-index: 10;
					margin-top: 72rpx;
				}
				.imgFix {
					display: flex;
					width: 100%;
					height: 1200rpx;
				}

				.button {
					position: fixed;
					bottom: 0;
					height: 90rpx;
					width: 100%;
				}
			}
		}
	}

	.ampereRangePanel,
	.timeSwitchPanel {
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
</style>
