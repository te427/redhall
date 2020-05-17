import * as Phaser from 'phaser'

import { GAME_KEY, REAL_WIDTH, REAL_HEIGHT, ZOOM_FACTOR } from 'constants/cfg'

import GameScene from 'scenes/game'
import LoadingScene from 'scenes/loading'
import DialogueScene from 'scenes/dialogue'

import CameraManager from 'managers/cameraManager'
import CellManager from 'managers/cellManager'
import CollisionManager from 'managers/collisionManager'
import ContextManager from 'managers/contextManager'
import DataManager from 'managers/dataManager'
import DialogueManager from 'managers/dialogueManager'
import EventManager from 'events/manager'
import ItemManager from 'managers/itemManager'
import KeyManager from 'managers/keyManager'
import LoadManager from 'managers/loadManager'
import ModeManager from 'managers/modeManager'
import MusicManager from 'managers/musicManager'
import NPCManager from 'managers/npcManager'
import PlayerManager from 'managers/playerManager'
import SceneManager from 'managers/sceneManager'
import SFXManager from 'managers/sfxManager'
import StateManager from 'managers/stateManager'

function initConfig() {
  config = {
    key: GAME_KEY,
    type: Phaser.AUTO,
    //width: REAL_WIDTH,
    //height: REAL_HEIGHT,
    //zoom: ZOOM_FACTOR,
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        //debug: true
      },
    },
    scene: [LoadingScene, GameScene, DialogueScene],
  }
}

function initManagers(game) {
  managers = {
    ai: null,
    camera: CameraManager(),
    cell: CellManager(),
    collision: CollisionManager(),
    context: ContextManager(),
    data: DataManager(),
    dialogue: DialogueManager(),
    enemies: null, // TODO
    events: EventManager(),
    inventory: null,
    items: ItemManager(),
    keys: KeyManager(game),
    loading: LoadManager(),
    menus: null, // TODO
    modes: ModeManager(),
    music: MusicManager(),
    npcs: NPCManager(),
    player: PlayerManager(),
    scene: SceneManager(),
    sfx: SFXManager(),
    state: StateManager(),
    ui: null
  }
}

var config
var managers

function Redhall() {
  initConfig()

  var game = new Phaser.Game(config)
  initManagers(game)

  return game
}

const redhall = Redhall()

