<template>
	<div class="container" style="margin: 2rem">
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
			<div style="font-size: 3rem; flex-wrap: nowrap; white-space: nowrap;">
				<p style="display: inline-flex; align-items: center; justify-content: center; margin: 1.2rem;">
					<span>距离</span>
					<span style="display: inline-flex" v-html="nextYearImages"></span>
					年
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
import { ref, computed, onMounted } from 'vue';

const loading = ref(true);
const enableDay = ref(true)
const enableHour = ref(true)
const enableMinute = ref(true)
const enableSecond = ref(true)
const nextYear = new Date().getFullYear() + 1;
const remainingTime = ref('');
const styleStr = `style="height: 80px;"`

const picDict:Record<string, string> = {
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
}

const numToPic = (num: string) => {
	return picDict[num]
};

const convertNumbersToImages = (timeParts: number) => {
	const days = Math.floor(remainingTime.value / (1000 * 60 * 60 * 24));
	const hours = Math.floor((remainingTime.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((remainingTime.value % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((remainingTime.value % (1000 * 60)) / 1000);

	let timeString = ``
	if (enableDay.value) timeString += `${days}天`
	if (enableHour.value) timeString += `${hours}小时`
	if (enableMinute.value) timeString += `${minutes}分`
	if (enableSecond.value) timeString += `${seconds}秒`
	return timeString.split('').map(char => {
		if (/\d/.test(char)) {
			return `<img src="${numToPic(char)}" alt="${char}" ${styleStr}>`;
		}
		return char;
	}).join('');
};

const nextYearImages = computed(() => {
	return nextYear.toString().split('').map(char => {
		return `<img src="${numToPic(char)}" alt="${char}" ${styleStr}>`;
	}).join('');
});

const formattedTime = computed(() => convertNumbersToImages(remainingTime.value));

const updateRemainingTime = () => {
	const now = new Date();
	const nextYearDate = new Date(now.getFullYear() + 1, 0, 1);
	remainingTime.value = nextYearDate - now;
};

const loadImgs= () =>
{
	const imagePromises = Object.values(picDict).map((src) => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.src = src;
			img.onload = resolve;
			img.onerror = reject;
		});
	});

	Promise.all(imagePromises)
		.then(() => {
			loading.value = false;
		})
}

onMounted(() => {
	loadImgs();
	updateRemainingTime();
	setInterval(updateRemainingTime, 1000);
});
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
}
</style>
