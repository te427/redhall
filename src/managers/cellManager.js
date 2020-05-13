import { MAP_KEY, ITEM_KEY, WORLD_TILE_KEY, ITEM_TILE_KEY, BG_KEY, FG_KEY, TILE_SIZE, ADDR, CELL_PATH, CHAR_PATH, MAP_PATH } from 'constants/cfg'
import { STARTING_CELL, STARTING_ENTRANCE } from 'constants/game'
import { SCENE_LOADING } from 'constants/scenes'

function getJsonPath(path) {
  return path + '.json'
}

function getCellPath(cell) {
  return getJsonPath(CELL_PATH + cell)
}

function getCharPath(char) {
  return getJsonPath(CHAR_PATH + char)
}

function getMapPath(cell) {
  return getJsonPath(MAP_PATH + cell)
}

async function getObj(path) {
  return fetch(ADDR + path)
}

async function getCell(cell) {
  return getObj(getCellPath(cell))
}

async function getChar(char) {
  return getObj(getCharPath(char))
}

async function getMap(cell) {
  return getObj(getMapPath(cell))
}

async function getDimensions(mapRes) {
  var obj = await mapRes.json()
  var y = obj.height
  var x = obj.width
  return { x, y }
}
async function loadChars(cell) {
  cell.chars = await Promise.all(cell.chars.map(mergeChar))
}

async function mergeChar(char) {
  var full = await (await getChar(char.name)).json()
  return { ...full, ...char }
}

var manager
var entrance
var spawn
var cell
var data
var dimensions
var worldMap
var bgSet
var bgLayer
var fgMap
var fgSet
var fgLayer

function CellManager() {
  if (!manager) {
    manager = {
      getSize() {
        return dimensions
      },
      getBackground() {
        return bgLayer
      },
      getForeground() {
        return fgLayer
      },
      getSpawn() {
        return spawn
      },
      setEntrance(name) {
        entrance = name
      },
      setCell(newCell) {
        cell = newCell
      },
      async loadCell() {
        var cellRes = await getCell(cell)
        data = await cellRes.json()

        var mapRes = await getMap(cell)
        dimensions = await getDimensions(mapRes)

        spawn = data.entrances.find(p => p.name === entrance)

        await loadChars(data)
        return data
      },
      init(scene) {
        worldMap = scene.make.tilemap({
          key: cell + MAP_KEY, 
          tileWidth: TILE_SIZE, 
          tileHeight: TILE_SIZE
        })

        bgSet = worldMap.addTilesetImage(WORLD_TILE_KEY)
        bgLayer = worldMap.createStaticLayer(BG_KEY, bgSet)

        data.exits.forEach(tile => {
          bgLayer.setTileLocationCallback(tile.x, tile.y, 1, 1, () => {
            this.setEntrance(cell)
            this.setCell(tile.name)
            scene.scene.start(SCENE_LOADING)
          })
        })

        fgSet = worldMap.addTilesetImage(ITEM_TILE_KEY)
        fgLayer = worldMap.createDynamicLayer(FG_KEY, fgSet)

        scene.physics.world.setBounds(0, 0, dimensions.x * TILE_SIZE, dimensions.y * TILE_SIZE)
        scene.cameras.main.setBounds(0, 0, dimensions.x * TILE_SIZE, dimensions.y * TILE_SIZE)
      },
      destroy() {
        if (worldMap) {
          worldMap.destroy()
        }

        if (bgLayer) {
          bgLayer.destroy()
        }
      }
    }

    manager.setCell(STARTING_CELL)
    manager.setEntrance(STARTING_ENTRANCE)
  }

  return manager
}

export default CellManager