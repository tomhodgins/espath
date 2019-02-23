export default function(tree) {

  const consume = node => render[node.tagName.toLowerCase()](node)

  const render = {
    'null'     : node => null,
    'number'   : node => Number(node.textContent),
    'boolean'  : node => node.textContent === String(Boolean(node.textContent)),
    'string'   : node => String(node.textContent),
    'array'    : node => [...node.children].map(tag => consume(tag)),
    'key'      : node => String(node.textContent),
    'value'    : node => consume(node.children[0]),
    'property' : node => [node.children[0].textContent, consume(node.children[1])],
    'object'   : node => {
      const obj = {}
      Array.from(node.children).forEach(property => {
        const [key, value] = property.children
        obj[key.textContent] = consume(value.children[0])
      })
      return obj
    }
  }

  return arguments.length && tree.tagName
    ? consume(tree)
    : []

}