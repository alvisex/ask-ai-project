<script setup>
import { useTextChatStore } from '../stores/textChat'
import { useTokenizeStore } from '../stores/tokenize'
const textChatStore = useTextChatStore()
const tokenizeStore = useTokenizeStore()

function sendQuestion() {
  textChatStore.createPrompt()
  //textChatStore.sendPrompt()
}
const pastelColors = [
  'rgba(107,64,216,.3)',
  'rgba(104,222,122,.4)',
  'rgba(244,172,54,.4)',
  'rgba(239,65,70,.4)',
  'rgba(39,181,234,.4)'
]
</script>

<template>
  <article class="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
    <div class="mt-4">
      <h3>Enter the text you would like to ask questions about.</h3>
      <section>
        <!-- Text Area to input text for analysis -->
        <textarea
          rows="20"
          v-model="textChatStore.text"
          class="block w-full rounded-md border-0 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:p-1.5 sm:text-sm sm:leading-6 text-sm my-4"
        />
      </section>

      <section v-if="tokenizeStore.tokenLength">
        <!-- Text Area to input text for analysis -->
        <span
          v-for="(token, index) of tokenizeStore.tokens"
          :style="{ backgroundColor: pastelColors[index % pastelColors.length] }"
          :key="token[0] + index"
          class="px-1 rounded"
          >{{ token }}</span
        >

        <div class="text-xs mt-1">Token length: {{ tokenizeStore.tokenLength }}</div>
      </section>
    </div>
    <div>
      <!-- Input to add a question we want to ask about the text -->
      <div>
        <div class="flex rounded-md shadow-sm mt-4">
          <div class="relative flex flex-grow items-stretch focus-within:z-10">
            <input
              v-model="textChatStore.question"
              placeholder="Send a message"
              class="question-input"
              @keyup.enter="sendQuestion()"
            />
          </div>
          <!-- Button to send text and question to OpenAI -->
          <button
            @click="sendQuestion()"
            type="button"
            class="chat-button group relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 text-sm font-semibold bg-[#1a1a21] text-green-500 ring-1 ring-inset ring-gray-300"
          >
            <span class="text-green-100 group-hover:bg-[#42b983]">submit</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 text-green-400 hover:fill-[#42b983] group-hover:bg-[#42b983]"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
      <!-- AI Displayed Response -->
      <div
        v-if="textChatStore.gptResponse.length > 0"
        class="block w-full rounded-md border-0 bg-green-900 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:p-4 sm:text-sm sm:leading-6 text-sm my-4"
      >
        {{ textChatStore.gptResponse }}
      </div>
    </div>
    <!-- Token Count goes here -->
    <div></div>
  </article>
  <!-- Clear button to reset all the data -->
  <div class="flex justify-end">
    <button @click="textChatStore.clearChat()" class="button button-secondary">Clear</button>
  </div>
</template>
