import { ObjectId } from 'mongodb'

function oidsToObjectId(obj) {
  // Check if the current object is an object and not null
  if (obj !== null && typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Check if the current property is an object with an $oid property
        if (obj[key] && typeof obj[key] === 'object' && '$oid' in obj[key]) {
          obj[key] = new ObjectId(obj[key].$oid)
        } else {
          // Recursively process nested objects
          oidsToObjectId(obj[key])
        }
      }
    }
  }
  return obj
}

// Example usage:
const input = {
  _id: {
    $oid: '664c3ab40cb6683070612583',
  },
  abc: {
    tankId: {
      $oid: '664c3ab40cb6683070612583',
    },
  },
  def: 'hello',
}

oidsToObjectId(input)
console.info(input)

// {
//   _id: new ObjectId("664c3ab40cb6683070612583"),
//   abc: { tankId: new ObjectId("664c3ab40cb6683070612583") },
//   def: 'hello'
// }
