import express from 'express'
import cors from 'cors'
import pkg from 'body-parser';
const { json } = pkg;

const port = 3000
const app = express()
app.use(cors())
app.use(json())


/* OpenAI stuff */
import { OpenAI } from 'openai'
/* const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}) */

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

    const response = await openai.createChatCompletion({
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
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
