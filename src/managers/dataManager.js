import YAML from 'yaml'
import { ADDR, CELL_PATH, CHAR_PATH, MAP_PATH } from 'constants/cfg'
import { E_SET_CELL, E_LOAD_DATA, E_CHANGE_SCENE } from 'events/types'
import handler from "events/handler"

async function getObj(path) {
  return fetch(ADDR + path)
}

function getYamlPath(path) {
  return path + '.yaml'
}

function getJSONPath(path) {
  return path + '.json'
}

function getCellPath(cell) {
  return getYamlPath(CELL_PATH + cell)
}

function getCharPath() {
  return getYamlPath(CHAR_PATH)
}

function getMapPath(cell) {
  return getJSONPath(MAP_PATH + cell)
}

async function getCellData(cell) {
  return getObj(getCellPath(cell))
}

async function getCharData() {
  return getObj(getCharPath())
}

async function getMapData(cell) {
  return getObj(getMapPath(cell))
}

async function getDimensions(mapRes) {
  var obj = await mapRes.json()
  var y = obj.height
  var x = obj.width
  return { x, y }
}

function mergeChar(charData) {
  return (npc) => ({ ...npc, ...charData[npc.key] })
}

async function mergeCellAndCharData(charData) {
  data.npcs = await Promise.all(data.npcs.map(mergeChar(charData)))
}

async function loadChars() {
  var res = await getCharData()
  var charList = await YAML.parse(await res.text() )
  var charData = charList.reduce((acc, c) => ({ ...acc, [c.key]: c}), {})
  await mergeCellAndCharData(charData)
}

async function loadMap() {
  var res = await getMapData(data.map)
  var dimensions = await getDimensions(res)
  data.dimensions = dimensions
}

async function loadCell(cell) {
  var res = await getCellData(cell)
  data = YAML.parse(await res.text())
}

async function load(cell) {
  await loadCell(cell)
  await loadMap()
  await loadChars()

  manager.emit(E_LOAD_DATA, data)
}

var manager
var data

function DataManager() {
  if (!manager) {
    manager = {
      ...handler,
    }
    
    manager.on(E_SET_CELL, load)
  }

  return manager
}

export default DataManager