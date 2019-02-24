export default function(tree) {

  const populate = (node, content=[]) =>
  content.forEach(child => {
    if (Array.isArray(child)) {
      return node.appendChild(consume(child))
    } else {
      return node.textContent += child
    }
  })

  const consume = ([tagName='div', attributes={}, content=['']]) => {
    const node = document.createElement(tagName)
    for (const attr in attributes) {
      node.setAttribute(attr, attributes[attr])
    }
    populate(node, content)
    return node
  }

  const isMicroXML = tree =>
    Array.isArray(tree)
    && tree.length === 3
    && tree[0].constructor.name === 'String'
    && tree[1].constructor.name === 'Object'
    && Array.isArray(tree[2])

  if (arguments.length > 0 && isMicroXML(tree)) {
    return consume(tree)
  } else {
    return []
  }

}