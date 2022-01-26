<template>
	<view>
		<uni-nav-bar backgroundColor="#1296db" height="190rpx" fixed>
			<view class="navbar-title">我的鱼塘</view>
			<view class="fill-box"></view>
		</uni-nav-bar>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
.navbar-title{
	position: absolute;
	left: 30rpx;
	top: 90rpx;
	font-size: 40rpx;
	color: #ffffff;
}
.fill-box{
		position: absolute;
		left: 0;
		bottom: -13rpx;
		width: 100%;
		height: 42rpx;
		border-top-right-radius: 21rpx;
		border-top-left-radius: 21rpx;
		background-color: #f5f5f5;
	}
</style>
