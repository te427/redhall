import { ZOOM_FACTOR } from 'constants/dimensions/game'
import { E_INIT_PLAYER } from 'events/types'
import handler from 'events/handler'

var manager
var player

function setPlayer(newPlayer) {
  player = newPlayer 
}

function CameraManager() {
  if (!manager) {
    manager = {
      ...handler,
      init(scene) {
        scene.cameras.main.setZoom(ZOOM_FACTOR)
        scene.cameras.main.startFollow(player.getSprite())
      }
    }

    manager.on(E_INIT_PLAYER, setPlayer)
  }

  return manager
}

export default CameraManager