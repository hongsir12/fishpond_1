<script>
	export default {
		data() {
			return {

			}
		},
		onLaunch() {
			// 检查登录态和授权
			this.checkLoginAndAuth()
		},
		onLoad() {
			
		},
		onShow() {
			console.log('App Show')
		},
		onHide() {
			console.log('App Hide')
		},
		methods:{
			// 检查登录态和授权
			checkLoginAndAuth(){
				console.log('AppOnLaunch');
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						if (loginRes.code) {
							uni.showLoading({
								title: '数据加载中...'
							})
							// 获取登录用户唯一标识openid
							wx.request({
								url: 'https://api.weixin.qq.com/sns/jscode2session',
								method: 'GET',
								data: {
									appid: 'wxdbb809df2ce5ca0b',
									secret: '488cc7cfb624a27222649cd04a99c02d',
									js_code: loginRes.code,
									grant_type: 'authorization_code'
								},
								success: async (res) => {
									let openID = res.data.openid
									// 将openid存入store
									this.$store.commit('updateUserAccount', {
										openid: openID
									})
									let queryParams = [{
										report_type: '微信用户表',
										conditions: {
											openID: openID
										}
									}]
									// 查询微信用户表中是否存在该用户唯一标识openid
									let queryRes = await uni.$http.post('apiQuery', queryParams)
									if (queryRes.code ==
										5000) { //没有查询到，说明为新用户，则将openid插入数据库，并跳转到授权页面
										console.log('新用户未授权');
										let insertParams = [{
											report_type: '微信用户表',
											report_data: {
												openID: openID,
												userInfo: {}
											},
											report_time: this.$moment().format(
												'YYYY-MM-DD HH:mm:ss')
										}]
										let insertRes = await uni.$http.post('apiInsert',
											insertParams)
										this.$store.commit('updateUserAccount', {
											report_id: insertRes.data.list[0].report_id
										})
										uni.hideLoading()
										uni.switchTab({
											url: '/pages/my/my'
										})
									} else { //查询到说明老用户，查看用户信息是否有值
										this.$store.commit('updateUserAccount', {
											report_id: queryRes.data.list[0].report_id
										})
										let queryResData = JSON.parse(queryRes.data.list[0]
											.report_data)
										if (_.isEmpty(JSON.parse(queryResData.userInfo))) { //用户信息为空，未授权，跳转至授权页面
											console.log('老用户未授权');
											uni.hideLoading()
											uni.reLaunch({
												url: `/pages/my/my`
											})
										} else { // 用户信息不为空
											console.log('用户已授权');
											let userInfo = JSON.parse(queryResData.userInfo)
											this.$store.commit('updateUserAccount', {
												isAuth: true
											})
											this.$store.commit('updateUserAccount', {
												userInfo: userInfo
											})
											uni.hideLoading()
										}
									}
								},
								fail: (err) => {
									console.log('获取openid失败!', err);
								}
							})
						} else {
							console.log('登录失败!' + loginRes.errMsg);
						}
				
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import './common/uni.css';
	@import '@/static/iconfont.css';
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';

	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}
	
	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
