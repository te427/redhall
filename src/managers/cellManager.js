import { TILE_SIZE } from 'constants/dimensions/game'
import { STARTING_CELL, STARTING_ENTRANCE } from 'constants/game'
import { WORLD_TILE_KEY, WORLD_LAYER_KEY } from 'constants/keys'
import { E_INIT_SPAWN, E_SET_CELL, E_LOAD_CELL_DATA, E_INIT_TERRAIN, E_CHANGE_SCENE, E_INIT_TILEMAP, E_MOVE_TO_CELL } from 'events/types'

import handler from 'events/handler'
import { mapKey } from 'helpers/keys'

function setEntrance(name) {
  entrance = name
}

function setCell(newCell) {
  cell = newCell
}

function initWorld() {
  cellMap = scene.make.tilemap({
    key: mapKey(cell), 
    tileWidth: TILE_SIZE, 
    tileHeight: TILE_SIZE
  })
}

function initTerrain() {
  terrainSet = cellMap.addTilesetImage(WORLD_TILE_KEY)
  terrainLayer = cellMap.createStaticLayer(WORLD_LAYER_KEY, terrainSet)

  if (data.exits) {
    data.exits.forEach(function(tile) {
      terrainLayer.setTileLocationCallback(tile.x, tile.y, 1, 1,
          () => moveToCell({ entrance: cell, cell: tile.name }))
    })
  }

  manager.emit(E_INIT_TERRAIN, terrainLayer)

  // we can add other layers once the initial has been added
  manager.emit(E_INIT_TILEMAP, cellMap)
}

function initBounds() {
  scene.physics.world.setBounds(0, 0, data.dimensions.x * TILE_SIZE, data.dimensions.y * TILE_SIZE)
  scene.cameras.main.setBounds(0, 0, data.dimensions.x * TILE_SIZE, data.dimensions.y * TILE_SIZE)
}

function initSpawn() {
  var spawn = entrance ? data.entrances.find(e => e.name === entrance) : data.entrances[0]
  manager.emit(E_INIT_SPAWN, spawn)
}

function renderCell() {
  initWorld()
  initTerrain()
  initBounds()
  initSpawn()
}

function setCellData(cellData) {
  data = cellData
}

function moveToCell(cellData) {
  // make this take a pos for spawning in non entrances
  setEntrance(cellData.entrance)
  setCell(cellData.cell)
  manager.emit(E_CHANGE_SCENE, cell)
}

function loadCell(cell) {
  manager.emit(E_SET_CELL, cell)
}

var manager
var entrance 
var cell
var data
var scene
var cellMap
var terrainSet
var terrainLayer

function CellManager() {
  if (!manager) {
    manager = {
      ...handler,
      init(newScene) {
        scene = newScene
      },
      load() {
        loadCell(cell)
      },
      render() {
        renderCell()
      },
      destroy() {
        if (cellMap) {
          cellMap.destroy()
        }

        if (terrainLayer) {
          terrainLayer.destroy()
        }
      }
    }

    manager.on({
      [E_LOAD_CELL_DATA]: setCellData,
      [E_MOVE_TO_CELL]: moveToCell,
    })

    setCell(STARTING_CELL)
    setEntrance(STARTING_ENTRANCE)
  }

  return manager
}

export default CellManager