<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="148rpx" :border="false" fixed>
			<view class="navbar-title" @click="back">
				<uni-icons type="back" color="#ffffff" size="22"></uni-icons>
				<slot></slot>
			</view>
			<!-- <view class="fill-box"></view> -->
		</uni-nav-bar>
	</view>
</template>

<script>
	export default {
		name:"my-nav-bar",
		data() {
			return {
				
			};
		},
		methods:{
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
		}
	}
</script>

<style scoped>
.navbar-title {
		position: absolute;
		left: 30rpx;
		top: 90rpx;
		font-size: 40rpx;
		color: #ffffff;
	}
</style>
