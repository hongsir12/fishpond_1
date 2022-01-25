import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		// 用户账号信息
		userAccount: {
			report_id:'', // 对应数据库中微信用户表的id
			openid: '', //唯一标识
			isAuth: false, // 是否授权
			userInfo:{}, // 头像与昵称
		}
	},
	mutations: {
		// 更新用户账号信息
		updateUserAccount(state, userAccount) {
			let data = Object.assign({},state.userAccount,userAccount)
			state.userAccount = data
		}
	}
})

export default store
