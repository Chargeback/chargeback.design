const j = document.createElement('script')
j.src = 'https://apis.google.com/js/api.js'
j.onload = (e) => { gapi.load('client:auth2', init) }
document.body.appendChild(j)

function init() {
  gapi.client.init({
    apiKey: 'AIzaSyBvojCEp6zVjHMsPpC_riXa-FSpkYsualo',
    clientId: '774490575024-npg3pjmu4fjijnbfmpq7nd01up1nogm8.apps.googleusercontent.com',
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly'
  }).then(() => {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
    // initial sign-in state
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
  }, error => console.error(JSON.stringify(error, null, 2)))
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    document.body.classList.add('isSignedIn')
    render()
  } else {
    gapi.auth2.getAuthInstance().signIn()
    document.body.classList.remove('isSignedIn')
  }
}

function render() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1KJEtSX17VAInq0aitdcFPjQ2hvFIoh6vQ2Z8J7UWpQU',
    range: 'Sheet1!A2:D',
  }).then(response => {
    const range = response.result
    const count = range.values.length
    if (count) range.values.forEach((value, index) => renderRow(value, (index === (count - 1))))
    else console.warn('No data found.')
  }, response => console.error(response.result.error.message))
}

function renderRow(row, last = false) {
  const el = document.getElementById(row[0])
  if (el) {
    el.innerHTML = row[2]
  } else {
    let div = document.createElement('div')
    div.innerText = '#'+ row[0]
    document.getElementById('Not-Found').appendChild(div)
  }
  if (last) console.log('All items rendered')
}

document.addEventListener('click', (e) => {
  if (e.target.id === 'Sign-Out') gapi.auth2.getAuthInstance().signOut()
})