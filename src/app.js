import * as Phaser from 'phaser'

import { GAME_KEY, REAL_WIDTH, REAL_HEIGHT } from 'constants/cfg'

import { ZOOM_FACTOR } from 'constants/cfg'
import EventManager from 'events/manager'
import ContextManager from 'managers/contextManager'
import KeyManager from 'managers/keyManager'
import GameScene from 'scenes/game/game'
import LoadingScene from 'scenes/loading/loading'
import DialogueScene from 'scenes/dialogue/dialogue'

var config = {
  key: GAME_KEY,
  type: Phaser.AUTO,
  width: REAL_WIDTH,
  height: REAL_HEIGHT,
  zoom: ZOOM_FACTOR,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {},
  },
  scene: [LoadingScene, GameScene, DialogueScene],
}

const game = new Phaser.Game(config)

const events = EventManager()
const context = ContextManager()
const keys = KeyManager(game)


