import { ADDR, CELL_PATH, CHAR_PATH, MAP_PATH } from 'constants/cfg'
import { STARTING_CELL } from 'constants/game'

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

var manager
var name
var cell
var dimensions

function CellManager() {
  if (!manager) {
    manager = {
      getSize() {
        // return map dimensions
        return dimensions
      },
      setCell(newCell) {
        name = newCell
      },
      async loadCell() {
        var json = await getCell(name)
        cell = await json.json()

        var csv = await getMap(name)

        dimensions = getDimensions(csv)

        // get csv data for measuring size
        
        // merge cell data with character data
        cell.chars = await this.loadChars(cell)

        return cell
      },
      async loadChars(cell) {
        return Promise.all(cell.chars.map(this.mergeChar))
      },
      async mergeChar(char) {
        var full = await (await getChar(char.name)).json()
        return { ...full, ...char }
      }
    }

    manager.setCell(STARTING_CELL)
  }

  return manager
}

export default CellManager