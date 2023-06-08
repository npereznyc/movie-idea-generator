const apiKey = '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'
const url = 'https://api.openai.com/v1/completions'

fetch(url, {
    method: 'POST',
    headers:  {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
        'model': 'text-davinci-003',
        'prompt': 'Sound sympathetic in five words or less'
    })
}).then(response => response.json()).then(data => console.log(data))