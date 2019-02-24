export default function(tree) {

  const parse = {
    'null'     : () => null,
    'number'   : node => Number(node.textContent),
    'boolean'  : node => node.textContent === String(Boolean(node.textContent)),
    'string'   : node => String(node.textContent),
    'array'    : node => [...node.children].map(tag => consume(tag)),
    'key'      : node => String(node.textContent),
    'value'    : node => consume(node.children[0]),
    'property' : node => [node.children[0].textContent, consume(node.children[1])],
    'object'   : node => {
      const obj = {}
      Array.from(node.children).forEach(({children}) => {
        const [key, value] = children
        obj[key.textContent] = consume(value)
      })
      return obj
    }
  }

  const consume = node => parse[node.tagName.toLowerCase()](node)

  if (arguments.length > 0 && tree.tagName) {
    return consume(tree)
  } else {
    return []
  }

}