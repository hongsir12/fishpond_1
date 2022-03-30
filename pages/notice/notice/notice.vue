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
				<view class="officialNews" @click="open">
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
					<uni-list :border="false">
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

		<uni-popup ref="popup" type="bottom">
			<scroll-view  class="newsBox"  scroll-y="true">
				<view class="title">
					重要通知
				</view>
				<view class="content">
					各位同学，现在肇庆属于中高风险地级市，请大家严格遵守疫情防控各项规定，配合好学校各项防控措施。以下几点情况请大家注意：
					1、在肇庆市疫情防控管控期间，各位同学非必要不离校，原则上不得离开端州，现肇庆市所有人行程卡都带*号，离开肇庆到外市都要接受外地的疫情管理政策，所以非必要不要离开端州。
					2、近期所有同学暂停一切外出的志愿活动，所有去鼎湖考驾照的都暂停，等疫情过后再去考，家在肇庆或周边的周末都暂缓回家。
					3、如有特殊事项一定要离开端州区的，请务必先联系年级辅导员，辅导员同意后再走外出报备流程。
					  以上通知请各为联络员转发到各班群。
				</view>
				<view class="time">
					<text>3月11号</text>
				</view>
			</scroll-view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lastOfficialNewsDate: '',
				abnormalNotesList: [],
			}
		},
		onLoad() {
			this.getOfficialNews()
			this.getAbnormalNotes()
		},
		methods: {
			// 获取官方通知
			async getOfficialNews() {
				let queryParams = [{
					report_type: '官方通知表'
				}]
				let {
					data
				} = await uni.$http.post('apiQuery', queryParams)
				let lastOfficialNewsDate = this.$moment(data.list.reverse()[0].report_time).format('MM-DD')
				this.lastOfficialNewsDate = lastOfficialNewsDate
			},
			// 获取异常消息通知
			async getAbnormalNotes() {
				let queryParams = [{
					report_type: '异常通知表',
					conditions: {
						openID: this.$store.state.userAccount.openid
					}
				}]
				let queryRes = await uni.$http.post('apiQuery', queryParams)
				if (queryRes.code == '2000') {
					console.log(queryRes.data.list);
					let notesList = queryRes.data.list.map(item => {
						let obj = JSON.parse(item.report_data)
						obj.time = item.report_time
						return obj
					})
					this.abnormalNotesList = notesList.reverse()
				}

			},
			open() {
				this.$refs.popup.open('center')
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
		z-index: 10;
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

	.mainBody {
		.content {
			margin-top: 42rpx;

			.officialNews {
				display: flex;
				align-items: center;
				justify-content: center;
				position: fixed;
				top: 178rpx;
				left: 0;
				width: 100%;
				height: 130rpx;
				z-index: 10;

				.outer {
					display: flex;
					align-items: center;
					width: 96%;
					height: 96%;
					border-radius: 18rpx;
					background: #fff;
					box-shadow: 5px 5px 10px #bebebe,
						-5px -5px 10px #ffffff;

					.box {
						display: flex;
						margin-left: 20rpx;
						flex: 1;
						justify-content: space-around;
						flex-direction: column;
						height: 100%;
					}

					.date {
						height: 100%;
						width: 100rpx;
						line-height: 130rpx;
					}
				}

			}

			.list {
				margin-top: 200rpx;
				margin-bottom: 100rpx;

				.header-box {
					font-size: 38rpx;
				}

				.body-box {
					display: flex;
					justify-content: space-between;
					margin: 20rpx 0;
				}

				.footer-box {}
			}
		}
	}

	.newsBox {
		width: 600rpx;
		height: 600rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		background-color: #fff;
		.title{
			text-align: center;
			font-size: 40rpx;	
		}
		.time{
			display: flex;
			justify-content: flex-end;
		}
	}
</style>
