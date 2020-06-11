import { E_LOG_DEBUG } from "./types"

function register(type, callback){
  if (typeof callback !== 'function') {
    throw new Error('Callback is not a function!')
  }
  var listeners = callbacks[type]
  if (!listeners) {
    listeners = [] 
  }
  callbacks[type] = listeners.concat(callback)
} 

function emitWithoutDebug(type, data){
  var listeners = callbacks[type]
  if (listeners) {
    listeners.forEach(callback => callback(data, type))
  }
}

var manager
var debug
var callbacks = {}


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
        emitWithoutDebug(E_LOG_DEBUG, { type, data })
        emitWithoutDebug(type, data)
      }
    }
  }

  return manager
}

export default EventManager