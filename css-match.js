import object2microxml from './object-to-microxml.js'
import microxml2dom from './microxml-to-dom.js'
import dom2object from './dom-to-object.js'

export default function(object=[], path='*') {

  const doc = microxml2dom(object2microxml(object))

  return doc.tagName
    ? Array.from(doc.querySelectorAll(path)).map(object => dom2object(object))
    : []

}