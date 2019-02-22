import object2microxml from './object-to-microxml.js'
import microxml2dom from './microxml-to-dom.js'
import dom2object from './dom-to-object.js'

export default function(object=[], path='//*') {

  const nodeArray = []

  const xpath = document.evaluate(
    path,
    microxml2dom(
      object2microxml(object)
    ),
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  )

  for (let i=0; i<xpath.snapshotLength; i++) {
    nodeArray.push(xpath.snapshotItem(i))
  }

  return nodeArray.map(object => dom2object(object))

}