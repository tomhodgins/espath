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

  return arguments.length 
  && Array.isArray(tree)
  && tree.length === 3
  && tree[0].constructor.name === 'String'
  && tree[1].constructor.name === 'Object'
  && Array.isArray(tree[2])
    ? process(tree)
    : []

}