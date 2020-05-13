var manager
var callbacks = {}

function register(type, callback){
  var listeners = callbacks[type]
  if (!listeners) {
    listeners = [] 
  }
  callbacks[type] = listeners.concat(callback)
} 

function EventManager() {
  if(!manager) {
    manager = {
      on(typeOrDictOrArray, callback) {
        if (Array.isArray(typeOrDictOrArray)) {
          typeOrDictOrArray.forEach(type => register(type, callback))
        } else if (typeof typeOrDictOrArray === 'object') {
          Object.keys(typeOrDictOrArray).forEach(key => register(key, typeOrDictOrArray[key]))
        } else {
          register(typeOrDictOrArray, callback)
        }
      },
      emit(type, data) {
        var listeners = callbacks[type]
        if (listeners) {
          listeners.forEach(callback => callback(type, data))
        }
      }
    }
  }
  return manager
}

export default EventManager