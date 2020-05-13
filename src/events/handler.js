import EventManager from 'events/manager'

var events = EventManager()

const handler = {
  emit(type, data) {
    events.emit(type, data)
  },
  on(type, callback) {
    events.on(type, callback)
  },
}

export default handler 