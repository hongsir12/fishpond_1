<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="190rpx" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				{{pondName}}
			</view>
			<view class="fill-box"></view>
		</uni-nav-bar>
		<view class="mainBody">
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
							<view class="device-title">
								<uni-icons type="my_wifi" color="#00aa00" size="30"></uni-icons>
								<view class="device-title-text">
									<view class="device-code">
										<text>{{device.order}}</text>
										:{{device.code}}
									</view>
									<view class="device-type">
										{{device.type}}
									</view>
								</view>
							</view>

						</template>
						<view class="content">
							<uni-list>
								<uni-list-item v-if="" v-for="(aerator,i) in device.aerators" :key="i"
									:show-extra-icon="true"
									:extra-icon="{color: '#1296db',size: '33',type: 'my_oxygen'}">
									<view slot="body" class="slot-box"  @click="showAeratorInfo">
										<view class="uni-flex uni-column">
											<view>{{aerator.aeratorName}}</view>
											<view style="font-size: 28rpx;color:#7c7d7f">{{aerator.aeratorID}}</view>
										</view>
										<view class="uni-inline-item">
											<uni-icons type="smallcircle-filled" size="22" :color="aerator.isOnline?'#07C120':'#C8C9CC'"></uni-icons>
											<view>{{aerator.aeratorType}}</view>
										</view>
									</view>
								</uni-list-item>
							</uni-list>
							<button v-if="device.aerators.length>=4?false:true" type="default"
								@click="toAddAerator(device.code)">绑定增氧机</button>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>

		</view>

		<uni-popup ref="popup" type="dialog" mask-background-color="rgba(0,0,0,0)">
			<uni-popup-dialog mode="input" message="成功消息" :duration="2000" :before-close="true" title="添加设备"
				placeholder="请输入设备ID" cancelText="扫描二维码" @close="scanCode" @confirm="addDeviceConfirm">
			</uni-popup-dialog>
		</uni-popup>
		
		<uni-popup ref="aeratorInfoPopup" type="bottom">
			
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				openid: '',
				pondName: '', //鱼塘名称
				rid: '', // 鱼塘信息表的report_id
				devices: null,
			}
		},

		onLoad(option) {
			this.openid = this.$store.state.userAccount.openid
			this.pondName = option.pondName
			this.rid = option.rid
			// 获取鱼塘拥有的设备
			this.getDevicesCodeData(this.rid)
		},
		onShow() {
			this.getDevicesCodeData(this.rid)
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 显示添加设备弹框
			showAddDeviceDialog() {
				this.$refs.popup.open()
			},
			// 扫码
			scanCode() {
				uni.scanCode({
					success: function(res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
					}
				});
				this.$refs.popup.close()
			},

			// 确认添加设备
			async addDeviceConfirm(value) {
				let newDevices = this.devices
				let obj = {
					code: value,
					name: '',
					type: ''
				}
				let patt = /123+/
				if (patt.test(value)) {
					obj.type = '3KW控制器'
				} else {
					obj.type = '溶氧监测仪'
				}

				if (patt.test(value) || /321+/.test(value)) {
					newDevices.push(obj)
					this.devices = newDevices
					// 更新鱼塘信息
					let updateParam = [{
						report_id: this.rid,
						report_data: {
							devices: newDevices
						}
					}]
					let updateRes = await uni.$http.post('apiUpdate', updateParam)

					// 新增鱼塘设备
					let insertParams = [{
						report_type: '鱼塘设备表',
						report_data: {
							openID: this.openid,
							fishPondName: this.pondName,
							deviceCode: value,
							deviceName: '',
							aerator: [],
						},
						report_time: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
					}]
					let insertRes = await uni.$http.post('apiInsert', insertParams)
					console.log(insertRes);
					uni.showToast({
						title: '添加成功',
						icon: 'success'
					})
					this.getDevicesCodeData(this.rid)
					this.$refs.popup.close()
				} else {
					uni.showToast({
						title: '添加失败',
						icon: 'error'
					})
					this.$refs.popup.close()
				}
			},
			// 获取鱼塘设备信息
			async getDevicesCodeData(rid) {
				let queryParams = [{
					report_id: rid,
				}]
				let queryRes = await uni.$http.post('apiQuery', queryParams)
				console.log(queryRes);
				let devices = []
				if (typeof JSON.parse(queryRes.data.list[0].report_data).devices == 'string') {
					devices = JSON.parse(JSON.parse(queryRes.data.list[0].report_data).devices)
					devices.forEach((e, i) => {
						e.order = String.fromCharCode(i + 65)
					})
				}

				devices.forEach(async e => {
					e.aerators = await this.getDevicesAeratorData(e.code)
				})
				console.log('设备', devices);

				setTimeout(() => {
					this.devices = devices
				}, 200)



			},
			// 获取设备所含增氧机信息
			async getDevicesAeratorData(deviceCode) {
				let queryParams = [{
					report_type: '鱼塘设备表',
					conditions: {
						deviceCode: deviceCode
					}
				}]
				let queryRes = await uni.$http.post('apiQuery', queryParams)
				let aeratorIDList = []
				if (typeof JSON.parse(queryRes.data.list[0].report_data).aerator == 'string') {
					aeratorIDList = JSON.parse(JSON.parse(queryRes.data.list[0].report_data).aerator)
				}
				return aeratorIDList
			},
			showAeratorInfo(){
				this.$refs.aeratorInfoPopup.open()
			},
			// 跳转至添加增氧机页面
			toAddAerator(deviceCode) {
				uni.navigateTo({
					url: `../addAerator/addAerator?deviceCode=${deviceCode}`
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
			margin-top: 80rpx;

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
</style>
