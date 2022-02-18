import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		// 用户账号信息
		userAccount: {
			report_id:'', // 对应数据库中微信用户表的id
			openid: '', //唯一标识
			isAuth: true, // 是否授权
			userInfo:{}, // 头像与昵称
		},
		// 用户账户信息
		userWallet:{
			balance_id:'', // 用户余额表的id
		},
		//存放本次登录后的相关操作
		// operationLog:[],
	},
	mutations: {
		// 更新用户账号信息
		updateUserAccount(state, userAccount) {
			let data = Object.assign({},state.userAccount,userAccount)
			state.userAccount = data
		},
		// 更新用户账户信息
		updateUserWallet(state,userWallet){
			let data = Object.assign({},state.userWallet,userWallet)
			state.userWallet = data
		},
		// updateOperaTionLog(state,val){
		// 	state.operationLog.push(val)
		// }
	},
	actions:{
		// updateOperaTionLog(context,val){
		// 	context.commit('updateOperaTionLog',val)
		// }
	}
})

export default store
