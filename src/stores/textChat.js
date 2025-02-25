import { ref, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { useTokenizeStore } from './tokenize'

export const useTextChatStore = defineStore('textChat', () => {

  const tokenizeStore = useTokenizeStore()
  // state properties
  const text = ref('') // Text we want OpenAI to analyze
  const question = ref('') // Question we want to ask OpenAI about the text
  const prompt = ref([]) // Prompt built as messages array
  const gptResponse = ref('') // Response from OpenAI

  // actions
  function createPrompt() {
    // prompt items
    const instructions = {
      role: 'system',
      content: 'You will answer a question about the following text.'
    }
    const textToAnalyze = { role: 'user', content: text.value }
    const chatQuestion = { role: 'user', content: question.value }

    // create prompt array
    prompt.value.push(instructions)
    prompt.value.push(textToAnalyze)
    prompt.value.push(chatQuestion)
    console.log('prompt', toRaw(prompt.value))
    tokenizeStore.checkTokens(prompt.value.map(p => p.content).toString())
  }

  function sendPrompt() {
    if (text.value.length === 0) {
      alert('You have not added any text to analyze.')
    } else {
      fetch('http://localhost:3000/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: prompt.value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('data', data)
          if (!data.success) {
            alert(data.error)
          }
          gptResponse.value = data.message.content
        }).catch(e => {
          console.log('error fetching', e)
        })
    }
  }

  function clearChat() {
    text.value = question.value = gptResponse.value = ''
    prompt.value = []
  }

  return { text, question, prompt, gptResponse, createPrompt, sendPrompt, clearChat }
})