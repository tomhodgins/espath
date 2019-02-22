export default function(tree) {

  const process = ([tagName='div', attributes={}, content=['']]=[]) => {
    const node = document.createElement(tagName)
    for (let attr in attributes) {
      node.setAttribute(attr, attributes[attr])
    }
    populate(node, content)
    return node
  }

  const populate = (node, content=[]) =>
    content.forEach(child => 
      Array.isArray(child)
        ? node.appendChild(process(child))
        : node.textContent += child
    )

  return process(tree)

}