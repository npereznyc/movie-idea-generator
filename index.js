import { process } from './env'
// import {OPENAI_API_KEY} from 'dotenv'


// const process=require('./env')
import { Configuration, OpenAIApi } from 'openai'

// const {Configuration, OpenAIApi} = require('openai')

const setupTextarea = document.getElementById('setup-textarea') 
const setupInputContainer = document.getElementById('setup-input-container')
const movieBossText = document.getElementById('movie-boss-text')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

document.getElementById("send-btn").addEventListener("click", () => {
  if (setupTextarea.value) {
    const userInput = setupTextarea.value
    setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`
    movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`
    fetchBotReply(userInput)
    fetchSynopsis(userInput)
  }
})

async function fetchBotReply(outline){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Generate a short message to enthusiastically say ${outline} sounds interesting and that you need some minutes to think about it. Mention one aspect of the sentence.`,
    max_tokens: 60 //max_tokens will default to 16. finish_reason: "length" is a bad sign, we want to see finish_reason: "stop". This will appear i console if we console.log. Limiting number of tokens will keep costs down and performance faster.
  })
    movieBossText.innerText = response.data.choices[0].text.trim()
    // console.log(response)
}

async function fetchSynopsis(outline){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Use an outline to generate an exciting and marketable movie synpsis. Don't give too much of the movie away and create aniticpation.
    ###
    outline: A big-headed daredevil fighter pilot goes back to school only to be sent on a deadly mission.
    movie synopsis:
    The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
    ###
    outline: ${outline}
    movie synopsis: 
    `,
    max_tokens: 700
  })
  document.getElementById('output-text').innerText = response.data.choices[0].text.trim()
  console.log(response)
}