export default function(object) {

  const consume = object => {
    const type = object === null
      ? 'Null'
      : object.constructor.name
    return parse[type]
      ? parse[type](object)
      : []
  }

  const parse = {
    'Null'    : value => ['null', {}, ['null']],
    'String'  : value => ['string', {} , [value]],
    'Number'  : value => ['number', {}, [value.toString()]],
    'Boolean' : value => ['boolean', {}, [value.toString()]],
    'Array'   : value => ['array', {}, value.map(child => consume(child))],
    'Object'  : value => ['object', {},
      Object.entries(value).map(([key, value]) =>
        ['property', {}, [
          ['key', {}, [key]],
          ['value', {}, [consume(value)]]
        ]]
      )
    ]
  }

  return arguments.length
    ? consume(object)
    : []

}