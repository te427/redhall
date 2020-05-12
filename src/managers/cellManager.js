import { MAP_KEY, TILE_KEY, BG_KEY, TILE_SIZE, ADDR, CELL_PATH, CHAR_PATH, MAP_PATH } from 'constants/cfg'
import { STARTING_CELL, STARTING_ENTRANCE } from 'constants/game'
import { SCENE_LOADING } from 'constants/scenes'

function getCsvPath(path) {
  return path + '.csv'
}

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
  return getCsvPath(MAP_PATH + cell)
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

async function getDimensions(csv) {
  var text = await csv.text()
  var array = text.split(/\r?\n|\r/);
  var y = array.length - 1
  var x = y > 0 ? array[0].split(',').length : 0
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
var tilemap
var tileset
var bg

function CellManager() {
  if (!manager) {
    manager = {
      getSize() {
        return dimensions
      },
      getBackground() {
        return bg
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
        var json = await getCell(cell)
        data = await json.json()

        var csv = await getMap(cell)
        dimensions = await getDimensions(csv)

        spawn = data.entrances.find(p => p.name === entrance)

        await loadChars(data)
        return data
      },
      init(scene) {
        tilemap = scene.make.tilemap({
          key: cell + MAP_KEY, 
          tileWidth: TILE_SIZE, 
          tileHeight: TILE_SIZE
        })

        tileset = tilemap.addTilesetImage(TILE_KEY)

        bg = tilemap.createStaticLayer(BG_KEY, tileset)

        data.exits.forEach(tile => {
          bg.setTileLocationCallback(tile.x, tile.y, 1, 1, () => {
            this.setEntrance(cell)
            this.setCell(tile.name)
            scene.scene.start(SCENE_LOADING)
          })
        })

        scene.physics.world.setBounds(0, 0, dimensions.x * TILE_SIZE, dimensions.y * TILE_SIZE)
        scene.cameras.main.setBounds(0, 0, dimensions.x * TILE_SIZE, dimensions.y * TILE_SIZE)
      },
      destroy() {
        if (tilemap) {
          tilemap.destroy()
        }

        if (bg) {
          bg.destroy()
        }
      }
    }

    manager.setCell(STARTING_CELL)
    manager.setEntrance(STARTING_ENTRANCE)
  }

  return manager
}

export default CellManager