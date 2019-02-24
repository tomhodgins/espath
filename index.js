import object2microxml from './object-to-microxml.js'
import microxml2dom from './microxml-to-dom.js'
import dom2object from './dom-to-object.js'

export default function(object=[], path='//*') {

  const doc = microxml2dom(object2microxml(object))

  if (arguments.length && doc.tagName) {

    const nodeArray = []
    const xpath = document.evaluate(
      path,
      doc,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    )

    for (let i=0; i<xpath.snapshotLength; i++) {
      nodeArray.push(xpath.snapshotItem(i))
    }

    return nodeArray.map(object => dom2object(object))

  } else {
    return []
  }

}