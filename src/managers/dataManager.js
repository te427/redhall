import YAML from 'yaml'

import { FILE_DATA_DIALOGUE_TOPICS, FILE_DATA_DIALOGUE_DEFAULTS } from 'constants/data/files'
import { CELL_PATH, CHAR_PATH, MAP_PATH, DIALOGUE_PATH, CELL_MAP_PATH } from 'constants/data/paths'
import { E_SET_CELL, E_LOAD_CELL_DATA, E_LOAD_DIALOGUE_DATA } from 'events/types'

import handler from "events/handler"
import { fullPath, json, path, yaml } from 'helpers/files'

async function getObj(path) {
  try {
    return fetch(fullPath(path))
  } catch(err) {
    console.error(err)
    return null
  }
}

function getCellPath(cell) {
  return yaml(path(CELL_PATH, cell))
}

function getCharPath(cell) {
  return yaml(path(CHAR_PATH, cell))
}

function getMapPath(cell) {
  return json(path(CELL_MAP_PATH, cell))
}

function getTopicsPath() {
  return FILE_DATA_DIALOGUE_TOPICS
}

function getDefaultDialoguePath() {
  return FILE_DATA_DIALOGUE_DEFAULTS
}

async function getCellData(cell) {
  return getObj(getCellPath(cell))
}

async function getCharData(cell) {
  return getObj(getCharPath(cell))
}

async function getMapData(cell) {
  return getObj(getMapPath(cell))
}

async function getTopicData() {
  return getObj(getTopicsPath())
}

async function getDefaultDialogueData() {
  return getObj(getDefaultDialoguePath())
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

async function loadChars(cell) {
  var res = await getCharData(cell)
  var charList =  res ? await YAML.parse(await res.text()) : []
  var charData = Array.isArray(charList) ? charList.reduce((acc, c) => ({ ...acc, [c.key]: c}), {}) : {}
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

async function loadDialogue() {
  var topicRes = await getTopicData()
  var topics = YAML.parse(await topicRes.text())

  var defaultRes = await getDefaultDialogueData()
  var defaults = YAML.parse(await defaultRes.text())

  manager.emit(E_LOAD_DIALOGUE_DATA, { topics, defaults })

  return true
}

async function preload() {
  if (!init) {
    init = await loadDialogue()
  }
}

async function load(cell) {
  if (init) {
    await init
  }
  await loadCell(cell)
  await loadMap()
  await loadChars(cell)

  manager.emit(E_LOAD_CELL_DATA, data)
}

var manager
var data
var init

function DataManager() {
  if (!manager) {
    manager = {
      ...handler,
      preload,
    }
    
    manager.on(E_SET_CELL, load)
  }

  return manager
}

export default DataManager