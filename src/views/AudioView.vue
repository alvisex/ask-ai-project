<script setup>
import Transcriber from '../components/Transcriber.vue'
import Uploader from '../components/Uploader.vue'
import ChatWindowAudio from '../components/ChatWindowAudio.vue'
</script>

<template>
  <article class="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
    <div class="mt-4">
      <h3>Choose audio that has some speech that you would like to ask questions about.</h3>
      <section class="my-4">
        <Uploader fileType="audio/*" />
      </section>

      <Transcriber />
    </div>
    <div class="min-h-80 flex flex-col justify-between">
      <!--  <Chat-window-audio page="audio" /> -->
      <chat-window-audio page="audio" />

      <div class="flex justify-end">
        <button @click="audioChatStore.clearChat()" class="button button-secondary">Clear</button>
      </div>
    </div>
  </article>
</template>
