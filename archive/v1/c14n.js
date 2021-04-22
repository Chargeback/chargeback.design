fetch('./README.md')
  .then(response => response.text())
  .then(text => renderMarkdown(text))

function renderMarkdown(text) {
  document.getElementById('readme').innerHTML = marked(text)
  document.dispatchEvent(new Event('MarkdownReady'))
}

document.addEventListener('MarkdownReady', (e) => {
  wrapSiblings('h1, h2')
  externalizeLinks()
})