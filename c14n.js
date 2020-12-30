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

// learn about these at https://mattborn.com/experiment/2039/

function wrapSiblings(selector) {
  // important: must be called before centerSections()
  document.querySelectorAll(selector).forEach(el => {

    const wrapper = document.createElement('div')
    el.parentNode.insertBefore(wrapper, el)

    let siblings = []
    siblings.push(el)
    el = el.nextElementSibling
    while (el) {
      // stop group before each selector match
      if (el.matches(selector)) break
      siblings.push(el)
      el = el.nextElementSibling
    }
    siblings.forEach(sibling => wrapper.appendChild(sibling))

  })
}

function externalizeLinks() {
  // open external links in a new tab
  document.querySelectorAll('a[href^=h]').forEach(link => {
    link.classList.add('External')
    link.target = '_blank'
  })
}
