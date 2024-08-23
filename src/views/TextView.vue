<script setup>
import { useTextChatStore } from '@/stores/textChat'

const textChatStore = useTextChatStore()

function sendQuestion() {
  textChatStore.createPrompt()
  textChatStore.sendPrompt()
}
</script>

<template>
  <div class="container">
    <textarea
      rows="20"
      v-model="textChatStore.text"
      class="block w-full rounded-md border-0 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:p-1.5 sm:text-sm sm:leading-6 text-sm my-4"
    />

    <input v-model="textChatStore.question" placeholder="Send a message" class="question-input" />

    <button
      @click="sendQuestion()"
      type="button"
      class="chat-button button group relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 text-sm font-semibold bg-[#1a1a21] text-green-500 ring-1 ring-inset ring-gray-300"
    >
      Submit
    </button>

    <div
      v-if="textChatStore.gptResponse.length > 0"
      class="block w-full rounded-md border-0 bg-green-900 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:p-4 sm:text-sm sm:leading-6 text-sm my-4"
    >
      {{ textChatStore.gptResponse }}
    </div>

    <button
      v-show="textChatStore.text"
      @click="textChatStore.clearChat()"
      class="button button-secondary"
    >
      Clear
    </button>
  </div>
</template>
