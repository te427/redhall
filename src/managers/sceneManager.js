import { E_LOAD_SCENE, E_CHANGE_SCENE, E_OPEN_DIALOGUE, E_CLOSE_DIALOGUE } from 'events/types'
import * as scenes from 'constants/scenes'
import handler from 'events/handler'

function startLoading() {
  scene.scene.start(scenes.SCENE_LOADING)
}

function startMainScene() {
  scene.scene.start(scenes.SCENE_GAME)
  //scene.scene.launch(scenes.SCENE_UI)
}

function startDialogue() {
  scene.scene.launch(scenes.SCENE_DIALOGUE)
}

function stopDialogue() {
  scene.scene.stop(scenes.SCENE_DIALOGUE)
}

var manager
var scene

function SceneManager() {
  if (!manager) {
    manager = {
      ...handler,
      init(newScene) {
        scene = newScene
      }
    }

    manager.on({
      [E_CHANGE_SCENE]: startLoading,
      [E_LOAD_SCENE]: startMainScene,
      [E_OPEN_DIALOGUE]: startDialogue,
      [E_CLOSE_DIALOGUE]: stopDialogue
    })
  }
  return manager
}

export default SceneManager