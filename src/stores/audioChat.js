import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAudioChatStore = defineStore('audioChat', () => {
  const file = ref({})
  const transcript = ref('')
  const response = ref({})

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

  return {
    file,
    transcript,
    transcribeFile
  }
})