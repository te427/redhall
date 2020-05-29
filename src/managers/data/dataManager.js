import YAML from 'yaml'

import { FILE_DATA_DIALOGUE_TOPICS, FILE_DATA_DIALOGUE_DEFAULTS, FILE_DATA_ITEMS_NONCOLLISION, FILE_DATA_ENEMIES_TYPES } from 'managers/data/constants/files'
import { CELL_PATH, CHAR_PATH, MAP_PATH, DIALOGUE_PATH, CELL_MAP_PATH, ENEMIES_PATH } from 'managers/data/constants/paths'
import { E_SET_CELL, E_LOAD_CELL_DATA, E_LOAD_DIALOGUE_DATA, E_LOAD_NON_COLLISION_ITEM_DATA, E_LOAD_ENEMY_DATA } from 'events/types'

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

function getEnemyPath() {
  return FILE_DATA_ENEMIES_TYPES
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

function getNonCollisionItemPath() {
  return FILE_DATA_ITEMS_NONCOLLISION
}

async function getCellData(cell) {
  return getObj(getCellPath(cell))
}

async function getCharData(cell) {
  return getObj(getCharPath(cell))
}

async function getEnemyData() {
  return getObj(getEnemyPath())
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

async function getNonCollisionItemData() {
  return getObj(getNonCollisionItemPath())
}

function getDimensions(obj) {
  var y = obj.height
  var x = obj.width
  return { x, y }
}

function getTiles(obj) {
  return obj.tilesets[0].name
} 

function mergeChar(charData) {
  return (npc) => ({ ...npc, ...charData[npc.key] })
}

function mergeEnemy(enemyData) {
  return (enemy) => ({ ...enemy, ...enemyData[enemy.key] })
}

async function mergeCellAndCharData(charData) {
  if (data.npcs) {
    data.npcs = await Promise.all(data.npcs.map(mergeChar(charData)))
  }
}

function mergeCellAndEnemyData(enemyData) {
  if (data.enemies) {
    data.enemies = Object.values(data.enemies).map(mergeEnemy(enemyData))
  }
}

async function loadChars(cell) {
  var res = await getCharData(cell)
  var charList =  res ? await YAML.parse(await res.text()) : []
  var charData = Array.isArray(charList) ? charList.reduce((acc, c) => ({ ...acc, [c.key]: c}), {}) : {}
  await mergeCellAndCharData(charData)
}

async function loadEnemies() {
  var res = await getEnemyData()
  var enemyData =  res ? await YAML.parse(await res.text()) : []
  await mergeCellAndEnemyData(enemyData)
}

async function loadMap() {
  var res = await getMapData(data.map)

  var obj = await res.json()

  var dimensions = await getDimensions(obj)
  var tiles = await getTiles(obj)

  data.dimensions = dimensions
  data.tiles = tiles
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

async function loadItems() {
  var nonCollisionItemRes = await getNonCollisionItemData()
  var nonCollisionItems = YAML.parse(await nonCollisionItemRes.text())

  manager.emit(E_LOAD_NON_COLLISION_ITEM_DATA, nonCollisionItems)

  // load collision items
}

async function preload() {
  if (!init) {

    init = await Promise.all([
      loadDialogue(),
      loadItems(),
    ])
  }
}

async function load(cell) {
  if (init) {
    await init
  }
  await loadCell(cell)
  await loadMap()
  await loadChars(cell)
  await loadEnemies()

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