<template>
	<view class="">
		<uni-nav-bar backgroundColor="#1296db" height="168rpx" fixed :border="false">
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				<text>{{pondInfo.fishPondName?pondInfo.fishPondName:'新增鱼塘'}}</text>
			</view>

		</uni-nav-bar>
		<view class="fill-box">
			<view class="fill-cover"></view>
		</view>

		<view class="mainBody">

			<uni-forms ref="form" label-position="top" :modelValue="formData" :rules="rules">
				<uni-forms-item required label="鱼塘名" name="fishPondName" labelAlign="left">
					<uni-easyinput type="text" v-model="formData.fishPondName" placeholder="请输入鱼塘名" />
				</uni-forms-item>
				<uni-forms-item label="养殖鱼种" name="fishSpecies" labelAlign="left">
					<view class="form-fishSpecies" @click="showFishSpecies">
						<text>{{formData.fishSpecies?formData.fishSpecies:'请选择养殖鱼种'}}</text>
						<uni-icons type="plusempty" size="30" color="#1296db"></uni-icons>
					</view>
				</uni-forms-item>
				<uni-forms-item label="规格(斤)" name="spec" labelAlign="left" labelWidth="200">
					<uni-easyinput v-model="formData.spec" type="text" placeholder="请输入规格" />
				</uni-forms-item>
				<uni-forms-item label="密度(尾/亩)" name="density" labelAlign="left" labelWidth="200">
					<uni-easyinput v-model="formData.density" type="text" placeholder="请输入养殖密度" />
				</uni-forms-item>
				<uni-forms-item label="鱼塘面积(亩)" name="pondArea" labelAlign="left" labelWidth="200">
					<uni-easyinput v-model="formData.pondArea" type="text" placeholder="请输入鱼塘面积" />
				</uni-forms-item>
				<uni-forms-item label="投苗日期" name="seedingDate" labelAlign="left" labelWidth="200">
					<uni-datetime-picker timestamp v-model="formData.seedingDate"></uni-datetime-picker>
				</uni-forms-item>
			</uni-forms>
			<view class="btnBox">
				<view class="btn" @click="submit(openid,pondRid)">
					保存
				</view>
			</view>
			<view v-if="pondRid" class="btnBox">
				<view class="btn removeBtn" @click="removePondPopup()">
					移除鱼塘
				</view>
			</view>

			<uni-popup ref="fishSpeciesPopup" background-color="#fff">
				<uni-data-checkbox multiple v-model="fishSpeciesPopup.value" :localdata="fishSpeciesPopup.range"
					@change="changeCheckItem"></uni-data-checkbox>
				<button type="warn" @click="showDeleteFishPopup(fishSpeciesPopup.seletedFish)">删除选中鱼种</button>
				<button type="default" style="background-color: #1296db;color: #ffffff;"
					@click="showAddOtherFishPopup">添加鱼种</button>
				<button type="primary"
					@click="changeFishSpecies(fishSpeciesPopup.seletedFish,fishSpeciesPopup.range)">确认</button>
			</uni-popup>
			<uni-popup ref="addFishPopup" type="dialog">
				<uni-popup-dialog title="添加其他鱼种" mode="input" :before-close="true" @close="closeAddFish"
					@confirm="confirmAddFish"></uni-popup-dialog>
			</uni-popup>
			<uni-popup ref="deleteFishPopup" type="dialog">
				<uni-popup-dialog title="温馨提示" content="确认删除所选鱼种？" mode="base"
					@confirm="confirmDeleteFish(fishSpeciesPopup.seletedFish,fishSpeciesPopup.range)">
				</uni-popup-dialog>
			</uni-popup>
			<uni-popup ref="removePondPopup" type="dialog">
				<uni-popup-dialog title="温馨提示" content="确认移除该鱼塘？" mode="base"
					@confirm="confirmRemovePond(pondRid)">
				</uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pondRid: null, //鱼塘信息表report_id
				pondInfo: {},
				openid: '',
				rid: '', // 用户鱼种表report_id
				fishes: [], // 用户鱼种表查询到的鱼种
				// 表单数据
				formData: {
					fishPondName: '', //鱼塘名称
					fishSpecies: '', //养殖鱼种
					spec: '', //规格
					density: '', //密度
					pondArea: '', //鱼塘面积
					seedingDate: '' //投苗日期
				},
				// 选择鱼种弹框
				fishSpeciesPopup: {
					value: [],
					range: [],
					newFish: '',
					seletedFish: ''
				},

				rules: {
					// 对name字段进行必填验证
					fishPondName: {
						rules: [{
							required: true,
							errorMessage: '请输入鱼塘名称',
						}]
					}
				}
			}
		},
		onLoad(option) {
			if (option.hasOwnProperty('pondRid')) {
				this.pondRid = option.pondRid
				this.getPondInfo(option.pondRid)
			}
			this.openid = this.$store.state.userAccount.openid
			this.getFishSpeciesData(this.openid)
		},
		methods: {
			// 获取鱼塘信息
			async getPondInfo(pondRid) {
				let queryParams = [{
					report_id: pondRid
				}]
				let {
					data
				} = await uni.$http.post('apiQuery', queryParams)
				let pondInfo = data.list.map(e => {
					return JSON.parse(e.report_data)
				})
				console.log(pondInfo);
				this.pondInfo = pondInfo[0]
				let formData = pondInfo[0].info
				if (typeof formData == 'string') {
					formData = JSON.parse(formData)
				}
				formData.fishPondName = pondInfo[0].fishPondName
				this.formData = formData
			},


			// 获取鱼种数据
			async getFishSpeciesData(openid) {
				let queryParmas = [{
					report_type: '用户鱼种表',
					conditions: {
						openID: openid
					}
				}]
				let queryRes = await uni.$http.post('apiQuery', queryParmas)
				if (queryRes.code == '2000') {
					this.rid = queryRes.data.list[0].report_id
					let fishes = JSON.parse(JSON.parse(queryRes.data.list[0].report_data).fishSpecies);
					this.fishes = fishes
					fishes = fishes.map((e, i) => {
						return {
							text: e,
							value: i
						}
					})
					this.fishSpeciesPopup.range = fishes
				} else {
					let insertParams = [{
						report_type: '用户鱼种表',
						report_data: {
							openID: openid,
							fishSpecies: []
						},
						report_time: this.$moment().format('YYYY-MM-DD HH:mm:ss')
					}]
					let insertRes = await uni.$http.post('apiInsert', insertParams)
					this.rid = insertRes.data.list[0].report_id
				}

			},
			/**
			 * 选择鱼种弹框相关
			 */
			showFishSpecies() {
				this.$refs.fishSpeciesPopup.open('bottom')
			},
			changeCheckItem(e) {
				this.fishSpeciesPopup.seletedFish = e.detail.data
			},
			// 打开添加其他鱼种输入框
			showAddOtherFishPopup() {
				this.$refs.addFishPopup.open()
			},
			// 删除选中的鱼种
			showDeleteFishPopup(seletedFish) {
				if (!seletedFish.length) {
					return
				}
				this.$refs.deleteFishPopup.open()
			},
			// 确认删除选中鱼种
			async confirmDeleteFish(seletedFish, range) {
				let selectedText = seletedFish.map(e => e.text)
				let fishes = _.difference(this.fishes, selectedText)
				let updateParams = [{
					report_id: this.rid,
					report_data: {
						fishSpecies: fishes
					}
				}]
				let updateRes = await uni.$http.post('apiUpdate', updateParams)
				this.getFishSpeciesData(this.openid)
				this.fishSpeciesPopup.value = []
			},
			// 确认添加新鱼种
			async confirmAddFish(e) {
				let newFish = e.split(/,/).map(e => e.split(/，/)).flat().filter(e => e.length > 0)
				this.fishes.push(...newFish)
				this.fishes = _.uniq(this.fishes)
				let updateParams = [{
					report_id: this.rid,
					report_data: {
						fishSpecies: this.fishes
					}
				}]
				let updateRes = await uni.$http.post('apiUpdate', updateParams)
				this.getFishSpeciesData(this.openid)
				this.$refs.addFishPopup.close()
			},
			// 取消添加新鱼种
			closeAddFish() {
				this.$refs.addFishPopup.close()
			},
			// 确认选择的鱼种
			changeFishSpecies(seletedFish, range) {
				this.formData.fishSpecies = seletedFish.map(e => e.text).toString()
				this.$refs.fishSpeciesPopup.close()
				this.fishSpeciesPopup.value = []
			},
			
			// 触发提交表单
			submit(openid, pondRid = false) {
				this.$refs.form.validate().then(async res => {
					console.log('表单数据信息：', res);
					if (pondRid) {
						let updateParams = [{
							report_id: pondRid,
							report_data: {
								fishPondName: res.fishPondName,
								info: _.omit(res, ['fishPondName']),
							}
						}]
						let updateRes = await uni.$http.post('apiUpdate', updateParams)
						if (updateRes.code == '2000') {
							uni.navigateBack({
								// url:'../home/home'
								delta: 1
							})
						}
						return
					}
					let insertParams = [{
						report_type: '鱼塘信息表',
						report_data: {
							openID: openid,
							fishPondName: res.fishPondName,
							info: _.omit(res, ['fishPondName']),
							devices: []
						},
						report_time: this.$moment().format('YYYY-MM-DD HH:mm:ss')
					}]
					let insertRes = await uni.$http.post('apiInsert', insertParams)
					if (insertRes.code == '2000') {
						uni.navigateBack({
							// url:'../home/home'
							delta: 1
						})
					}
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			},
			//移除鱼塘弹框
			removePondPopup(){
				this.$refs.removePondPopup.open()
			},
			// 确认移除鱼塘
			async confirmRemovePond(pondRid){
				let deleteParams = [pondRid]
				let deleteRes = await uni.$http.post('apiDelete',deleteParams)
				if(deleteRes.code=='2000'){
					uni.navigateBack({
						// url:'../home/home'
						delta: 1
					})
				}
			},
			back() {
				uni.navigateBack({
					// url:'../home/home'
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

	.mainBody {
		position: relative;

		.form-fishSpecies {
			display: flex;
			justify-content: space-between;
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
			background: -webkit-linear-gradient(left, #fa6c9f 0%, #ffe140 80%, #ffe140 100%);
			background: linear-gradient(to right, #fa6c9f 0%, #ffe140 80%, #ffe140 100%);
		}
		.removeBtn{
			background: #E43D33!important;
		}
	}

	/deep/ .uni-forms-item {
		padding: 0 20rpx;

		.label-text {
			font-size: 16px;
		}
	}

	/deep/ .checklist-text {
		font-size: 18px !important;
	}
</style>
