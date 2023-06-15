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
    prompt: `Generate a short message to enthusiastically say an outline sounds interesting and that you need some minutes to think about it. Include a reference to the idea.
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
    prompt: `Use an outline to generate exciting and marketable movie synopsis. Come up with actors that would suit the roles and include their names in parenthesis after the character names. Don't give too much of the movie away and create anticipation.
    ###
    outline: A farm boy discovers he has magical powers and is the only who who can save the world from the dark one. 
    movie synopsis:
    Young farm boy Eli (Mike Wheeler) unearths an ancient artifact, unlocking dormant magical powers. He's the prophesied "Chosen Seeder," destined to battle the returning Dark One (Benedict Cumberbatch), a corrupted hero threatening global darkness. Straddling adolescent life and elemental magic, Eli must save the world in this epic tale of discovery and sacrifice.
    ###
    outline: ${outline}
    movie synopsis: 
    `,
    max_tokens: 700
  })
  const synopsis = response.data.choices[0].text.trim()
  document.getElementById('output-text').innerText = synopsis
  // console.log(response)
  fetchTitle(synopsis)
  fetchStars(synopsis)
}

async function fetchTitle(synopsis){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Generate a catchy movie title for this synopsis: ${synopsis}`,
    max_tokens: 25,
    temperature: 0.7
  })
  const title = response.data.choices[0].text.trim()
  document.getElementById('output-title').innerText = title
  fetchImagePrompt(title, synopsis)
}

async function fetchStars(synopsis){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Extract the names in parenthesis from the synopsis.
    ###
    synopsis: Young farm boy Eli (Mike Wheeler) unearths an ancient artifact, unlocking dormant magical powers. He's the prophesied "Chosen Seeder," destined to battle the returning Dark One (Benedict Cumberbatch), a corrupted hero threatening global darkness. Straddling adolescent life and elemental magic, Eli must save the world in this epic tale of discovery and sacrifice. "Seed of Destiny," where the ordinary meets the extraordinary. 
    names: Mike Wheeler, Benedict Cumberbatch)
    ###
    synopsis: ${synopsis}
    names: 
    `,
    max_tokens: 30
  })
  document.getElementById('output-stars').innerText = response.data.choices[0].text.trim()
}

async function fetchImagePrompt(title,synopsis){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Give a short description of an image which could be used to advertise a movie based on a title and synopsis. The description should be rich in visual detail but contain no names.
    ###
    title: Love's Time Warp
    synopsis: When scientist and time traveller Wendy (Emma Watson) is sent back to the 1920s to assassinate a future dictator, she never expected to fall in love with them. As Wendy infiltrates the dictator's inner circle, she soon finds herself torn between her mission and her growing feelings for the leader (Brie Larson). With the help of a mysterious stranger from the future (Josh Brolin), Wendy must decide whether to carry out her mission or follow her heart. But the choices she makes in the 1920s will have far-reaching consequences that reverberate through the ages.
    image description: A silhouetted figure stands in the shadows of a 1920s speakeasy, her face turned away from the camera. In the background, two people are dancing in the dim light, one wearing a flapper-style dress and the other wearing a dapper suit. A semi-transparent image of war is super-imposed over the scene.
    ###
    title: zero Earth
    synopsis: When bodyguard Kob (Daniel Radcliffe) is recruited by the United Nations to save planet Earth from the sinister Simm (John Malkovich), an alien lord with a plan to take over the world, he reluctantly accepts the challenge. With the help of his loyal sidekick, a brave and resourceful hamster named Gizmo (Gaten Matarazzo), Kob embarks on a perilous mission to destroy Simm. Along the way, he discovers a newfound courage and strength as he battles Simm's merciless forces. With the fate of the world in his hands, Kob must find a way to defeat the alien lord and save the planet.
    image description: A tired and bloodied bodyguard and hamster standing atop a tall skyscraper, looking out over a vibrant cityscape, with a rainbow in the sky above them.
    ###
    title: ${title}
    synopsis: ${synopsis}
    image description:
    `,
    max_tokens: 100,
    temperature: 0.8
  })
  fetchImageUrl(response.data.choices[0].text.trim())
}

async function fetchImageUrl(imagePrompt){
  const response = await openai.createImage({
    prompt: `${imagePrompt}. There should be no text in this image`,
    n: 1,
    size: '512x512',
    response_format: 'url'
  })
  document.getElementById('output-img-container').innerHTML = `<img src="${response.data.data[0].url}">`
  setupInputContainer.innerHTML = `<button id="view-pitch-btn" class="view-pitch-btn">View Pitch</button>`
  document.getElementById('view-pitch-btn').addEventListener('click', ()=>{
    document.getElementById('setup-container').style.display = 'none'
    document.getElementById('output-container').style.display = 'flex'
    movieBossText.innerText = `This idea is so good, I'm jealous! I'm gonona' make you rich for sure! Remember, I want 10% 💰`
  })
}


// prompt: //max 1000 characters.
// n:1,
// size: '256x256',//larger sizes will cost more 
// response_format: 'url' //or b64_json. will default to url. OpenAI image urls only last one hour; if it's needed for longer, b64_json is best.
// outputImg.innerHTML = `<img src='${response.data.data[0].url}'`