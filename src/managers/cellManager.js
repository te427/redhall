import { ADDR, CELL_PATH, CHAR_PATH } from 'constants/cfg'
import { STARTING_CELL } from 'constants/game'

function getJsonPath(path) {
  return path + '.json'
}

function getCellPath(cell) {
  return getJsonPath(CELL_PATH + cell)
}

function getCharPath(char) {
  return getJsonPath(CHAR_PATH + char)
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

function CellManager() {
  var manager
  var name
  var cell

  if (!manager) {
    manager = {
      setCell(newCell) {
        name = newCell
      },
      async loadCell() {
        var res = await getCell(name)
        cell = await res.json()
        
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