/*
 * May God bless this creation.
 *
 * May this work honour Him, and in honouring His name bring Him glory.
 * 
 * May He guide this work, and may His song echo throughout it.
 * 
 * May He grant me the persistence to build it, the diligence to form it with care,
 * and the inspiration to make it beautiful.
 * 
 * Amen.
 */

import * as Phaser from 'phaser'
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.min.js'

import { GAME_KEY } from 'constants/keys'

import DialogueScene from 'scenes/dialogue'
import InventoryScene from 'scenes/inventory'
import GameScene from 'scenes/game'
import LoadingScene from 'scenes/loading'
import WeatherScene from 'scenes/weather'
import CombatScene from 'scenes/combat'
import UiScene from 'scenes/ui'

import CameraManager from 'managers/game/cameraManager'
import CellManager from 'managers/cell/cellManager'
import CollisionManager from 'managers/game/collisionManager'
import CombatManager from 'managers/combat/combatManager'
import ContextManager from 'managers/game/contextManager'
import DataManager from 'managers/data/dataManager'
import DebugManager from 'managers/debug/debugManager'
import DialogueManager from 'managers/menu/dialogueManager'
import EnemyManager from 'managers/sprite/enemyManager'
import EventManager from 'events/manager'
import InventoryManager from 'managers/menu/inventoryManager'
import ItemManager from 'managers/cell/itemManager'
import KeyManager from 'managers/game/keyManager'
import LoadManager from 'managers/data/loadManager'
import MusicManager from 'managers/sound/musicManager'
import NotificationManager from 'managers/ui/notificationManager'
import NPCManager from 'managers/sprite/npcManager'
import PlayerManager from 'managers/sprite/playerManager'
import SceneManager from 'managers/game/sceneManager'
import SFXManager from 'managers/sound/sfxManager'
import StateManager from 'managers/data/stateManager'
import WeatherManager from 'managers/cell/weatherManager'

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
    scene: [
      // StartScene,
      LoadingScene,
      GameScene,
      WeatherScene, 
      // DayNightScene,
      CombatScene,
      UiScene,
      DialogueScene,
      InventoryScene
      // MenuScene,
    ],
  }
}

function initManagers(game) {
  managers = {
    ai: null,
    camera: CameraManager(),
    cell: CellManager(),
    collision: CollisionManager(),
    combat: CombatManager(),
    context: ContextManager(),
    data: DataManager(),
    debug: DebugManager(),
    dialogue: DialogueManager(),
    enemies: EnemyManager(), // TODO
    events: EventManager(),
    inventory: InventoryManager(),
    items: ItemManager(),
    keys: KeyManager(game),
    loading: LoadManager(),
    menus: null, // TODO
    music: MusicManager(),
    notifications: NotificationManager(),
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

