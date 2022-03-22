<template>
	<view>
		<myNavBar>用户协议</myNavBar>
		<view class="mainBody">
			<view  class="content">
				尊敬的用户，欢迎使用………
			</view>
		</view>
	</view>
</template>

<script>
	import myNavBar from '@/components/my-nav-bar/my-nav-bar.vue'
	export default {
		components:{
			myNavBar
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.mainBody{
	padding: 20rpx;
	
}
</style>
