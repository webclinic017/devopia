import OpenAI from 'openai';
// import { Configuration, OpenAIApi } from "openai-edge"

// const configuration = new Configuration();
// const openai = new OpenAI({
//   apiKey: "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"}
// );
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
import { NextResponse } from 'next/server'


// const configuration = new Configuration({
//   apiKey: "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"
// })

// const openai = new OpenAIApi(configuration)

export  async function handler(req) {
  // console.log(req,res)
  if (req.method === 'POST') {
    const { message } = req.body;
    console.log(message)
    try {
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: message,
        max_tokens: 2048,
        temperature: 0.5,
      });

      NextResponse.json({ response: completion.data.choices[0].text }, { status: 200 })
      // res.status(200).json({ response: completion.data.choices[0].text });
    } catch (error) {
      console.error('Error:', error);
      NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
      // res.status(500).json({ error: 'An error occurred while fetching the data from OpenAI' });
    }
  } else {
    NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
    // res.status(405).json({ error: 'Method not allowed' });
  }
}
