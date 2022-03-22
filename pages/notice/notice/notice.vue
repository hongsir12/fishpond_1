<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="148rpx" :border="false" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				消息通知
			</view>
			<!-- <view class="fill-box"></view> -->
		</uni-nav-bar>
		<view class="mainBody">
			<view class="fill-box">
				<view class="fill-box-cover"></view>
			</view>
			<view class="content">
				<view class="officialNews">
					<view class="outer">
						<uni-icons type="sound" size="30"></uni-icons>
						<view class="box">
							<view style="font-size: 40rpx;">通知消息</view>
							<view style="color:#666;">重要通知</view>
						</view>
						<view class="date">
							{{lastOfficialNewsDate}}
						</view>
					</view>				
				</view>
				<view class="list">
					<uni-list :border="false" >
						 <uni-list-item direction="column" v-for="(item,i) in abnormalNotesList" :key="i">
							 <view slot="header" class="header-box">
								 {{item.pond}}
							 </view>
							 <view slot="body" class="body-box">
								 <view>{{item.aerator}}</view>
								 <view style="color: #E43D33;">{{item.fault}}</view>
							 </view>
							 <view slot="footer" class="footer-box">
								 <view style="color: #666;">{{item.time}}</view>
							 </view>
						 </uni-list-item>
					</uni-list>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lastOfficialNewsDate:'', 
				abnormalNotesList:[],
			}
		},
		onLoad() {
			this.getOfficialNews()
			this.getAbnormalNotes()
		},
		methods: {
			// 获取官方通知
			async getOfficialNews(){
				let queryParams = [{
					report_type:'官方通知表'
				}]
				let {data} = await uni.$http.post('apiQuery',queryParams)
				let lastOfficialNewsDate = this.$moment(data.list.reverse()[0].report_time).format('MM-DD')
				this.lastOfficialNewsDate = lastOfficialNewsDate
			},
			// 获取异常消息通知
			async getAbnormalNotes(){
				let queryParams = [{
					report_type:'异常通知表',
					conditions:{openID:this.$store.state.userAccount.openid}
				}]
				let queryRes = await uni.$http.post('apiQuery',queryParams)
				if(queryRes.code=='2000'){
					console.log(queryRes.data.list);
					let notesList = queryRes.data.list.map(item=>{
						let obj = JSON.parse(item.report_data)
						obj.time = item.report_time
						return obj
					})
					this.abnormalNotesList = notesList.reverse()
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

	.fill-box {
		position: fixed;
		top: 148rpx;
		left: 0;
		width: 100%;
		height: 42rpx;
		z-index:10;
		// border-top-right-radius: 21rpx;
		// border-top-left-radius: 21rpx;
		background-color: #1296db;

		.fill-box-cover {
			width: 100%;
			height: 100%;
			border-top-right-radius: 21rpx;
			border-top-left-radius: 21rpx;
			background-color: #f5f5f5;
		}
	}
	.mainBody{
		.content{
			margin-top:42rpx;
			.officialNews{
				display: flex;
				align-items: center;
				justify-content: center;
				position: fixed;
				top: 178rpx;
				left: 0;
				width: 100%;
				height: 130rpx;
				z-index:10;
				.outer{
					display: flex;
					align-items: center;
					width: 96%;
					height: 96%;
					border-radius: 18rpx;
					background: #fff;
					box-shadow:  5px 5px 10px #bebebe,
					             -5px -5px 10px #ffffff;
					.box{
						display:flex;
						margin-left: 20rpx;
						flex: 1;
						justify-content: space-around;
						flex-direction: column;
						height: 100%;
					}
					.date{
						height: 100%;
						width: 100rpx;
						line-height: 130rpx;
					}
				}
				
			}
			.list{
				margin-top: 200rpx;
				margin-bottom: 100rpx;
				.header-box{
					font-size: 38rpx;
				}
				.body-box{
					display:flex;
					justify-content: space-between;
					margin: 20rpx 0;
				}
				.footer-box{
					
				}
			}
		}
	}
</style>
