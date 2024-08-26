import express from 'express'
import cors from 'cors'
import pkg from 'body-parser';
import { encode, decodeGenerator, decode } from 'gpt-tokenizer/model/gpt-4o';
const { json } = pkg;
import multer from 'multer';

const port = 3000
const app = express()
const upload = multer()
app.use(cors())
app.use(json())


/* OpenAI stuff */
import { OpenAI } from 'openai'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// OpenAI chat completion
app.post('/chat', async (req, res) => {
  const messages = req.body.messages
  console.log(req.body)
  console.log(messages)
  try {
    if (messages == null) {
      throw new Error('We have a problem - no prompt was provided')
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages
    })
    const completion = response.data.choices[0].message
    console.dir(response.data.choices[0])
    return res.status(200).json({
      success: true,
      message: completion
    })
  } catch (error) {
    console.log(error.message)
    if (error.status = 429) {
      return res.status(429).json({
        success: false,
        error: error.message,
      })
    }
  }
})

/* Tokenizer */
app.post('/tokenize', async (req, res) => {
  const str = req.body.stringToTokenize
  try {
    if (str == null) {
      throw new Error('No string was provided')
    }
    const encoded = encode(str)
    const decoded = decode(encoded)
    const tokens = []

    for (const textChunk of decodeGenerator(encoded)) {
      console.log(textChunk)
      tokens.push(textChunk)
    }
    //console.log('decoded', decoded)
    /* decodeGenerator(encoded).forEach(token => {
      tokens.push(token)
    }); */
    const length = encoded.length
    console.log('Token count is ' + length)
    return res.status(200).json({
      success: true,
      tokensLength: length,
      tokens,
      encoded,
    })
  } catch (error) {
    console.log(error.message)
  }
})

/* AUDIO with Deepgram */
import { createClient } from '@deepgram/sdk'
const deepgram = createClient(process.env.DG_API)
app.post('/dg-transcription', upload.single('file'), async (req, res) => {
  try {
    const dgResponse = await deepgram.listen.prerecorded.transcribeFile(
      req.file.buffer,
      {
        smart_format: true,
        model: 'nova-2'
      }
    )
    console.log('dgResponse', dgResponse)
    res.send({ transcript: dgResponse })
  } catch (e) {
    console.log('error', e)
  }
})


////// LangChain Config //////
import { ChatOpenAI } from "@langchain/openai";
import { BufferMemory } from 'langchain/memory'
import { ConversationChain } from 'langchain/chains'

const model = new ChatOpenAI({ model: 'gpt-4o-mini' })
const memory = new BufferMemory()
const chain = new ConversationChain({ llm: model, memory: memory })
let chainNum = 0

app.post('/chain', async (req, res) => {
  console.log('Calling the chain API');

  chainNum++
  const messages = req.body.messages
  console.log(chainNum)
  if (chainNum === 1) {
    try {
      const firstResponse = await chain.call({ input: messages[0].content })
      console.log(firstResponse)
      const secondResponse = await chain.call({ input: messages[1].content })
      console.log(secondResponse)
      const thirdResponse = await chain.call({ input: messages[2].content })
      console.log(thirdResponse)
      return res.status(200).json({
        success: true,
        message: thirdResponse.response
      })
    } catch (error) {
      chainNum--
      console.error('error', error.message)
      return res.status(200).json({
        success: false,
        message: error.message
      })
    }
  } else {
    const nextResponse = await chain.call({ input: messages[2].content })
    console.log(nextResponse)
    return res.status(200).json({
      success: true,
      message: nextResponse.response
    })
  }
})

app.get('/clear-chain', async (req, res) => {
  memory.clear()
  chainNum = 0
  return res.status(200).json({
    success: true,
    message: 'Memory is clear!'
  })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
