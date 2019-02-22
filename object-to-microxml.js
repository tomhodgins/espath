export default function(object) {

  const consume = object => {
    let type = object === null
      ? 'Null'
      : object.constructor.name
    return parse[type](object)
  }

  const parse = {
    'Null'    : value => ['null', {}, ['null']],
    'Number'  : value => ['number', {}, [value.toString()]],
    'Boolean' : value => ['boolean', {}, [value.toString()]],
    'String'  : value => ['string', {} , [value]],
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

  return consume(object)

}