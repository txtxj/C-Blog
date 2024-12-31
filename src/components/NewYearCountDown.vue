<template>
	<div ref="topContainer" class="container" style="margin: 2rem 0;">
		<n-spin v-if="loading" size="large" />
		<div class="container" v-else>
			<n-space item-style="display: flex;" align="center">
				<n-checkbox v-model:checked="enableDay" data-clickable>
					天
				</n-checkbox>
				<n-checkbox v-model:checked="enableHour" data-clickable>
					时
				</n-checkbox>
				<n-checkbox v-model:checked="enableMinute" data-clickable>
					分
				</n-checkbox>
				<n-checkbox v-model:checked="enableSecond" data-clickable>
					秒
				</n-checkbox>
			</n-space>
			<div :style="{'font-size': `${fontWidth}px`, 'flex-wrap': 'nowrap', 'white-space': 'nowrap'}">
				<p style="display: flex; align-items: center; justify-content: center; margin: 1.2rem;">
					<span>距离</span>
					<span style="display: inline-flex" v-html="nextYear"></span>
					<span>年</span>
				</p>
				<p style="display: flex; align-items: center; justify-content: center; margin: 1.2rem;">
					<span style="display: inline-flex;">还有</span>
					<span style="display: inline-flex; align-items: center; justify-content: center;" v-html="formattedTime"></span>
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';

const loading = ref(true);
const enableDay = ref(true)
const enableHour = ref(true)
const enableMinute = ref(true)
const enableSecond = ref(true)
const nextYearTime = ref<any>();
const remainingTime = ref<any>();

const picDict: Record<string, string> = {
	'0': 'https://s2.loli.net/2024/12/31/RDJWBXytkGFAn69.png',
	'1': 'https://s2.loli.net/2024/12/31/QDIBueyWO6U2qV3.png',
	'2': 'https://s2.loli.net/2024/12/31/VouDZlOqyP8bNa4.png',
	'3': 'https://s2.loli.net/2024/12/31/hsgFxYcCbw3fZd1.png',
	'4': 'https://s2.loli.net/2024/12/31/RJ2kesbSOwZnuEP.png',
	'5': 'https://s2.loli.net/2024/12/31/Cctak1B8y7fenpG.png',
	'6': 'https://s2.loli.net/2024/12/31/kwgyBaGTs5nh8vr.png',
	'7': 'https://s2.loli.net/2024/12/31/P5q4GAcjeitQsZS.png',
	'8': 'https://s2.loli.net/2024/12/31/vQfL9TWhisqZ6o5.png',
	'9': 'https://s2.loli.net/2024/12/31/QUFA9Tpk2ldIXBE.png',
};

const base64Dic: Record<string, string> = {};

const numToPic = (num: string) => {
	return base64Dic[num];
};

const charToLabel = (char: string) => {
	if (!/\d/.test(char)) {
	}
	const src = numToPic(char);
	if (src === undefined || src === null || src === '') {
		return char;
	}
	return `<img src="${src}" alt="${char}" style="max-height: ${fontWidth.value}px;">`;
}

const nextYear = computed(() => {
	remainingTime.value;
	return nextYearTime.value.toString().split('').map(charToLabel).join('');
});

const formattedTime = computed(() => {
	const days = Math.floor(remainingTime.value / (1000 * 60 * 60 * 24));
	const hours = Math.floor((remainingTime.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((remainingTime.value % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((remainingTime.value % (1000 * 60)) / 1000);

	let timeString = ``;
	if (enableDay.value) timeString += `${days}天`;
	if (enableHour.value) timeString += `${hours}小时`;
	if (enableMinute.value) timeString += `${minutes}分`;
	if (enableSecond.value) timeString += `${seconds}秒`;
	return timeString.split('').map(charToLabel).join('');
});

const updateRemainingTime = () => {
	const now = new Date() as any;
	const nextYearDate = new Date(now.getFullYear() + 1, 0, 1) as any;
	nextYearTime.value = new Date().getFullYear() + 1;
	remainingTime.value = nextYearDate - now;
};

const loadImages = () => {
	const loadImageToBase64 = async (src: string) => {
		const response = await fetch(src);
		const blob = await response.blob();
		const reader = new FileReader();
		return new Promise<string>((resolve, reject) => {
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	};

	const imagePromises = Object.entries(picDict).map(async ([key, src]) => {
		base64Dic[key] = await loadImageToBase64(src);
	});

	Promise.all(imagePromises)
		.then(() => {
			loading.value = false;
		})
		.catch(() => {
			loading.value = false;
		})
};

const topContainer = ref<any>();
const fontWidth = computed(() => {
	return topContainer.value.offsetWidth / 16;
})

onMounted(() => {
	loadImages();
	updateRemainingTime();
	setInterval(updateRemainingTime, 1000);
});

watch(loading, () => nextTick(() => {
	useDataClickable('.n-checkbox')
}))
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-width: 35vh;
	max-height: 75vh;
	text-align: center;
	font-family: "Lato", Helvetica, "Roboto", Arial, sans-serif;
}
</style>
