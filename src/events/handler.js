import EventManager from 'events/manager'

var events = EventManager()

const handler = {
  emit(type, data) {
    events.emit(type, data)
  },
  on(typeOrDictOrArray, callback) {
    events.on(typeOrDictOrArray, callback)
  },
}

export default handler 