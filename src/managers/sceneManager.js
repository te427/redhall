import { E_LOAD_SCENE, E_CHANGE_SCENE, E_OPEN_DIALOGUE, E_CLOSE_DIALOGUE, E_OPEN_INVENTORY, E_CLOSE_INVENTORY } from 'events/types'
import * as scenes from 'constants/scenes'
import handler from 'events/handler'

function startLoading() {
  scene.scene.start(scenes.SCENE_LOADING)
}

function startMainScene() {
  scene.scene.start(scenes.SCENE_GAME)
  scene.scene.launch(scenes.SCENE_WEATHER)
}

function startDialogue() {
  scene.scene.launch(scenes.SCENE_DIALOGUE)
}

function stopDialogue() {
  scene.scene.stop(scenes.SCENE_DIALOGUE)
}

function openInventory() {
  scene.scene.launch(scenes.SCENE_INVENTORY)
}

function closeInventory() {
  scene.scene.stop(scenes.SCENE_INVENTORY)
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
      [E_CLOSE_DIALOGUE]: stopDialogue,
      [E_OPEN_INVENTORY]: openInventory,
      [E_CLOSE_INVENTORY]: closeInventory,
    })
  }
  return manager
}

export default SceneManager