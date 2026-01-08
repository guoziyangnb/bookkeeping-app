<template>
	<div class="custom-overlay">
		<van-overlay :show="show" duration="0.8">
			<div class="wrapper">
				<Vue3Lottie :animationData="AstronautJSON" :height="200" :width="200" />
			</div>
		</van-overlay>
	</div>
</template>

<script setup>
import { Overlay as VanOverlay } from 'vant'
import 'vant/lib/overlay/style'
import { Vue3Lottie } from 'vue3-lottie'
import AstronautJSON from '@/assets/lottie/loading.json'

const props = defineProps({
	show: {
		type: Boolean,
		required: false
	},
	customBack: {
		type: Function,
		default: null
	}
})

// const handleBack = () => {
// 	if (props.customBack) {
// 		props.customBack()
// 	} else {
// 		router.back()
// 	}
// }
</script>

<style scoped>
.wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
}
</style>
