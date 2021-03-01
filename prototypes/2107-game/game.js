const people = [
  'Andrew',
  'Brennick',
  'David',
  'Jeff',
  'Jeremy',
  'Matt',
  'Misty',
  'Taimoor'
]

let prompts = [
  'a fun fact we dont know about you',
  'the first thing you ever made with a computer',
  'someone who influenced your career',
  'a favorite historical figure',
  'the last book you read cover-to-cover',
  'the movie you’ve seen the most',
  'a favorite fictional character',
  'a favorite sci-fi franchise',
  'something you think nobody else would know',
  'an embarrassing moment',
  'a bizarre experience during the pandemic'
]

const chosen = []
const prompted = []

let thePerson = people[0]
let thePrompt = prompts[0]

function renderPrompt() {
  document.getElementById('Prompt').innerHTML = `<b>${thePerson}</b>, tell us about <b>${thePrompt}</b>.`
}

function nextPerson() {
  thePerson = getRandom(people)
  renderPrompt()
}

function nextPrompt() {
  thePrompt = getRandom(prompts)
  chosen.push(thePrompt)
  prompts = prompts.filter(p => p !== thePrompt)
  renderPrompt()
}

function getRandom(ofThese) {
  return ofThese[Math.floor(Math.random() * ofThese.length)]
}

document.addEventListener('click', (e) => {
  if (e.target.id === 'Next-Person') nextPerson()
  if (e.target.id === 'Next-Prompt') nextPrompt()
})

renderPrompt()