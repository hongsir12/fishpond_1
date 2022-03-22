<template>
	<view>
		<myNavBar>使用帮助</myNavBar>
		<view class="mainBody">
			<uni-collapse>
				<uni-collapse-item  title="关于添加和移除鱼塘">
					<view class="col-item">
						<view>
							<view class="title">1.新增鱼塘</view>
							<view>在“首页”中点击右下角悬浮按钮，即可进入新增鱼塘页面，补充好信息后点击“保存”即可添加一个新鱼塘。</view>
						</view>
						<view>
							<view class="title">2.移除鱼塘</view>
							<view>长按某个鱼塘框即可进如该鱼塘信息页面，可以在里面修改鱼塘信息，点击“移除鱼塘”按钮即可移除该鱼塘。</view>
						</view>
					</view>
				</uni-collapse-item>
				<uni-collapse-item   title="关于鱼塘中的控制器">
						<view class="col-item">
							<view>
								<view class="title">1.添加设备</view>
								<view>在进如某个鱼塘后，点击右上角的“添加”按钮后在弹框中输入设备ID或通过扫码来添加控制设备。</view>
							</view>
							<view>
								<view class="title">2.设置设备</view>
								<view>在添加设备时即会进入设置页可进行各项参数设置，或者在鱼塘设备页面通过长按设备栏来进入设备设置页面。</view>
							</view>
							<view>
								<view class="title">3.移除设备</view>
								<view>可通过设备设置页面下方“移除设备”按钮来移除该设备。</view>
							</view>
						</view>
				</uni-collapse-item>
				<uni-collapse-item   title="关于控制器控制的各机器设备">
						<view class="col-item">
							<view>
								<view class="title">1.绑定增氧机</view>
								<view>一个控制器最多绑定四台增氧机，在控制器下方点击“绑定”按钮即可进入增氧机绑定页面，补充好信息后点击“保存”即可新增增氧机。</view>
							</view>
							<view>
								<view class="title">2.设置增氧机</view>
								<view>点击对应的增氧机项，弹出设置框，点击设置进入具体设置页面。</view>
							</view>
						</view>
				</uni-collapse-item>
				<uni-collapse-item   title="关于定时开关机器">
						<view class="col-item">
							<view>
								<view class="title">1.定时的作用</view>
								<view>养殖过程中经常会有这种情况，每天都要在某个时段打开增氧机。因此可以设置一个定时让增氧机在这个时间段自动开启。</view>
							</view>
							<view>
								<view class="title">2.设置定时开关</view>
								<view>进入增氧机设置页面，切换到【定时开关】选项卡，点击“添加定时”按钮，在弹框中选择好机器开关时间即可。</view>
							</view>
							<view>
								<view class="title">3.移除定时开关</view>
								<view>长按定时开关组别即可切换为“选择功能”，点击选框选中组别，点击下方“确认删除”按钮即可移除该定时开关组。</view>
							</view>
						</view>
				</uni-collapse-item>
			</uni-collapse>
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
		.col-item{
			width: 96%;
			padding: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			font-size: 30rpx;
			.title{
				font-size:36rpx;
				margin: 10rpx 0;
			}
		}
	}
</style>
