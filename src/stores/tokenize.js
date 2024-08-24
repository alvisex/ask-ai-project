import { ref } from 'vue';
import { defineStore } from 'pinia'

const tokenLength = ref(0)
const tokens = ref('')

export const useTokenizeStore = defineStore('tokenize', () => {
  function checkTokens(val) {
    fetch('http://localhost:3000/tokenize', {
      method: 'POST',
      body: JSON.stringify({
        stringToTokenize: val
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log('tokens', tokenLength.value)
        console.log(data);

        tokenLength.value = data.tokensLength;
        tokens.value = data.tokens
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return { checkTokens, tokenLength, tokens }
})
