<template>
	<view>
		<myNavBar>特约维修点</myNavBar>
		<view class="mainBody">
			<uni-card>
				<view class="uni-flex box">
					<uni-icons type="phone-filled" size="30" color="#18BC37" style="margin-right: 20rpx;"></uni-icons>
					<text>广东省茂名市电白区岭门镇夏蓝村</text>
				</view>

			</uni-card>
			<uni-card>
				<view class="uni-flex box">
					<uni-icons type="phone-filled" size="30" color="#18BC37" style="margin-right: 20rpx;"></uni-icons>
					<text>广东省肇庆市端州区前进北路3号</text>
				</view>

			</uni-card>
			<uni-card>
				<view class="uni-flex box">
					<uni-icons type="phone-filled" size="30" color="#18BC37" style="margin-right: 20rpx;"></uni-icons>
					<text>广东省中山市埠沙镇南大道7号</text>
				</view>

			</uni-card>
			<uni-card>
				<view class="uni-flex box">
					<uni-icons type="phone-filled" size="30" color="#18BC37" style="margin-right: 20rpx;"></uni-icons>
					<text>海南省海口市美兰区大致坡镇福良新村27号</text>
				</view>

			</uni-card>
			<uni-card>
				<view class="uni-flex box">
					<uni-icons type="phone-filled" size="30" color="#18BC37" style="margin-right: 20rpx;"></uni-icons>
					<text>广西壮族自治区南宁市西乡塘区安吉大道35号</text>
				</view>

			</uni-card>
			<uni-card>
				<view class="uni-flex box">
					<uni-icons type="phone-filled" size="30" color="#18BC37" style="margin-right: 20rpx;"></uni-icons>
					<text>湖南省常德市安乡县出口洲码头102号</text>
				</view>

			</uni-card>
		</view>
	</view>
</template>

<script>
	import myNavBar from '@/components/my-nav-bar/my-nav-bar.vue'
	export default {
		components: {
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
.box{
	align-items: center;
}
</style>
