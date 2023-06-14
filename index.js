import { process } from './env'
// import {OPENAI_API_KEY} from 'dotenv'


// const process=require('./env')
import { Configuration, OpenAIApi } from 'openai'

// const {Configuration, OpenAIApi} = require('openai')

const setupInputContainer = document.getElementById('setup-input-container')
const movieBossText = document.getElementById('movie-boss-text')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

document.getElementById("send-btn").addEventListener("click", () => {
const setupTextarea = document.getElementById('setup-textarea') 
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
    prompt: `Generate a short message to enthusiastically say an outline sounds interesting and that you need some minutes to think about it.
    ###
    outline: Two dogs fall in love and move to Hawaii to learn to surf.
    message: I'll need to think about that. But your idea is amazing! I love the bit about Hawaii!
    ###
    outline: A group of corrupt lawyers try to send an innocent woman to jail.
    message: Wow that is awesome! Corrupt lawyers, huh? Give me a few moments to think!
    ###
    outline: A plane crashes in the jungle and the passengers have to walk 1000km to safety.
    message: I'll spend a few moments considering that. But I love your idea!! A disaster movie in the jungle!
    ###
    outline: ${outline}
    message: 
    `,
    max_tokens: 60 //max_tokens will default to 16. finish_reason: "length" is a bad sign, we want to see finish_reason: "stop". This will appear i console if we console.log. Limiting number of tokens will keep costs down and performance faster.
  })
    movieBossText.innerText = response.data.choices[0].text.trim()
    // console.log(response)
}

async function fetchSynopsis(outline){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Use an outline to generate exciting and marketable movie synopsis. Don't give too much of the movie away and create anticipation.
    ###
    outline: A farm boy discovers he has magical powers and is the only who who can save the world from the dark one. 
    movie synopsis:
    Young farm boy Eli (Mike Wheeler) unearths an ancient artifact, unlocking dormant magical powers. He's the prophesied "Chosen Seeder," destined to battle the returning Dark One (Benedict Cumberbatch), a corrupted hero threatening global darkness. Straddling adolescent life and elemental magic, Eli must save the world in this epic tale of discovery and sacrifice. "Seed of Destiny," where the ordinary meets the extraordinary. 
    ###
    outline: ${outline}
    movie synopsis: 
    `,
    max_tokens: 700
  })
  const synopsis = response.data.choices[0].text.trim()
  document.getElementById('output-text').innerText = synopsis
  console.log(response)
  fetchTitle(synopsis)
}

async function fetchTitle(synopsis){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Use a movie synopsis to generate an intriguing and descriptive movie title.
    ###
    movie synopsis: Young farm boy Eli (Mike Wheeler) unearths an ancient artifact, unlocking dormant magical powers. He's the prophesied "Chosen Seeder," destined to battle the returning Dark One (Benedict Cumberbatch), a corrupted hero threatening global darkness. Straddling adolescent life and elemental magic, Eli must save the world in this epic tale of discovery and sacrifice. "Seed of Destiny," where the ordinary meets the extraordinary. 
    movie title: Seed of Destiny
    ###
    movie synopsis: ${synopsis}
    movie title: 
    `,
    max_tokens: 15
  })
  document.getElementById('output-title').innerText = response.data.choices[0].text.trim()
}