<script setup lang="ts">
import { ref } from 'vue';
import PhaserGame from './PhaserGame.vue';

const phaserRef = ref();

const currentScene = (_scene: Phaser.Scene) => {
    // Scene changed - can be used for Vue UI overlay if needed
}

</script>

<template>
    <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />
</template>
