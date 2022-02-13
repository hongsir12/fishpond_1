<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="148rpx" :border="false" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				增氧机设置
			</view>
			<!-- <view class="fill-box"></view> -->
		</uni-nav-bar>
		<view class="mainBody">
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text" activeColor="#1296db"></uni-segmented-control>
			        <view class="content">
			            <view v-show="current === 0">
			                选项卡1的内容
			            </view>
			            <view v-show="current === 1">
			                选项卡2的内容
			            </view>
			        </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				items: ['安全设置', '定时开关'],
				current: 0,
			}
		},
		methods: {
			onClickItem(e){
				this.current = e.currentIndex
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
</style>
