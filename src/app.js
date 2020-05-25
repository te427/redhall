import * as Phaser from 'phaser'
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.min.js'

import { GAME_KEY } from 'constants/keys'

import DialogueScene from 'scenes/dialogue'
import InventoryScene from 'scenes/inventory'
import GameScene from 'scenes/game'
import LoadingScene from 'scenes/loading'
import WeatherScene from 'scenes/weather'

import CameraManager from 'managers/cameraManager'
import CellManager from 'managers/cellManager'
import CollisionManager from 'managers/collisionManager'
import ContextManager from 'managers/contextManager'
import DataManager from 'managers/dataManager'
import DebugManager from 'managers/debugManager'
import DialogueManager from 'managers/dialogueManager'
import EventManager from 'events/manager'
import InventoryManager from 'managers/inventoryManager'
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
import WeatherManager from 'managers/weatherManager'

function initConfig() {
  config = {
    key: GAME_KEY,
    type: Phaser.AUTO,
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      },
    },
    plugins: {
      scene: [
        {
          key: 'animatedTiles',
          plugin: AnimatedTiles,
          start: true,
          systemKey: 'animatedTiles',
          sceneKey: 'animatedTiles',
          mapping: 'animatedTiles'
        }
      ],

    },
    scene: [LoadingScene, GameScene, DialogueScene, InventoryScene, WeatherScene],
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
    debug: DebugManager(),
    dialogue: DialogueManager(),
    enemies: null, // TODO
    events: EventManager(),
    inventory: InventoryManager(),
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
    ui: null,
    weather: WeatherManager(),
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

