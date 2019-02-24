export default function(object) {

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

  const consume = object => {
    if (object === null) {
      return parse.Null()
    }
    if (parse[object.constructor.name]) {
      return parse[object.constructor.name](object)
    }
    return []
  }

  if (arguments.length > 0) {
    return consume(object)
  } else {
    return []
  }

}