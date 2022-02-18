import {$http} from './request-miniprogram'
import moment from 'moment'
uni.$http = $http
$http.baseUrl = 'http://localhost:8004/expand/report/'
// $http.baseUrl = 'http://192.168.61.1:8004/expand/report/' //宿舍
// $http.baseUrl = 'http://192.168.137.186:8004/expand/report/'
//请求拦截器
$http.beforeRequest = function(options) {
	let config = {}
	config.data = options.data
	config.msgid = 'string'
	config.session = 'string'
	config.source = 'string'
	config.timestamp = moment().format('YYYY-MM-DD HH:mm:ss')
	/* uni.showLoading({
		title: '数据加载中...'
	}) */
	return config
}
// 响应拦截器
$http.afterRequest = function(res) {
	// uni.hideLoading()
	return res.data
}
