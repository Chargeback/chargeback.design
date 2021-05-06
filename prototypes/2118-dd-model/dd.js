let records = []
let currentRecord = 0

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
    updateRecords()
  } else {
    gapi.auth2.getAuthInstance().signIn()
    document.body.classList.remove('isSignedIn')
  }
}

function updateRecords() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1VkY8v5MAI93UOWuoHDUbs8VmZZQZA4Qd-H-22L1PZ_E',
    range: 'Dataset_New!A:DI',
  }).then(response => {
    const headers = response.result.values[0]
    response.result.values.shift() // remove header row
    response.result.values.forEach((value, index) => {
      let obj = {}
      headers.forEach((key, i) => {
        obj[key] = value[i]
      })
      records.push(obj)
    })
    render()
    /* SEE COMMENT FOR renderRow() BELOW
    const range = response.result
    const count = range.values.length
    if (count) range.values.forEach((value, index) => renderRow(value, (index + 2), (index === (count - 1))))
    else console.warn('No data found.') */
  }, response => console.error(response.result.error.message))
}

function render() {
  const r = records[currentRecord]
  const formatter = new Intl.NumberFormat('en-US', {
    currency: r.CURRENCY || 'USD',
    style: 'currency',
  })
  const prices = r.ITEM_PRICES.substring(1, r.ITEM_PRICES.length - 1).split(',')
  let items = []
  r.ITEM_NAMES.substring(1, r.ITEM_NAMES.length - 1).split(',').forEach((item, index) => {
    const line = `${item.trim()} ${formatter.format((prices[index].trim() / 100).toFixed(2))}`
    if (items.indexOf(line) === -1) items.push(line)
  })
  document.getElementById('Content').innerHTML = `<ul><li>On <b>${r.CHARGE_DATE}</b>, <b>${r.SHIPPING_CUSTOMER_FIRST_NAME_LAST_NAME}</b> used their <b>${r.EMAIL}</b> account to order the following from <b>${r.LINE_ITEM_ARTIST_OR_SELLER}</b>: <ol><li>${items.join('</li><li>')}</li></ol></li><li>They paid <b>${r.INVOICE_AMOUNT}</b> with <b>${r.CARD_BRAND}</b> (via <b>${r.CARD_TOKENIZATION_METHOD}</b>).</li><li>Later, <b>${r.DASHER_NAME}</b> used their <b>${r.VEHICLE_TYPE}</b> to get this order from <b>${r.FORMATTED_ADDRESS}</b> and <b>${r.DELIVERED_STATUS}</b> to <b>${r.SHIPPING_CUSTOMER_ADDRESS1}</b> at <b>${r.SHIPMENT_DELIVERED_TS}</b>.</li><li>The customer then disputed this as <b>${r.DISPUTE_REASON_CODE}</b> because <b>${r.FAILURE_MESSAGE}</b>.</li><li>Chargeback learned about this on <b>${r.D}</b>.</li><li>Since this customer created their account on <b>${r.CUSTOMER_ACCOUNT_CREATION_TS}</b>, they spent <b>${r.CUSTOMER_TOTAL_SPEND}</b> on <b>${r.CUSTOMER_PURCHASES}</b> other purchases.</li><li>Workability & possible actions: <b>dispute status: ${r.DISPUTE_STATUS}</b>, <b>outcome: ${r.OUTCOME_NETWORK_STATUS}</b>, and expires <b>${r.DUE_DATE}</b></li><li>refunded? <b>${r.REFUNDED}</b></li><li>avs? <b>${r.CARD_ADDRESS_ZIP_CHECK}</b></li><li>chat? ${r.CHAT_BODY}</li></ul>`
  console.log(r)
}

/* USE THIS TO MAKE SURE DATA IS CONNECTED
function renderRow(row, num, last = false) {
  const el = document.getElementById(row[0])
  if (el) {
    el.innerHTML = row[2]
  } else {
    let div = document.createElement('div')
    div.innerText = num
    document.getElementById('Not-Found').appendChild(div)
  }
  if (last) console.log('All items rendered')
} */

document.addEventListener('click', (e) => {
  if (e.target.id === 'Sign-Out') gapi.auth2.getAuthInstance().signOut()
})

document.onkeydown = function (e) {
  const max = records.length - 1
  if (e.key === 'ArrowLeft') {
    if (currentRecord > 0) currentRecord--
    else currentRecord = max
    render()
  }
  if (e.key === 'ArrowRight') {
    if (currentRecord < max) currentRecord++
    else currentRecord = 0
    render()
  }
}