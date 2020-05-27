import { WEATHER_KEY, WEATHER_TILE_KEY } from "constants/keys"
import { TILE_SIZE, ZOOM_FACTOR } from "constants/dimensions/game"
import { WEATHER_LAYER_1, WEATHER_LAYER_2, WEATHER_LAYER_3, WEATHER_LAYER_4, WEATHER_RAINY, WEATHER_SUNNY } from "constants/weather"
import { E_SET_WEATHER } from "events/types"

import handler from "events/handler"

function rain() {
  currentWeather = WEATHER_RAINY

  weatherMap = scene.make.tilemap({
    key: WEATHER_KEY,
    tileWidth: TILE_SIZE, 
    tileHeight: TILE_SIZE
  })

  weatherSet = weatherMap.addTilesetImage(WEATHER_TILE_KEY)

  weatherLayer = weatherMap.createDynamicLayer(WEATHER_LAYER_1, weatherSet)
  weatherLayer.setScale(ZOOM_FACTOR)

  scene.sys.animatedTiles.init(weatherMap)
}

function sun() {
  currentWeather = WEATHER_SUNNY

  weatherMap.removeAllLayers() 
}

function setWeather(type) {
  if (type === WEATHER_RAINY && type !== currentWeather) {
    rain()
  } else if (type === WEATHER_SUNNY && type !== currentWeather) {
    sun()
  }
}

function init(newScene) {
  scene = newScene
}

var manager
var scene
var weatherMap
var weatherSet
var weatherLayer
var currentWeather = WEATHER_SUNNY

function WeatherManager() {
  if (!manager) {
    manager = {
      ...handler,
      init
    }
  }

  manager.on(E_SET_WEATHER, setWeather)

  return manager
}

export default WeatherManager