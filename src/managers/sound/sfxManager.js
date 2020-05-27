import handler from "events/handler"
import { E_CHANGE_SCENE } from "events/types"

var manager
var sfx = {}

function stop(effect) {

}


function stopAll() {
  Object.values(sfx).forEach(stop)
}

function SFXManager() {
  if (!manager) {
    manager = {
    ...handler,
      init(newScene) {
        scene = newScene
      }
    }
  
    //manager.on(E_CHANGE_SCENE, )
  }

  return manager
}

export default SFXManager