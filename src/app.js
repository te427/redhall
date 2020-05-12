import * as Phaser from 'phaser'

import { GAME_KEY, REAL_WIDTH, REAL_HEIGHT } from 'constants/cfg'

import GameScene from 'scenes/game/game'
import LoadingScene from 'scenes/loading/loading'
import DialogueScene from 'scenes/dialogue/dialogue'
import { ZOOM_FACTOR } from './constants/cfg'

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


