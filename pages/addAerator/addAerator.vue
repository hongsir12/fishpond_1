<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="168rpx" fixed :border="false">
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				<text>绑定增氧机</text>
			</view>

		</uni-nav-bar>
		<view class="fill-box">
			<view class="fill-cover"></view>
		</view>
		<view class="mainBody">
			<uni-forms ref="form" label-position="top" :modelValue="formData" :rules="rules">
				<uni-forms-item required label="增氧机ID" name="aeratorID" labelAlign="left" labelWidth="200">
					<picker @change="changeType($event,'aeratorIDIndex','aeratorID','aeratorIDArr')"
						:range="aeratorIDArr">
						<uni-easyinput type="text" v-model="formData.aeratorID" placeholder="请选择增氧机ID" />
					</picker>
				</uni-forms-item>
				<uni-forms-item required="" label="别名" name="aeratorName" labelAlign="left">
					<uni-easyinput type="text" v-model="formData.aeratorName" placeholder="请输入增氧机别名" />
				</uni-forms-item>
				<uni-forms-item required label="类型" name="aeratorType" labelAlign="left" labelWidth="200">
					<picker @change="changeType($event,'aeratorTypeIndex','aeratorType','aeratorTypeArr')"
						:range="aeratorTypeArr">
						<uni-easyinput type="text" v-model="formData.aeratorType" placeholder="请选择增氧机类型" />
					</picker>
				</uni-forms-item>
				<uni-forms-item label="位置" name="aeratorPosition" labelAlign="left">
					<uni-easyinput type="text" v-model="formData.aeratorPosition" placeholder="请输入增氧机位置" />
				</uni-forms-item>
				<uni-forms-item required label="功率" name="aeratorPower" labelAlign="left" labelWidth="200">
					<picker @change="changeType($event,'aeratorPowerIndex','aeratorPower','aeratorPowerArr')"
						:range="aeratorPowerArr">
						<uni-easyinput type="text" v-model="formData.aeratorPower" placeholder="当前可选范围0.5~3千瓦" />
					</picker>
				</uni-forms-item>
				<uni-forms-item required label="额定电压" name="ratedVoltage" labelAlign="left" labelWidth="200">
					<picker @change="changeType($event,'ratedVoltageIndex','ratedVoltage','ratedVoltageArr')"
						:range="ratedVoltageArr">
						<uni-easyinput type="text" v-model="formData.ratedVoltage" placeholder="请选择额定电压" />
					</picker>
				</uni-forms-item>
			</uni-forms>
			<button @click="submit(deviceRid)">Submit</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceRid: '', // 当前设备report_id
				deviceCode: '',
				formData: {
					aeratorID: '', //增氧机输出ID
					aeratorType: '', //增氧机类型
					aeratorName: '', //增氧机别名
					aeratorPosition: '', //增氧机位置
					aeratorPower: '', //增氧机额定功率
					ratedVoltage: '', //增氧机额定电压
				},
				rules: {
					aeratorID: {
						rules: [{
							required: true,
							errorMessage: '请选择增氧机',
						}]
					},
					aeratorName: {
						rules: [{
							required: true,
							errorMessage: '请输入增氧机别名',
						}]
					},
					aeratorType: {
						rules: [{
							required: true,
							errorMessage: '请选择增氧机类型',
						}]
					},
					aeratorPower: {
						rules: [{
							required: true,
							errorMessage: '请选择增氧机功率',
						}]
					},
					ratedVoltage: {
						rules: [{
							required: true,
							errorMessage: '请选择额定电压',
						}]
					},
				},
				aeratorIDArr: [],
				aeratorIDIndex: 0,
				aeratorTypeArr: ['直流式', '涡轮式', '涌浪式', '水车式', '充气式', '变频式', '其他类型'],
				aeratorTypeIndex: 0,
				aeratorPowerArr: ['0.5KW', '1KW', '1.5KW', '2KW', '2.5KW', '3KW'],
				aeratorPowerIndex: 0,
				ratedVoltageArr: ['220V', '380V'],
				ratedVoltageIndex: 0,

				queryAeratorIDArr: [],
			}
		},
		onLoad(option) {
			this.deviceCode = option.deviceCode
			this.deviceRid = option.deviceRid
			this.getDeviceAeratorArrLength(this.deviceRid)

		},
		methods: {
			generateAeratorID(length) {
				for (let i = 0; i < 4 - length; i++) {
					let num = Math.round(Math.random() * (999 - 100) + 100)
					this.aeratorIDArr.push(`ID${num}`)
				}
			},
			// 获取当前设备全部增氧机信息
			async getDeviceAeratorArrLength(deviceRid) {
				let queryParams = [{
					report_type: '增氧机信息表',
					conditions:{deviceRid:deviceRid}
				}]
				let queryRes = await uni.$http.post('apiQuery', queryParams)
				if(queryRes.code=='2000'){
					this.generateAeratorID(queryRes.data.total)
				}else{
					this.generateAeratorID(0)
				}
				
			},
			// 下拉框选择类型
			changeType(e, typeIndex, formItem, arr) {
				this[typeIndex] = e.target.value
				this.formData[formItem] = this[arr][e.target.value]
			},
			// 触发提交表单
			submit(deviceRid) {
				this.$refs.form.validate().then(async res => {
					console.log('表单数据信息：', res);
					res.deviceRid = deviceRid //增氧机对应设备
					res.openID = this.$store.state.userAccount.openid
					res.isOnline = false //是否在线
					res.ampereRange = {  // 电流范围
						min: 0,
						max: 0
					}
					res.ampereMonitorStatus = false //电流监测状态
					res.overCurrentShutdownStatus = false //过流停机开关
					res.shutdownAlarmStatus = false //停机告警开关
					// 插入新增增氧机信息
					let insertParams = [{
						report_type: '增氧机信息表',
						report_data: res,
						report_time: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
					}]
					let insertRes = await uni.$http.post('apiInsert', insertParams)
					if (insertRes.code == '2000') {
						
						uni.navigateBack({
							delta: 1
						})
					}
					



				}).catch(err => {
					console.log('表单错误信息：', err);
				})
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
		display: flex;
		align-items: center;
		width: 100%;
		height: 70rpx;
		position: absolute;
		left: 15rpx;
		top: 90rpx;
		font-size: 40rpx;
		color: #ffffff;
	}

	.fill-box {
		position: fixed;
		left: 0;
		top: 168rpx;
		width: 100%;
		height: 42rpx;
		background-color: #1296db;

		.fill-cover {
			position: absolute;
			left: 0;
			width: 100%;
			height: 42rpx;
			z-index: 10;
			background-color: #f5f5f5;
			border-top-left-radius: 21rpx;
			border-top-right-radius: 21rpx;
		}
	}

	/deep/ .uni-forms-item {
		padding: 0 20rpx;

		.label-text {
			font-size: 16px;
		}
	}
</style>
