import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAudioChatStore = defineStore('audioChat', () => {
  const file = ref({})
  const transcript = ref('')
  const response = ref({})
  const prompt = ref([])
  const gptResponse = ref('')
  const question = ref('')
  const isTranscribing = ref(false)
  const isLoadingGPT = ref(false)
  const clearFile = ref(false)
  const questionAnswerList = ref([])

  async function transcribeFile() {
    if (!file.value) {
      alert('Please attach a file')
    } else {
      const formData = new FormData()
      formData.append('file', file.value.value)
      console.log('formData', formData)
      const data = await fetch('http://localhost:3000/dg-transcription', {
        method: 'POST',
        body: formData
      }).then((response) => response.json())

      console.log('data', data)
      if (!data.transcript.results) { console.warn('failed'); }
      response.value = data.transcript.result
      transcript.value = data.transcript.result.results.channels[0].alternatives[0].transcript
      file.value = {}
    }
  }

  function createPrompt() {
    prompt.value = []
    const instructions = {
      role: 'system',
      content:
        'You will answer questions about the following text that has been transcribed from an audio file.'
    }
    const transcriptToAnalyze = { role: 'user', content: transcript.value }
    const chatQuestion = { role: 'user', content: question.value }
    ///create prompt array
    prompt.value.push(instructions)
    prompt.value.push(transcriptToAnalyze)
    prompt.value.push(chatQuestion)

    if (transcript.value) {
      sendPrompt()
    } else {
      alert('Please transcribe an audio file.')
      prompt.value = []
    }
  }

  async function sendPrompt() {
    isLoadingGPT.value = true

    const data = await fetch('http://localhost:3000/chain', {
      method: 'POST',
      body: JSON.stringify({
        messages: prompt.value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
    if (!data.success) { return 0 }

    isLoadingGPT.value = false
    gptResponse.value = data.message
    // array to save the conversation
    questionAnswerList.value.push({
      question: question.value,
      answer: data.message.content
    })
    question.value = ''


  }

  function clearChat() {
    file.value = {}
    prompt.value = []
    gptResponse.value = ''
    transcript.value = ''
    question.value = ''
    isTranscribing.value = false
    isLoadingGPT.value = false
    clearFile.value = true
    questionAnswerList.value = []
    // clear memory in server:
    fetch('http://localhost:3000/clear-chain').then((response) => response.json())
  }

  return {
    file,
    transcript,
    transcribeFile,
    prompt,
    createPrompt,
    sendPrompt,
    gptResponse,
    question,
    isTranscribing,
    isLoadingGPT,
    clearChat,
    clearFile,
    questionAnswerList
  }
})