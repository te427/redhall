import { TERRAIN_LAYER } from "constants/layers"
import { DEFAULT_CELL_VALUE, DISABLED_CELL_VALUE } from "managers/combat/constants/paths"

function traverse(bf, x, y, dist, prev) {
  if (x < 0 || y < 0 || x >= width || y >= height || bf[y][x].dist <= dist) return

  bf[y][x] = { dist, prev } 
  var curr = { x, y }

  traverse(bf, x, y - 1, dist + 1, curr)
  traverse(bf, x, y + 1, dist + 1, curr)
  traverse(bf, x - 1, y, dist + 1, curr)
  traverse(bf, x + 1, y, dist + 1, curr)
}

function shortestPath(from, to, speed) {
  if (!battlefield) {
    throw new Error('No battlefield!')
  }

  if (from.x < 0 || to.x < 0 || from.y < 0 || to.y < 0 ||
      from.x >= width || to.x >= width || from.y >= height || to.y >= height) {
    throw new Error('From and to need to be in battlefield bounds!')
  }

  var bf = []

  // TODO: fix enemies not colliding with these
  for (var y = 0; y < height; y++) {
    bf[y] = []
    for (var x = 0; x < width; x++) {
      bf[y][x] = Object.assign({}, battlefield[y][x] ? DISABLED_CELL_VALUE : DEFAULT_CELL_VALUE)
    }
  }

  //var playerPos = entities.player.getPos()
  //bf[playerPos.y][playerPos.x] = DISABLED_CELL_VALUE

  //var enemyPositions = entities.enemies.map(e => e.getPos())
  //enemyPositions.forEach(p => bf[p.y][p.x] = (p.x === from.x && p.y === from.y
  //    ? DEFAULT_CELL_VALUE
  //    : DISABLED_CELL_VALUE))

  traverse(bf, from.x, from.y, 0, null)

  var x = to.x
  var y = to.y

  var block = bf[y][x]
  var path = []

  while (block.prev !== null) {
    path.push({ x, y })
    y = block.prev.y
    x = block.prev.x
    block = bf[y][x]
  }

  var diff = Math.max(path.length - speed, 0)

  return path.slice(diff)
}

function traverseAndMark(possible, x, y, speed, dist, prev) {
  if (!possible.length || dist > speed || y < 0 || y >= possible.length ||
      x < 0 || x >= possible[0].length || possible[y][x].dist <= dist ) return

  possible[y][x] = { dist, prev }
  var curr = { x, y }

  traverseAndMark(possible, x, y - 1, speed, dist + 1, curr)
  traverseAndMark(possible, x, y + 1, speed, dist + 1, curr)
  traverseAndMark(possible, x - 1, y, speed, dist + 1, curr)
  traverseAndMark(possible, x + 1, y, speed, dist + 1, curr)
}

function transformAndSetBattlefield(map) {
  var field = []

  map.setLayer(TERRAIN_LAYER)

  map.forEachTile((t, i) => {
    var row = Math.floor(i / width)
    var col = i % width

    if (!col) {
      field[row] = []
    }

    field[row][col] = t.properties.collide
  })

  battlefield = field 
}

function setDimensions(map) {
  width = map.width
  height = map.height
}

function setEntities(player, npcs, enemies) {
  entities = { player, npcs, enemies }
}

function setPossiblePaths(from, speed) {
  var leftBound = Math.max(from.x - speed, 0)
  var rightBound = Math.min(from.x + speed, width)
  var upperBound = Math.max(from.y - speed, 0)
  var lowerBound = Math.min(from.y + speed, height)

  possibleBound = { x: leftBound, y: upperBound }
  possibleWidth = rightBound - leftBound
  possibleHeight = lowerBound - upperBound

  var possible = []
  var enemyPositions = entities.enemies.map(e => e.getPos())

  // TODO: combine with below for loop
  for (var y = 0; y < lowerBound - upperBound; y++) {
    possible[y] = []
    for (var x = 0; x < rightBound - leftBound; x++) {
      possible[y][x] = Object.assign({}, DEFAULT_CELL_VALUE)
    }
  }

  possibleOrigin = { x: from.x - leftBound, y: from.y - upperBound }

  // mark non traversible positions in possible array
  for (var y = upperBound; y < lowerBound; y++) {
    for (var x = leftBound; x < rightBound; x++) {
      if (battlefield[y][x] || enemyPositions.find(p => p.x === x && p.y === y)) {
        // mark as negative if untraversible
        possible[y - upperBound][x - leftBound] = Object.assign({}, DISABLED_CELL_VALUE)
      }
      // mark squares that have enemies/npcs/non-traversible items
    }
  }

  traverseAndMark(possible, possibleOrigin.x, possibleOrigin.y, speed, 0, null)

  possiblePaths = possible
}

function getPossibleOverlay() {
  return possiblePaths.map((row) => row.map(cell => cell.dist >= 0 && cell.dist < 100))
}

function getPossiblePath(to) {
  var x = to.x - possibleBound.x
  var y = to.y - possibleBound.y
  var path = []

  if (x < 0 || x >= possibleWidth || y < 0 || y >= possibleHeight) {
    return path
  }

  var block = possiblePaths[y][x]
  if (!block.prev) {
    return path
  }


  while (block.prev !== null) {
    path.push({ x, y })
    y = block.prev.y
    x = block.prev.x
    block = possiblePaths[y][x]
  }

  path = path.map(p => ({ x: p.x + possibleBound.x, y: p.y + possibleBound.y }))

  if (path.length) {
    path.push({ x: possibleOrigin.x + possibleBound.x,
        y: possibleOrigin.y + possibleBound.y })
  }

  return path
}

// 2d array of booleans (whether traversible or not)
var battlefield 
var width
var height
var entities 
var possiblePaths
var possibleOrigin
var possibleBound
var possibleWidth
var possibleHeight

export default {
  setBattlefield(map, player, npcs, enemies) {
    setDimensions(map)
    setEntities(player, npcs, enemies)
    transformAndSetBattlefield(map)
  },
  getShortestPath(from, to, speed) {
    return shortestPath(from, to, speed)
  },
  getPossiblePaths(from, speed) {
    /*
     * Return an object with
     * {
     *   origin: { int, int } // top left position of grid 
     *   tiles: bool[][] // possible spots to highlight
     * }
     */
    // todo - cache this?
    setPossiblePaths(from, speed)
    var tiles = getPossibleOverlay()
    var origin = possibleBound

    return { tiles, origin }
  },
  getPossiblePath(to) {
    if (possiblePaths) {
      return getPossiblePath(to)
    } else {
      throw new Error('No possible paths!')
    }
  }
}