import { ZOOM_FACTOR } from 'constants/dimensions/game'
import { E_INIT_PLAYER, E_CAMERA_FOLLOW } from 'events/types'
import handler from 'events/handler'

function follow(sprite) {
  scene.cameras.main.startFollow(sprite)
}

function setPlayer(newPlayer) {
  player = newPlayer 
}

var manager
var scene
var player

function CameraManager() {
  if (!manager) {
    manager = {
      ...handler,
      init(newScene) {
        scene = newScene

        newScene.cameras.main.setZoom(ZOOM_FACTOR)
        newScene.cameras.main.startFollow(player.getSprite())
      }
    }

    manager.on({
      [E_INIT_PLAYER]: setPlayer,
      [E_CAMERA_FOLLOW]: follow,  
    })
  }

  return manager
}

export default CameraManager