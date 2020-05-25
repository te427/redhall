import * as Phaser from 'phaser'

import { SCENE_WEATHER } from 'constants/scenes'

import WeatherManager from 'managers/weatherManager'

class WeatherScene extends Phaser.Scene {
  constructor() {
    super(SCENE_WEATHER)

    this.weatherManager = WeatherManager()
  }

  create() {
    this.weatherManager.init(this)
  }
}

export default WeatherScene 