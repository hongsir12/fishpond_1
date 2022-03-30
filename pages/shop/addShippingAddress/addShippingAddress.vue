<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="148rpx" :border="false" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				{{rid?'修改收货地址':'添加收货地址'}}
			</view>
		</uni-nav-bar>
		<view class="mainBody">
			<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top" class="form">
				<uni-forms-item required label="收货人" name="name">
					<uni-easyinput type="text" v-model="formData.name" placeholder="请输入收货人" />
				</uni-forms-item>
				<uni-forms-item required label="手机号码" name="phone">
					<uni-easyinput type="text" v-model="formData.phone" placeholder="请输入手机号码" />
				</uni-forms-item>
				<uni-forms-item required label="详细地址" name="address">
					<uni-easyinput type="text" v-model="formData.address" placeholder="请输入详细地址" />
				</uni-forms-item>
			</uni-forms>
			<view class="uni-list" style="background-color: #f5f5f5;margin-bottom: 30rpx;">
				<view class="uni-list-cell uni-list-cell-pd">
					<view class="uni-list-cell-db">设为默认地址</view>
					<switch :checked="formData.defaultAddress" @change="switchChange" />
				</view>
			</view>
			<view class="submit" @click="submit">
				保存
			</view>
			<view v-if="rid" class="submit" style="background: #E43D33;margin-top: 20rpx;" @click="remove(rid)">
				移除收货地址
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rid: null,
				// 表单数据
				formData: {
					name: '',
					phone: '',
					address: '',
					defaultAddress: false,
				},
				rules: {
					// 对name字段进行必填验证
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入收货人',
						}]
					},
					phone: {
						rules: [{
							required: true,
							errorMessage: '请输入手机号码',
						}]
					},
					address: {
						rules: [{
							required: true,
							errorMessage: '请输入收货地址',
						}]
					}
				}
			}
		},
		onLoad(option) {
			console.log(option);
			if (option.rid) {
				this.getAddressInfo(option.rid)
				this.rid = option.rid
			}
		},
		methods: {

			async getAddressInfo(rid) {
				let queryParam = [{
					report_id: rid
				}]
				let queryRes = await uni.$http.post('apiQuery', queryParam)
				if (queryRes.code == '2000') {
					let data = JSON.parse(queryRes.data.list[0].report_data);
					data.defaultAddress = JSON.parse(data.defaultAddress)
					this.formData = data
				}
			},
			async switchChange(e) {
				this.formData.defaultAddress = e.detail.value
			},
			submit() {
				this.$refs.form.validate().then(async res => {
					console.log('表单数据信息：', res);
					res.openID = this.$store.state.userAccount.openid
					res.defaultAddress = this.formData.defaultAddress
					// 如果设为默认地址
					if (res.defaultAddress) {
						console.log('res.defl',res.defaultAddress);
						// 将其他地址设为非默认地址
						let queryParams = [{
							report_type:'用户收货地址表'
						}]
						let {data} = await uni.$http.post('apiQuery',queryParams)
						let updateParams = data.list.map(item=>{
							let obj = {
								report_id:item.report_id,
								report_data:{defaultAddress:false}
							}
							return obj
						})
						console.log('111',updateParams);
						let updateRes = await uni.$http.post('apiUpdate',updateParams)
						console.log('222',updateRes);
					}
					//新增
					if (this.rid == null) {
						
						let insertParams = [{
							report_type: '用户收货地址表',
							report_data: res,
							report_time: this.$moment().format('YYYY-MM-DD HH:mm:ss')
						}]
						let insertRes = await uni.$http.post('apiInsert', insertParams)
						if (insertRes.code == '2000') {
							console.log('新增收货地址成功');
							uni.navigateBack({
								delta: 1
							})
						}
					} else { //修改
						let updateParam = [{
							report_id: this.rid,
							report_data: res
						}]
						let updateRes = await uni.$http.post('apiUpdate', updateParam)
						if (updateRes.code == '2000') {
							console.log('更新地址成功');
							uni.navigateBack({
								delta: 1
							})
						}
					}

				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			},
			async remove(rid){
				let deleteParams = [rid]
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

	.mainBody {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom:100rpx;
		.form {
			width: 96%;
		}

		.submit {
			width: 80%;
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
