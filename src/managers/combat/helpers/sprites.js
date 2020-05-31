import * as s from 'managers/combat/constants/sprites'
import { TILE_SIZE } from 'constants/dimensions/game'
import { COMBAT_SPRITE_DEPTH } from 'constants/depth'
import { COMBAT_SPRITE_KEY } from 'constants/keys'

function getArrowEnd(curr, prev) {
  if (curr.x === prev.x) {
    return curr.y > prev.y ? s.DOWN_ARROW : s.UP_ARROW
  } 
  if (curr.y === prev.y) {
    return curr.x > prev.x ? s.RIGHT_ARROW :s.LEFT_ARROW
  }
}

function getArrowMiddle(next, curr, prev) {
  var comingFromLeft = prev.x < curr.x
  var comingFromRight = prev.x > curr.x
  var comingFromTop = prev.y < curr.y
  var comingFromBottom = prev.y > curr.y

  var goingToLeft = next.x < curr.x
  var goingToRight = next.x > curr.x
  var goingToTop = next.y < curr.y
  var goingToBottom = next.y > curr.y

  if ((comingFromTop && goingToBottom) ||
      (comingFromBottom && goingToTop)) {
    return s.VERTICAL
  }

  if ((comingFromLeft && goingToRight) ||
      (comingFromRight && goingToLeft)) {
    return s.HORIZONTAL
  }

  if ((comingFromLeft && goingToTop) ||
      (comingFromTop && goingToLeft)) {
    return s.LEFT_UP_BEND
  }

  if ((comingFromRight && goingToTop) ||
      (comingFromTop && goingToRight)) {
    return s.UP_RIGHT_BEND
  }

  if ((comingFromRight && goingToBottom) ||
      (comingFromBottom && goingToRight)) {
    return s.DOWN_RIGHT_BEND
  }

  if ((comingFromLeft && goingToBottom) ||
      (comingFromBottom && goingToLeft)) {
    return s.LEFT_DOWN_BEND
  }
}

var cursor
var moves = []
var arrow = []
var attacks = []

export default {
  reset() {
    if (cursor) {
      cursor.destroy()
    }
    moves.forEach(s => s.destroy())
    moves = []
    arrow.forEach(s => s.destroy())
    arrow = []
    attacks.forEach(s => s.destroy())
    attacks = []
  },
  drawPath(scene, path) {
    if (cursor) {
      cursor.destroy()
    }

    if (path.length <= 1) {
      return
    }

    arrow.forEach(s => s.destroy())
    var index = path.length - 2

    while (index) {
      // draw arrow body
      var pos = path[index]
      var segment = scene.add.image(
          TILE_SIZE * (pos.x),
          TILE_SIZE * (pos.y),
          COMBAT_SPRITE_KEY, getArrowMiddle(path[index - 1], pos, path[index + 1]))
      segment.setOrigin(0, 0)
      arrow.push(segment)
      index--
    }

    var pos = path[index]
    var head = scene.add.image(
        TILE_SIZE * (pos.x),
        TILE_SIZE * (pos.y),
        COMBAT_SPRITE_KEY, getArrowEnd(pos, path[index + 1]))
    head.setOrigin(0, 0)

    arrow.push(head)
  },
  removePath() {
    arrow.forEach(s => s.destroy())
  },
  drawPossibleMoves(scene, center, possible) {
    var origin = possible.origin
    var tiles = possible.tiles

    if (tiles.length) {
      for (var y = 0; y < tiles.length; y++) {
        var offsetY = origin.y + y
        for (var x = 0; x < tiles[0].length; x++) {
          var offsetX = origin.x + x
          var valid = tiles[y][x] && (x != center.x && y != center.y)
          if (valid) {
            var tile = scene.add.image(
                TILE_SIZE * (offsetX),
                TILE_SIZE * (offsetY),
                COMBAT_SPRITE_KEY, s.MOVE_HIGHLIGHT)
            tile.setOrigin(0, 0)
            moves.push(tile)
          }
        }
      }
    }
  },
  drawPossibleAttacks(scene, positions) {
    attacks = positions.map(p => scene.add.image(
        TILE_SIZE * p.x, TILE_SIZE * p.y, COMBAT_SPRITE_KEY, s.ATTACK_HIGHLIGHT))
    attacks.forEach(a => a.setOrigin(0, 0))
  },
  drawInvalid(scene, pos) {
    // move this and drawValid into drawCursor method that chooses whether a move is valid or not
    if (cursor) {
      cursor.destroy()
    }

    cursor = scene.add.image(TILE_SIZE * pos.x, TILE_SIZE * pos.y, COMBAT_SPRITE_KEY, s.INVALID)
    cursor.setOrigin(0, 0)
    //.depth = COMBAT_SPRITE_DEPTH
  },
  drawValid(scene, pos) {
    if (cursor) {
      cursor.destroy()
    }

    cursor = scene.add.image(TILE_SIZE * pos.x, TILE_SIZE * pos.y, COMBAT_SPRITE_KEY, s.VALID)
    cursor.setOrigin(0, 0)
    //sprite.depth = COMBAT_SPRITE_DEPTH
  },
  drawCursor(scene, pos, possible) {
    if (cursor) {
      cursor.destroy()
    }

    var valid = !!possible.find(p => p.x === pos.x && p.y === pos.y) 

    cursor = scene.add.image(TILE_SIZE * pos.x, TILE_SIZE * pos.y, COMBAT_SPRITE_KEY,
        valid ? s.VALID : s.INVALID)
    cursor.setOrigin(0, 0)
  }
}